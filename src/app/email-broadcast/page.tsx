'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function EmailBroadcastPage() {
  const [recipientInput, setRecipientInput] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  const [registeredUsersCount, setRegisteredUsersCount] = useState<number | null>(null);

  // Email Content
  const [subject, setSubject] = useState('Priority Access: Experience Bitcoin on Starknet Layer-2');
  const [headline, setHeadline] = useState('VIP Priority Access Invitation');
  const [message, setMessage] = useState(
    'You are invited to join the priority registration window for the Bitcoin & Starknet Layer-2 ecosystem.\n\nBy bundling transactions into cryptographic STARK proofs, the platform makes Bitcoin operations faster, significantly cheaper, and mathematically transparent.'
  );
  const [ctaText, setCtaText] = useState('Claim VIP Priority Ticket →');
  const [ctaUrl, setCtaUrl] = useState('https://starknetsupport.netlify.app/register');

  // EmailJS Credentials
  const [serviceId, setServiceId] = useState('service_qcwhmbh');
  const [templateId, setTemplateId] = useState('template_cmike7r');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  // Sending status
  const [isSending, setIsSending] = useState(false);
  const [responseLog, setResponseLog] = useState<any>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Fetch initial info from API
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/email/send');
      const data = await res.json();
      if (data.registeredUsersCount !== undefined) {
        setRegisteredUsersCount(data.registeredUsersCount);
      }
      if (data.emailJsConfig?.serviceId) {
        setServiceId(data.emailJsConfig.serviceId);
      }
      if (data.emailJsConfig?.templateId) {
        setTemplateId(data.emailJsConfig.templateId);
      }
    } catch {}
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Compute parsed addresses
  const parsedEmails = recipientInput
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes('@') && e.includes('.'));
  const uniqueRecipientCount = Array.from(new Set(parsedEmails)).length;

  // Handle Load All Registered Users
  const handleLoadRegisteredUsers = async () => {
    try {
      const res = await fetch('/api/admin/registrations');
      const data = await res.json();
      if (Array.isArray(data.registrations) && data.registrations.length > 0) {
        const emails = data.registrations.map((r: any) => r.email).filter(Boolean);
        setRecipientInput(emails.join(',\n'));
        setSendToAll(false);
      }
    } catch {
      setSendToAll(true);
    }
  };

  // Dispatch Email
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);
    setResponseLog(null);

    if (!sendToAll && uniqueRecipientCount === 0) {
      setErrorNotice('Please paste at least one valid recipient email address.');
      return;
    }

    if (!serviceId || !templateId) {
      setErrorNotice('Please provide your EmailJS Service ID and Template ID.');
      return;
    }

    setIsSending(true);

    try {
      const payload: any = {
        subject,
        headline,
        message,
        ctaText,
        ctaUrl,
        serviceId,
        templateId,
      };

      if (publicKey.trim()) payload.publicKey = publicKey.trim();
      if (privateKey.trim()) payload.privateKey = privateKey.trim();

      if (sendToAll) {
        payload.sendToAll = true;
      } else {
        payload.to = parsedEmails;
      }

      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setErrorNotice(result.error || 'Failed to dispatch emails via EmailJS.');
        setResponseLog(result);
      } else {
        setResponseLog(result);
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'An unexpected error occurred during dispatch.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0b0f19)', color: '#f8fafc', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Navigation & Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-muted, #94a3b8)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Homepage
          </Link>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(236, 121, 107, 0.15)',
              border: '1px solid rgba(236, 121, 107, 0.35)',
              color: '#ec796b',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <Mail size={14} /> EmailJS Direct Dispatcher
          </span>
        </div>

        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>
            Direct Email <span style={{ color: '#ec796b' }}>Broadcast Center</span>
          </h1>
          <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
            Paste recipient addresses below to deliver the Starknet Layer-2 priority invitation directly to their inbox via EmailJS.
          </p>
        </div>

        {/* Configuration Notice */}
        <div
          style={{
            background: 'var(--bg-surface-elevated, #111827)',
            border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={18} style={{ color: '#ec796b' }} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                EmailJS API Credentials
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowKeys(!showKeys)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted, #94a3b8)',
                cursor: 'pointer',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              {showKeys ? <EyeOff size={14} /> : <Eye size={14} />} {showKeys ? 'Hide Keys' : 'Edit / View Keys'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Service ID
              </label>
              <input
                type="text"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                placeholder="service_xxxxxxx"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Template ID
              </label>
              <input
                type="text"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                placeholder="template_xxxxxxx"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Public Key (User ID)
              </label>
              <input
                type={showKeys ? 'text' : 'password'}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="EmailJS Public Key"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Private Key (Access Token)
              </label>
              <input
                type={showKeys ? 'text' : 'password'}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Optional if Private Key disabled"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Compose Card */}
        <form
          onSubmit={handleSend}
          style={{
            background: 'var(--bg-surface-elevated, #111827)',
            border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
            borderRadius: '1.25rem',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          }}
        >
          {/* Recipients Section */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Users size={16} style={{ color: '#ec796b' }} />
                <span>Recipient Email Addresses</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(236, 121, 107, 0.2)',
                    color: '#ec796b',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                    fontWeight: 700,
                  }}
                >
                  {sendToAll ? `All Users (${registeredUsersCount || 'loading'})` : `${uniqueRecipientCount} detected`}
                </span>
              </label>

              <button
                type="button"
                onClick={handleLoadRegisteredUsers}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <RefreshCw size={12} />
                <span>Paste All Registered Users ({registeredUsersCount ?? '...'})</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={recipientInput}
              onChange={(e) => {
                setRecipientInput(e.target.value);
                setSendToAll(false);
              }}
              placeholder="Paste email addresses here (separated by commas, spaces, or line breaks):&#10;investor1@apex.io, david@example.com&#10;sarah.miller@crypto.com"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: '#1e293b',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Email Subject & Headline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.45rem' }}>
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.65rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.45rem' }}>
                Card Title / Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.65rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Message Body */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.45rem' }}>
              Message Body (Paragraphs rendered inside Starknet branded template)
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: '#1e293b',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Button Text & Link */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.45rem' }}>
                Action Button Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.65rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.45rem' }}>
                Action Button URL
              </label>
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.65rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.85rem 1.15rem',
                borderRadius: '0.65rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Submit Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>
              Target: <strong style={{ color: '#ffffff' }}>{sendToAll ? 'All Registered Users' : `${uniqueRecipientCount} Email(s)`}</strong>
            </div>

            <button
              type="submit"
              disabled={isSending}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.9rem 2.2rem',
                borderRadius: '0.75rem',
                background: isSending ? '#475569' : 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: isSending ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(236, 121, 107, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              {isSending ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Dispatching via EmailJS...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Direct Message via EmailJS</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Results Log Card */}
        {responseLog && (
          <div
            style={{
              marginTop: '2rem',
              background: 'var(--bg-surface-elevated, #111827)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
              borderRadius: '1rem',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                  Dispatch Summary
                </h3>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Delivered: <strong style={{ color: '#22c55e' }}>{responseLog.sentCount}</strong> / {responseLog.total}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {responseLog.results?.map((res: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.5rem',
                    background: res.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid',
                    borderColor: res.success ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {res.success ? <CheckCircle2 size={15} style={{ color: '#22c55e' }} /> : <XCircle size={15} style={{ color: '#ef4444' }} />}
                    <span style={{ fontWeight: 600 }}>{res.email}</span>
                  </div>
                  <span style={{ color: res.success ? '#22c55e' : '#ef4444', fontSize: '0.78rem', fontWeight: 700 }}>
                    {res.success ? 'Delivered' : (res.error || 'Failed')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
