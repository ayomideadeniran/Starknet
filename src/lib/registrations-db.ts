import { promises as fs } from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import { WaitlistModel } from '@/models/Waitlist';

const DB_DIR = path.join(process.cwd(), 'data');
const REGISTRATIONS_FILE = path.join(DB_DIR, 'registrations.json');

export interface RegistrationRecord {
  ticketId: string;
  queueNumber: number;
  fullName: string;
  email: string;
  phone: string;
  phonePrefix?: string;
  phoneNumber?: string;
  country: string;
  investmentTier: string;
  paymentMethod: string;
  investorType: string;
  primaryInterest: string;
  telegramHandle?: string;
  referralCode?: string;
  notes?: string;
  termsAgreed?: boolean;
  priorityStatus: 'VIP' | 'Institutional' | 'Standard';
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  syncedToMongo?: boolean;
  [key: string]: any; // Allow any custom dynamic fields
}

// Ensure database directory and file exist
async function ensureDbFile(): Promise<void> {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch {}

  try {
    await fs.access(REGISTRATIONS_FILE);
  } catch {
    await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Read all actual registrations from persistent storage
export async function getActualRegistrations(): Promise<RegistrationRecord[]> {
  await ensureDbFile();
  try {
    const raw = await fs.readFile(REGISTRATIONS_FILE, 'utf-8');
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('[Database] Failed to read registrations.json:', err);
    return [];
  }
}

// Write registrations array to persistent storage
async function writeRegistrations(records: RegistrationRecord[]): Promise<void> {
  await ensureDbFile();
  await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

// Get the actual number of people who have registered successfully
export async function getActualRegistrationCount(): Promise<number> {
  const records = await getActualRegistrations();
  return records.length;
}

// Find an existing registration by email
export async function findActualRegistrationByEmail(email: string): Promise<RegistrationRecord | null> {
  const cleanEmail = email.trim().toLowerCase();
  const records = await getActualRegistrations();
  return records.find((r) => r.email.toLowerCase() === cleanEmail) || null;
}

/**
 * Dispatch registration directly to MongoDB Atlas via HTTPS Data API (Port 443).
 * Bypasses all local network/ISP port 27017 blocks!
 */
export async function syncToAtlasHttpsDataApi(record: any): Promise<boolean> {
  const apiKey = process.env.MONGODB_DATA_API_KEY;
  const endpoint = process.env.MONGODB_DATA_API_URL;
  const dataSource = process.env.MONGODB_DATA_SOURCE || 'Cluster0';
  const database = process.env.MONGODB_DATABASE || 'starknet';

  if (!apiKey || !endpoint) return false;

  try {
    const cleanUrl = endpoint.replace(/\/$/, '');
    const url = cleanUrl.endsWith('/action/updateOne') ? cleanUrl : `${cleanUrl}/action/updateOne`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        dataSource,
        database,
        collection: 'registrations',
        filter: { email: record.email },
        update: {
          $set: {
            ...record,
            updatedAt: { $date: new Date().toISOString() },
          },
        },
        upsert: true,
      }),
    });

    if (res.ok) {
      console.log(`[HTTPS Data API] ✅ Successfully pushed ${record.email} to MongoDB Atlas registrations collection over port 443!`);
      return true;
    } else {
      const errText = await res.text();
      console.warn(`[HTTPS Data API] Response notice (${res.status}):`, errText);
      return false;
    }
  } catch (err: any) {
    console.warn('[HTTPS Data API] Dispatch notice:', err.message);
    return false;
  }
}

// Synchronize any pending records that haven't reached MongoDB yet
export async function syncPendingRegistrationsToMongo(): Promise<number> {
  const records = await getActualRegistrations();
  let syncedCount = 0;

  // 1. Try HTTPS Data API first (over port 443)
  if (process.env.MONGODB_DATA_API_KEY && process.env.MONGODB_DATA_API_URL) {
    for (let i = 0; i < records.length; i++) {
      if (!records[i].syncedToMongo) {
        const ok = await syncToAtlasHttpsDataApi(records[i]);
        if (ok) {
          records[i].syncedToMongo = true;
          syncedCount++;
        }
      }
    }
    if (syncedCount > 0) {
      await writeRegistrations(records);
      console.log(`[Database] Synced ${syncedCount} registrations to Atlas via HTTPS Data API.`);
    }
    return syncedCount;
  }

  // 2. Fallback to standard TCP Mongoose (port 27017 for production hosts)
  try {
    await connectToDatabase();
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      if (!rec.syncedToMongo) {
        await WaitlistModel.findOneAndUpdate(
          { email: rec.email },
          { $set: { ...rec, updatedAt: new Date() } },
          { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
        records[i].syncedToMongo = true;
        syncedCount++;
      }
    }

    if (syncedCount > 0) {
      await writeRegistrations(records);
      console.log(`[Database] Successfully synced ${syncedCount} pending registrations to MongoDB Atlas.`);
    }

    return syncedCount;
  } catch (err: any) {
    console.warn('[Database] Sync pending registrations notice:', err.message);
    return 0;
  }
}

export type RegistrationInput = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  investmentTier?: string;
  paymentMethod?: string;
  investorType?: string;
  primaryInterest?: string;
  telegramHandle?: string;
  referralCode?: string;
  notes?: string;
  termsAgreed?: boolean;
  priorityStatus?: 'VIP' | 'Institutional' | 'Standard';
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
};

// Save a new registration to persistent storage and push all inputs to MongoDB Atlas
export async function saveActualRegistration(
  data: RegistrationInput
): Promise<RegistrationRecord> {
  await ensureDbFile();
  const records = await getActualRegistrations();

  const cleanEmail = data.email.trim().toLowerCase();
  const existingIndex = records.findIndex((r) => r.email.toLowerCase() === cleanEmail);

  let newRecord: RegistrationRecord;

  if (existingIndex >= 0) {
    // Update existing record
    const prev = records[existingIndex];
    newRecord = {
      ...prev,
      ...data,
      fullName: data.fullName || prev.fullName,
      email: cleanEmail,
      phone: data.phone || prev.phone,
      country: data.country || prev.country,
      investmentTier: data.investmentTier || prev.investmentTier,
      paymentMethod: data.paymentMethod || prev.paymentMethod,
      investorType: data.investorType || prev.investorType,
      primaryInterest: data.primaryInterest || prev.primaryInterest,
      priorityStatus: data.priorityStatus || prev.priorityStatus,
      queueNumber: prev.queueNumber,
      ticketId: prev.ticketId,
      createdAt: prev.createdAt,
      syncedToMongo: false,
    };
    records[existingIndex] = newRecord;
  } else {
    // Create new sequential actual record (starts at 1, 2, 3...)
    const queueNumber = records.length + 1;
    const ticketId = `STARK-VIP-${queueNumber.toString().padStart(5, '0')}`;

    newRecord = {
      ...data,
      fullName: data.fullName,
      email: cleanEmail,
      phone: data.phone,
      country: data.country,
      investmentTier: data.investmentTier || '$10,000 – $50,000',
      paymentMethod: data.paymentMethod || 'USDT / USDC (Stablecoins)',
      investorType: data.investorType || 'Individual / Private Investor ($200+ Starter)',
      primaryInterest: data.primaryInterest || 'Starknet Bitcoin ZK-Vault & 30% – 50% Monthly Yield',
      priorityStatus: data.priorityStatus || 'VIP',
      queueNumber,
      ticketId,
      createdAt: new Date().toISOString(),
      syncedToMongo: false,
    };
    records.push(newRecord);
  }

  // 1. Always save locally to disk first (zero data loss guarantee)
  await writeRegistrations(records);

  // 2. Push all inputs directly into MongoDB Atlas:
  // First attempt via HTTPS Data API (Port 443, immune to port 27017 firewall blocking)
  const httpsSynced = await syncToAtlasHttpsDataApi({ ...data, ...newRecord });
  if (httpsSynced) {
    newRecord.syncedToMongo = true;
    const updatedRecords = await getActualRegistrations();
    const idx = updatedRecords.findIndex((r) => r.email === cleanEmail);
    if (idx >= 0) {
      updatedRecords[idx].syncedToMongo = true;
      await writeRegistrations(updatedRecords);
    }
  } else {
    // Fallback: Standard Mongoose TCP connection (Port 27017 for production/cloud hosting)
    try {
      await connectToDatabase();
      await WaitlistModel.findOneAndUpdate(
        { email: cleanEmail },
        {
          $set: {
            ...data,
            ...newRecord,
            email: cleanEmail,
            updatedAt: new Date(),
          },
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );

      newRecord.syncedToMongo = true;
      const updatedRecords = await getActualRegistrations();
      const idx = updatedRecords.findIndex((r) => r.email === cleanEmail);
      if (idx >= 0) {
        updatedRecords[idx].syncedToMongo = true;
        await writeRegistrations(updatedRecords);
      }
      console.log(`[Database] Successfully saved registration for ${cleanEmail} directly to MongoDB Atlas ('registrations' collection)!`);

      // Also background sync any previously pending records
      syncPendingRegistrationsToMongo().catch(() => {});
    } catch (mongoErr: any) {
      console.warn('[Database] MongoDB Atlas connection pending (saved to data/registrations.json until MongoDB is reachable):', mongoErr.message);
    }
  }

  return newRecord;
}
