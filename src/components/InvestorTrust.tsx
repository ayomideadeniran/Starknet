'use client';

import React from 'react';
import { Users, TrendingUp, ShieldCheck, Award } from 'lucide-react';

interface Investor {
  id: string;
  name: string;
  tier: string;
  amount: string;
  currency: string;
  avatarGradient: string;
  avatarUrl?: string;
}

const INVESTORS: Investor[] = [
  {
    id: '1',
    name: 'Maurice Boendermaker',
    tier: 'Platinum Investor',
    amount: '840,250',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=15',
  },
  {
    id: '2',
    name: 'Gopi Kannappan',
    tier: 'Platinum Investor',
    amount: '612,400',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=53',
  },
  {
    id: '3',
    name: 'Milan Shoukri',
    tier: 'Gold Investor',
    amount: '480,950',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=60',
  },
  {
    id: '4',
    name: 'Ranit Mondal',
    tier: 'Gold Investor',
    amount: '345,100',
    currency: 'USDC',
    avatarGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=11',
  },
  {
    id: '5',
    name: 'Lawrence Oyebanji',
    tier: 'Gold Investor',
    amount: '298,500',
    currency: 'USDC',
    avatarGradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=68',
  },
  {
    id: '6',
    name: 'Khair Bush',
    tier: 'Silver Investor',
    amount: '142,800',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=33',
  },
  {
    id: '7',
    name: 'Sarah Jenkins',
    tier: 'Silver Investor',
    amount: '95,400',
    currency: 'USDC',
    avatarGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=47',
  },
  {
    id: '8',
    name: 'Michael Chen',
    tier: 'Silver Investor',
    amount: '88,200',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=12',
  },
  {
    id: '9',
    name: 'Elena Rodriguez',
    tier: 'Silver Investor',
    amount: '76,500',
    currency: 'USDC',
    avatarGradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=44',
  },
  {
    id: '10',
    name: 'David Smith',
    tier: 'Silver Investor',
    amount: '64,100',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=59',
  },
  {
    id: '11',
    name: 'Anika Patel',
    tier: 'Gold Investor',
    amount: '210,750',
    currency: 'USDT',
    avatarGradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=23',
  },
  {
    id: '12',
    name: 'James Carter',
    tier: 'Platinum Investor',
    amount: '520,600',
    currency: 'USDC',
    avatarGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    avatarUrl: 'https://i.pravatar.cc/100?img=3',
  },
];

const TOTAL_VOLUME = '2.7M+';
const INVESTOR_COUNT = '12,400+';

export default function InvestorTrust() {
  return (
    <section id="investor-trust" className="section-wrapper" style={{ background: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '320px',
          height: '320px',
          background: 'var(--brand-btc-glow)',
          filter: 'blur(120px)',
          opacity: 0.2,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="section-badge">
            <Users size={14} style={{ color: 'var(--brand-btc)' }} />
            <span>Investor Community</span>
          </div>
          <h2 className="section-title">Growing Investor Community</h2>
          <p className="section-subtitle" style={{ maxWidth: '640px' }}>
            A growing community of individuals and institutions participating in the Starknet Bitcoin ecosystem.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {INVESTORS.map((investor) => (
            <div
              key={investor.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: investor.avatarGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {investor.avatarUrl ? (
                  <img src={investor.avatarUrl} alt={investor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Users size={20} color="#fff" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {investor.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {investor.tier}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(34, 197, 94, 0.08)', color: 'var(--brand-success)', padding: '0.35rem 0.75rem', borderRadius: '999px' }}>
                  <TrendingUp size={14} />
                  <span className="mono" style={{ fontWeight: 700 }}>
                    ${investor.amount} {investor.currency}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} style={{ color: 'var(--brand-btc)' }} />
            </div>
            <div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {INVESTOR_COUNT}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Investors</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} style={{ color: 'var(--brand-success)' }} />
            </div>
            <div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {TOTAL_VOLUME}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Platform Volume</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} style={{ color: '#a855f7' }} />
            </div>
            <div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On-Chain Verified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
