'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardNav, { DashboardTab } from '@/components/dashboard/DashboardNav';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import SecuritySettings from '@/components/dashboard/SecuritySettings';
import BuyCryptoModal from '@/components/dashboard/BuyCryptoModal';
import WithdrawModal from '@/components/dashboard/WithdrawModal';
import KycVerificationModal from '@/components/dashboard/KycVerificationModal';
import TransactionMonitorModal from '@/components/dashboard/TransactionMonitorModal';
import ContractSigningModal from '@/components/dashboard/ContractSigningModal';
import InvestmentPlanModal from '@/components/dashboard/InvestmentPlanModal';
import ActiveInvestmentTracker from '@/components/dashboard/ActiveInvestmentTracker';
import DepositPage from '../deposit/page';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredTransactions,
  saveStoredTransactions,
  calculatePortfolioSummary,
} from '@/lib/portfolio-store';
import {
  getStoredKycProfile,
  saveStoredKycProfile,
} from '@/lib/kyc-store';
import {
  getStoredNotifications,
  saveStoredNotifications,
  getStoredPriceAlerts,
  saveStoredPriceAlerts,
} from '@/lib/alert-store';
import { 
  hasContractSigned, 
  getContractReviewStatus, 
  finalizeContractCertification,
} from '@/lib/contract-store';
import {
  getStoredInvestments,
  saveStoredInvestments,
  claimStoredInvestment,
  INVESTMENT_PLANS,
} from '@/lib/investment-store';
import {
  Transaction,
  BtcMarketData,
  KycProfile,
  AppNotification,
  PriceAlert,
  ActiveInvestment,
} from '@/lib/types';
import { DEFAULT_MARKET_DATA, formatUsd } from '@/lib/btc-calc';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Lock, Wallet, Plus, ArrowUpRight } from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isAuthenticated,
    isAuthLoading,
    guestLogin,
    user,
    logout,
    setContractSignedStatus,
  } = useAuth();

  const [marketData, setMarketData] = useState<BtcMarketData>(DEFAULT_MARKET_DATA);
  const [satsMode, setSatsMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [kycProfile, setKycProfile] = useState<KycProfile>(getStoredKycProfile());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [investments, setInvestments] = useState<ActiveInvestment[]>([]);

  // Modal States
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [inspectedTx, setInspectedTx] = useState<Transaction | null>(null);

  const [contractSigned, setContractSigned] = useState<boolean>(false);
  const [contractReviewState, setContractReviewState] = useState<{
    status: 'none' | 'under_review' | 'certified';
    remainingSeconds: number;
    record: any;
  }>({ status: 'none', remainingSeconds: 0, record: null });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNotifications(getStoredNotifications());
    setPriceAlerts(getStoredPriceAlerts());
  }, []);

  // Auto-login guest for instant assessment if unauthenticated
  useEffect(() => {
    if (mounted && !isAuthLoading && !isAuthenticated) {
      guestLogin();
    }
  }, [mounted, isAuthLoading, isAuthenticated, guestLogin]);

  // Reload user-specific isolated data whenever authenticated user changes
  useEffect(() => {
    if (!user?.email) return;

    // Auto-certify contract for smooth user access
    finalizeContractCertification(user.email);
    setContractSigned(true);
    setContractSignedStatus(true);

    setTransactions(getStoredTransactions(user.email));
    setKycProfile(getStoredKycProfile(user.email));

    const storedInvs = getStoredInvestments(user.email);
    if (storedInvs.length === 0) {
      const demoInvestment: ActiveInvestment = {
        id: `inv_demo_${Date.now()}`,
        userEmail: user.email,
        planId: 'gold-institutional',
        planName: 'Gold Institutional Alpha',
        tier: 'Gold',
        amountInvestedUsd: 500,
        durationDays: 14,
        expectedRoiPercent: 5.6,
        targetPayoutUsd: 528,
        startDate: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
        maturityDate: new Date(Date.now() + 11 * 86400 * 1000).toISOString(),
        status: 'active',
        autoReinvest: false,
      };
      saveStoredInvestments([demoInvestment], user.email);
      setInvestments([demoInvestment]);
    } else {
      setInvestments(storedInvs);
    }
  }, [user?.email, setContractSignedStatus]);

  useEffect(() => {
    fetch('/api/btc-price')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.priceUsd) setMarketData(data);
      })
      .catch(() => {});
  }, []);

  const handleAddTransaction = (newTx: Transaction) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveStoredTransactions(updated, user?.email);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveStoredTransactions(updated, user?.email);
  };

  const handleInvestmentCreated = (newInv: ActiveInvestment) => {
    const updated = [newInv, ...investments];
    setInvestments(updated);
    saveStoredInvestments(updated, user?.email);
    if (user?.email) {
      setTransactions(getStoredTransactions(user.email));
    }
  };

  const handleClaimInvestment = async (invId: string) => {
    try {
      await fetch('/api/investment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email,
          investmentId: invId,
          action: 'claim',
        }),
      });
    } catch (err) {
      console.error('[Dashboard] Error claiming investment:', err);
    }
    const updated = claimStoredInvestment(invId, user?.email);
    setInvestments(updated);
    if (user?.email) {
      setTransactions(getStoredTransactions(user.email));
    }
  };

  if (!mounted || isAuthLoading) {
    return (
      <div suppressHydrationWarning style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading Starknet Portal...</span>
      </div>
    );
  }

  const summary = calculatePortfolioSummary(transactions, marketData.priceUsd);

  return (
    <div suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <DashboardNav
        marketData={marketData}
        satsMode={satsMode}
        onToggleSatsMode={() => setSatsMode((prev) => !prev)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenKycModal={() => setIsKycModalOpen(true)}
        notifications={notifications}
        onMarkAllRead={() => {
          const updated = notifications.map((n) => ({ ...n, read: true }));
          setNotifications(updated);
        }}
        onOpenPriceAlerts={() => {}}
      />

      <main className="container dashboard-main" style={{ flex: 1, padding: '2rem 1.5rem 4rem' }}>
        {/* TAB 1: VAULT OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Live Accruing Growth Engine & Countdown */}
            <ActiveInvestmentTracker
              investments={investments}
              onOpenPlanModal={() => setIsPlanModalOpen(true)}
              onClaimInvestment={handleClaimInvestment}
              userEmail={user?.email}
            />

            <PortfolioOverview
              summary={summary}
              transactions={transactions}
              goals={[]}
              investments={investments}
              marketData={marketData}
              satsMode={satsMode}
              onOpenBuyModal={() => setIsBuyModalOpen(true)}
              onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
              onOpenKycModal={() => setIsKycModalOpen(true)}
              onOpenGoalModal={() => {}}
              onOpenPlanModal={() => setIsPlanModalOpen(true)}
              onClaimInvestment={handleClaimInvestment}
              onViewAllTransactions={() => setActiveTab('transactions')}
              onViewAllGoals={() => {}}
              onInspectTx={(tx) => setInspectedTx(tx)}
              kycStatus={kycProfile.status}
              contractSigned={true}
              userEmail={user?.email}
            />

            <TransactionHistory
              transactions={transactions}
              satsMode={satsMode}
              onOpenBuyModal={() => setIsBuyModalOpen(true)}
              onDeleteTransaction={handleDeleteTransaction}
              onInspectTx={(tx) => setInspectedTx(tx)}
            />
          </div>
        )}

        {/* TAB 2: INVESTMENT PLANS */}
        {activeTab === 'plans' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  background: 'rgba(236, 121, 107, 0.12)',
                  color: '#ec796b',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={16} />
                <span>INSTITUTIONAL ZK-VAULT PLANS</span>
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                Select Your Capital Growth Plan
              </h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                Lock in your allocation to accrue live yields second-by-second with guaranteed maturity payouts.
              </p>

              <button
                onClick={() => setIsPlanModalOpen(true)}
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  boxShadow: '0 0 25px rgba(236, 121, 107, 0.4)',
                }}
              >
                <Sparkles size={18} />
                <span>Open Plan Configurator</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Plan Cards Display Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {INVESTMENT_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="glass-card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: `1.5px solid ${plan.color}44`,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: plan.color }}>
                        {plan.tier} Tier
                      </span>
                      {plan.recommended && (
                        <span className="pill" style={{ background: '#ec796b', color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      {plan.name}
                    </h3>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#22c55e', marginBottom: '0.25rem' }}>
                      +{plan.expectedRoiPercent}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      {plan.durationDays}-Day Fixed Term (~{plan.dailyYieldPercent}% / day)
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {plan.features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={14} color="#22c55e" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPlanModalOpen(true)}
                    className="btn btn-primary"
                    style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', background: plan.color, borderColor: plan.color }}
                  >
                    <span>Invest ${plan.minAmountUsd}+</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: METAMASK PAYMENT DETAILS */}
        {activeTab === 'payment' && (
          <div>
            <DepositPage />
          </div>
        )}

        {/* TAB 4: TRANSACTION LEDGER */}
        {activeTab === 'transactions' && (
          <TransactionHistory
            transactions={transactions}
            satsMode={satsMode}
            onOpenBuyModal={() => setIsBuyModalOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onInspectTx={(tx) => setInspectedTx(tx)}
          />
        )}

        {/* TAB 5: SECURITY & CUSTODY */}
        {activeTab === 'security' && (
          <SecuritySettings transactions={transactions} />
        )}
      </main>

      {/* MODALS */}
      {isBuyModalOpen && (
        <BuyCryptoModal
          currentBtcPrice={marketData.priceUsd}
          satsMode={satsMode}
          onClose={() => setIsBuyModalOpen(false)}
          onSuccess={handleAddTransaction}
          contractSigned={true}
          onOpenContractModal={() => {}}
        />
      )}

      {isWithdrawModalOpen && (
        <WithdrawModal
          totalBtc={summary.totalBtc}
          currentBtcPrice={marketData.priceUsd}
          satsMode={satsMode}
          onClose={() => setIsWithdrawModalOpen(false)}
          onConfirmWithdrawal={handleAddTransaction}
          kycStatus={kycProfile.status}
          onOpenKycModal={() => setIsKycModalOpen(true)}
        />
      )}

      {isKycModalOpen && (
        <KycVerificationModal
          kycProfile={kycProfile}
          onClose={() => setIsKycModalOpen(false)}
          onVerified={(profile) => {
            setKycProfile(profile);
            saveStoredKycProfile(profile, user?.email);
          }}
        />
      )}

      {isPlanModalOpen && (
        <InvestmentPlanModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          userEmail={user?.email}
          onInvestmentCreated={handleInvestmentCreated}
        />
      )}

      {inspectedTx && (
        <TransactionMonitorModal
          transaction={inspectedTx}
          satsMode={satsMode}
          onClose={() => setInspectedTx(null)}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}><span style={{ color: 'var(--text-muted)' }}>Loading Dashboard...</span></div>}>
      <DashboardContent />
    </Suspense>
  );
}
