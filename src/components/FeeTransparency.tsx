'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Shield,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { formatUsd, formatBtc, formatSats, btcToSats } from '@/lib/btc-calc';
import { BtcMarketData } from '@/lib/types';

interface FeeTransparencyProps {
  marketData: BtcMarketData;
  satsMode: boolean;
}

export default function FeeTransparency({ marketData, satsMode }: FeeTransparencyProps) {
  // Default to $100 as requested
  const [purchaseAmount, setPurchaseAmount] = useState<number>(100);

  // Platform fee percentage (0.49%)
  const platformFeeRate = 0.0049;
  const platformFeeUsd = purchaseAmount * platformFeeRate;

  // Typical standard SegWit/Taproot transaction is ~140 vBytes
  const txVBytes = 140;
  const mempoolFeeSatPerVb = marketData?.mempoolFeeSatPerVb || 14;
  const minerFeeSats = txVBytes * mempoolFeeSatPerVb;
  const btcPrice = marketData?.priceUsd > 0 ? marketData.priceUsd : 83542;
  const minerFeeUsd = marketData?.priceUsd > 0
    ? (minerFeeSats / 100_000_000) * marketData.priceUsd
    : 1.64;

  const totalChargedUsd = purchaseAmount + platformFeeUsd + minerFeeUsd;
  const netBtcReceived = purchaseAmount / btcPrice;
  const netSatsReceived = btcToSats(netBtcReceived);

  // Starknet L2 gas cost (< $0.03) vs Bitcoin L1 ($1.64)
  const starknetFeeDisplay = '< $0.03';

  const quickPresets = [50, 100, 250, 500, 1000, 2500, 5000];

  return (
    <section id="fees" className="section-wrapper" style={{ background: 'var(--bg-surface)' }}>
      <div className="container" style={{ maxWidth: '1120px', margin: '0 auto' }}>
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
            <DollarSign size={14} />
            <span>Radical Transparency</span>
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
            No Hidden Spreads. <span style={{ color: '#ec796b' }}>Ever.</span>
          </h2>

          <p
            className="section-subtitle"
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Most exchanges advertise &ldquo;zero fee&rdquo; while secretly marking up the Bitcoin price by 2% to 4%. We show you every single cent before you execute.
          </p>
        </div>

        {/* Side-by-Side Comparison & Interactive Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* LEFT: Live Purchase Fee Estimator Card */}
          <div
            className="glass-card"
            style={{
              padding: 'clamp(1.75rem, 3.5vw, 2.25rem)',
              borderRadius: '1.5rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
              background: 'var(--bg-surface-elevated)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Live Purchase Fee Estimator
              </h3>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#22c55e',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                }}
              >
                Zero Hidden Spread
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              Test how transparent fees scale with purchase sizes.
            </p>

            {/* Input Slider & Quick Presets */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Purchase Amount
                </label>
                <span
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    color: '#ec796b',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                  }}
                >
                  ${purchaseAmount.toLocaleString()}
                </span>
              </div>

              <input
                id="purchase-amount-input"
                type="range"
                min="50"
                max="5000"
                step="25"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ec796b', marginBottom: '0.85rem' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem' }}>
                {quickPresets.map((val) => (
                  <button
                    key={val}
                    onClick={() => setPurchaseAmount(val)}
                    style={{
                      padding: '0.45rem 0.2rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: purchaseAmount === val ? '#ec796b' : 'var(--bg-surface)',
                      color: purchaseAmount === val ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: purchaseAmount === val ? '#ec796b' : 'var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontVariantNumeric: 'tabular-nums',
                      textAlign: 'center',
                    }}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Itemized Receipt Box */}
            <div
              style={{
                background: 'var(--bg-surface)',
                borderRadius: '1rem',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.95rem',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Being Purchased</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                  {formatUsd(purchaseAmount, 2)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Platform Fee (0.49%)</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      background: 'rgba(236, 121, 107, 0.15)',
                      color: '#ec796b',
                    }}
                  >
                    Direct
                  </span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                  {formatUsd(platformFeeUsd, 2)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Network Miner Fee</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#22c55e',
                    }}
                  >
                    {mempoolFeeSatPerVb} sat/vB
                  </span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                  {formatUsd(minerFeeUsd, 2)}
                </span>
              </div>

              {/* Total Charged Row */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Total Charged
                </span>
                <span
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: 'var(--text-main)',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatUsd(totalChargedUsd, 2)}
                </span>
              </div>

              {/* Bitcoin Received Pill */}
              <div
                style={{
                  background: 'rgba(236, 121, 107, 0.1)',
                  border: '1px solid rgba(236, 121, 107, 0.25)',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ec796b' }}>
                  Estimated Bitcoin Received:
                </span>
                <span
                  style={{
                    fontWeight: 900,
                    color: '#ec796b',
                    fontSize: '1rem',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {satsMode ? `${formatSats(netSatsReceived)} sats` : `${formatBtc(netBtcReceived, 6)} BTC`}
                </span>
              </div>
            </div>

            {/* Rate Guarantee Footer Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Shield size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem' }}>
                Guaranteed rate lock for 60 seconds during checkout review.
              </span>
            </div>
          </div>

          {/* RIGHT: Feature Cards (Starknet L2 Advantage & Anti-Markup) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* CARD 1: Starknet L2 ZK-Rollup Advantage */}
            <div
              className="glass-card"
              style={{
                padding: '1.75rem',
                borderRadius: '1.25rem',
                border: '1px solid rgba(236, 121, 107, 0.35)',
                background: 'var(--bg-surface-elevated)',
                boxShadow: '0 12px 32px rgba(236, 121, 107, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <Zap size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Starknet L2 ZK-Rollup Advantage
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 700 }}>
                    Over 95% gas reduction via STARK compression
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                By executing vault rebalancing and yield harvesting on Starknet Layer-2, we compress thousands of transactions into cryptographic STARK proofs—saving you over 95% on gas.
              </p>

              {/* Side by side Gas Comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Bitcoin L1 Gas
                  </div>
                  <div
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 900,
                      color: 'var(--brand-warning, #f59e0b)',
                      margin: '0.2rem 0',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    ${minerFeeUsd.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>10-60 min blocks</div>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(236, 121, 107, 0.1)',
                    border: '1px solid rgba(236, 121, 107, 0.4)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#ec796b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Starknet L2 Batch
                  </div>
                  <div
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 900,
                      color: '#ec796b',
                      margin: '0.2rem 0',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {starknetFeeDisplay}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 700 }}>
                    Sub-second • 99% cheaper
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Why "Zero Commission" Is Often a Lie */}
            <div
              className="glass-card"
              style={{
                padding: '1.75rem',
                borderRadius: '1.25rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
              }}
            >
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--text-main)' }}>
                Why &ldquo;Zero Commission&rdquo; Is Often a Lie
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1rem' }}>
                Platforms that advertise &ldquo;0% trading fees&rdquo; often inflate the price you pay. If BTC is trading at $90,000, they might charge you $92,500 without warning.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  'Real spot market price execution',
                  'Transparent 0.49% platform fee',
                  'Zero deposit surcharge (USDT, BTC, ETH, STRK, Cards, Wire)',
                  'VIP Wishlist members lock in 0% management fee on launch',
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem' }}>
                    <CheckCircle size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-main)', lineHeight: 1.45 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
