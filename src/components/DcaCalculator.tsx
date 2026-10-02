'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Percent,
  Calendar,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { formatUsd, formatBtc, DEFAULT_MARKET_DATA } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';

interface DcaCalculatorProps {
  marketData: BtcMarketData;
  satsMode: boolean;
  onToggleSatsMode: () => void;
}

export default function DcaCalculator({ marketData }: DcaCalculatorProps) {
  // Input States: Single Investment Amount, 30% to 50% monthly interest, duration in months
  const [amount, setAmount] = useState<number>(100);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState<number>(30); // 30% to 50% monthly
  const [durationMonths, setDurationMonths] = useState<number>(1); // 1, 3, 6, 12 months

  // Calculation Logic: 30% to 50% EVERY MONTH directly on your invested capital
  const calculation = useMemo(() => {
    const validAmount = Math.max(50, Number(amount) || 0);
    const validMonthlyRate = Math.min(50, Math.max(30, Number(monthlyInterestRate) || 30));
    const monthlyRateFraction = validMonthlyRate / 100; // e.g. 0.30, 0.40, 0.50

    const months = Math.max(1, Number(durationMonths) || 1);

    const totalInvested = validAmount;
    // Earns the guaranteed monthly interest for each month held
    const interestEarned = totalInvested * monthlyRateFraction * months;

    const totalPayout = totalInvested + interestEarned;
    const returnPercentage = totalInvested > 0 ? (interestEarned / totalInvested) * 100 : 0;
    const monthlyReturn = totalInvested * monthlyRateFraction; // Exact monthly return on capital
    const dailyReturn = monthlyReturn / 30;

    const btcPrice = marketData?.priceUsd > 0 ? marketData.priceUsd : DEFAULT_MARKET_DATA.priceUsd;
    const btcEquivalent = totalPayout / btcPrice;

    return {
      totalInvested,
      interestEarned,
      totalPayout,
      returnPercentage,
      monthlyReturn,
      dailyReturn,
      btcEquivalent,
      monthlyRatePercent: validMonthlyRate,
      months,
    };
  }, [amount, monthlyInterestRate, durationMonths, marketData?.priceUsd]);

  return (
    <section id="calculator" className="section-wrapper" style={{ background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1060px', margin: '0 auto' }}>
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <div
            className="section-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(236, 121, 107, 0.12)',
              border: '1px solid rgba(236, 121, 107, 0.35)',
              color: '#ec796b',
              padding: '0.35rem 0.95rem',
              borderRadius: '9999px',
              fontSize: '0.825rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <Zap size={14} />
            <span>30% – 50% Monthly Vault Interest</span>
          </div>

          <h2
            className="section-title"
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: '0.65rem',
            }}
          >
            Calculate Your <span style={{ color: '#ec796b' }}>Projected Returns</span>
          </h2>

          <p
            className="section-subtitle"
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Earn guaranteed <strong style={{ color: 'var(--text-main)' }}>30% to 50% monthly interest</strong> on your capital. Calculate your exact monthly payout starting from $50.
          </p>
        </div>

        {/* 2-Column Calculator Grid */}
        <div
          className="glass-card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            padding: 'clamp(1.75rem, 4vw, 2.75rem)',
            borderRadius: '1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* LEFT: 3 Simple Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* STEP 1: Investment Capital */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  1. Your Investment Capital
                </label>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#ec796b',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                  }}
                >
                  ${amount.toLocaleString()}
                </span>
              </div>

              <input
                type="number"
                min="50"
                max="5000"
                step="50"
                value={amount}
                onChange={(e) => setAmount(Math.max(50, Number(e.target.value)))}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-main)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '0.65rem',
                  fontVariantNumeric: 'tabular-nums',
                }}
              />

              {/* Quick Select Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[50, 100, 250, 500, 1000, 2500, 5000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: amount === val ? '#ec796b' : 'var(--bg-surface-elevated)',
                      color: amount === val ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: amount === val ? '#ec796b' : 'var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    ${val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Choose Interest Rate Tier (30% to 50% Monthly) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Percent size={15} style={{ color: '#ec796b' }} />
                  <span>2. Guaranteed Monthly Interest</span>
                </label>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#ec796b',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                  }}
                >
                  {monthlyInterestRate}% / Month
                </span>
              </div>

              {/* 3 Prominent Monthly Interest Tier Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {[
                  { rate: 30, name: 'Starter', desc: '30% / Month' },
                  { rate: 40, name: 'Growth', desc: '40% / Month' },
                  { rate: 50, name: 'VIP Vault', desc: '50% / Month' },
                ].map((tier) => {
                  const isSelected = monthlyInterestRate === tier.rate;
                  return (
                    <button
                      key={tier.rate}
                      onClick={() => setMonthlyInterestRate(tier.rate)}
                      style={{
                        padding: '0.85rem 0.5rem',
                        borderRadius: '0.75rem',
                        background: isSelected ? 'rgba(236, 121, 107, 0.15)' : 'var(--bg-surface-elevated)',
                        border: isSelected ? '2px solid #ec796b' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 900,
                          color: isSelected ? '#ec796b' : 'var(--text-main)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {tier.rate}%
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {tier.name}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: isSelected ? '#ec796b' : 'var(--text-faint)' }}>
                        {tier.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Fine-tuning Slider (30% to 50%) */}
              <input
                type="range"
                min="30"
                max="50"
                step="1"
                value={monthlyInterestRate}
                onChange={(e) => setMonthlyInterestRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ec796b' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>30% / Month</span>
                <span>40% / Month</span>
                <span>50% / Month</span>
              </div>
            </div>

            {/* STEP 3: Duration / Lock Horizon (1 Month, 3 Months, 6 Months, 12 Months) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} style={{ color: '#ec796b' }} />
                  <span>3. Investment Horizon</span>
                </label>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {durationMonths} {durationMonths === 1 ? 'Month' : 'Months'} ({monthlyInterestRate * durationMonths}% Total Return)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {[
                  { months: 1, label: '1 Month', note: `${monthlyInterestRate}% return` },
                  { months: 3, label: '3 Months', note: `${monthlyInterestRate * 3}% return` },
                  { months: 6, label: '6 Months', note: `${monthlyInterestRate * 6}% return` },
                  { months: 12, label: '1 Year', note: `${monthlyInterestRate * 12}% return` },
                ].map((item) => {
                  const isSelected = durationMonths === item.months;
                  return (
                    <button
                      key={item.months}
                      onClick={() => setDurationMonths(item.months)}
                      style={{
                        padding: '0.65rem 0.4rem',
                        borderRadius: '0.65rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: isSelected ? '#ec796b' : 'var(--bg-surface-elevated)',
                        color: isSelected ? '#ffffff' : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: isSelected ? '#ec796b' : 'var(--border-subtle)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.15rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{item.label}</span>
                      <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>{item.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: The Crystal Clear Results Card */}
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              borderRadius: '1.25rem',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.75rem',
            }}
          >
            <div>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Projected Payout Summary
                </span>
                <span
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#22c55e',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  +{monthlyInterestRate}% / Month Guaranteed
                </span>
              </div>

              {/* Big Hero Number: Total Payout */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Total Projected Value (Principal + Interest)
                </div>
                <div
                  style={{
                    fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
                    fontWeight: 900,
                    color: 'var(--text-main)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatUsd(calculation.totalPayout, 2)}
                </div>

                {/* Net Profit Callout */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#22c55e',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    <TrendingUp size={16} />
                    <span>+{formatUsd(calculation.interestEarned, 2)}</span>
                    <span>(+{calculation.returnPercentage.toFixed(1)}% Pure Profit)</span>
                  </span>
                </div>
              </div>

              {/* 3-Point Line Breakdown */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Initial Capital Invested</span>
                  <strong style={{ color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
                    {formatUsd(calculation.totalInvested, 0)}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Monthly Interest Rate</span>
                  <strong style={{ color: '#ec796b', fontVariantNumeric: 'tabular-nums' }}>
                    {monthlyInterestRate}% Every Month
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pure Profit Earned</span>
                  <strong style={{ color: '#22c55e', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
                    +{formatUsd(calculation.interestEarned, 2)}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Bitcoin Stacking Power</span>
                  <strong style={{ color: 'var(--brand-btc, #ec796b)', fontVariantNumeric: 'tabular-nums' }}>
                    &asymp; {formatBtc(calculation.btcEquivalent, 6)} BTC
                  </strong>
                </div>

                {/* Earnings Pacing Pills: Exact Monthly and Daily Profit */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.65rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    marginTop: '0.35rem',
                    fontSize: '0.82rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Monthly Profit Payout</span>
                    <strong style={{ color: '#22c55e', fontVariantNumeric: 'tabular-nums', fontSize: '0.95rem' }}>
                      +{formatUsd(calculation.monthlyReturn, 2)} / month
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Daily Profit Payout</span>
                    <strong style={{ color: '#22c55e', fontVariantNumeric: 'tabular-nums', fontSize: '0.95rem' }}>
                      +{formatUsd(calculation.dailyReturn, 2)} / day
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Link to Register & Lock In */}
            <div>
              <Link
                href="/register"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 24px rgba(236, 121, 107, 0.45)',
                  boxSizing: 'border-box',
                  textDecoration: 'none',
                  transition: 'transform 0.15s ease',
                }}
              >
                <Sparkles size={18} />
                <span>Lock In {monthlyInterestRate}% Monthly Interest</span>
                <ArrowRight size={18} />
              </Link>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.85rem',
                }}
              >
                <ShieldCheck size={14} style={{ color: '#22c55e' }} />
                <span>Audited Starknet ZK-Vaults &bull; Non-Commingled Custody</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
