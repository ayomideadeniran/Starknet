'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Send,
  MessageSquare,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function SupportPage() {
  const [copied, setCopied] = useState(false);
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@starknet-portal.io';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const categories = [
    {
      title: 'Deposit & Capital Allocation',
      desc: 'Inquiries regarding USDT/USDC deposits, Bitcoin transfers, Starknet L2 gas, and wire settlements.',
      subject: 'Starknet Deposit & Capital Allocation Inquiry',
      body: 'Hello Support Team,\n\nI need assistance with a deposit or capital allocation.\n\nAccount Email:\nDetails:\n',
    },
    {
      title: 'Grand Opening VIP Allocation',
      desc: 'Assistance with your queue position, ticket confirmation, and launch-day tier activations.',
      subject: 'Starknet VIP Allocation & Ticket Inquiry',
      body: 'Hello Support Team,\n\nI have an inquiry regarding my VIP launch queue ticket.\n\nTicket ID / Email:\nDetails:\n',
    },
    {
      title: 'Account Security & Verification',
      desc: 'Assistance with identity verification, two-factor authentication, or security settings.',
      subject: 'Starknet Security & Verification Help',
      body: 'Hello Support Team,\n\nI need assistance with my account security, verification, or credentials.\n\nAccount Email:\nDetails:\n',
    },
    {
      title: 'Institutional Custody & OTC',
      desc: 'Dedicated private wealth desk, multi-sig custody, and custom vault integration inquiries.',
      subject: 'Starknet Institutional Custody Inquiry',
      body: 'Hello Support Team,\n\nI am requesting information regarding institutional vaults and multi-sig custody.\n\nEntity / Legal Name:\nEstimated Allocation:\n',
    },
  ];

  const defaultMailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
    'Starknet Protocol Customer Support Inquiry'
  )}&body=${encodeURIComponent(
    'Hello Starknet Support Desk,\n\nI am reaching out regarding:\n\nAccount Email:\nInquiry Details:\n'
  )}`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          backgroundColor: 'var(--bg-glass)',
          borderBottom: '1px solid var(--border-subtle)',
          width: '100%',
        }}
      >
        <div
          className="container"
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
            }}
          >
            <img
              src="/icon.png"
              alt="Starknet Logo"
              width={34}
              height={34}
              style={{
                borderRadius: '50%',
                objectFit: 'contain',
                boxShadow: '0 4px 12px rgba(236, 121, 107, 0.35)',
              }}
            />
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
              Stark<span style={{ color: '#ec796b' }}>net</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            <Link href="/" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', gap: '0.4rem' }}>
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Support Desk Content */}
      <main style={{ flex: 1, padding: '3.5rem 1.5rem 5rem' }}>
        <div className="container" style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Header Badge & Title */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(236, 121, 107, 0.12)',
                border: '1px solid rgba(236, 121, 107, 0.35)',
                color: '#ec796b',
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              <Mail size={15} />
              <span>Direct Customer Support Desk</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 900,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
              }}
            >
              How Can We <span style={{ color: '#ec796b' }}>Assist You</span>?
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
              Our dedicated support desk is available to assist you. Click below to launch your email client directly or copy our official address.
            </p>
          </div>

          {/* Primary Email Support Card */}
          <div
            className="glass-card"
            style={{
              padding: 'clamp(1.75rem, 4vw, 2.5rem)',
              borderRadius: '1.5rem',
              marginBottom: '2.5rem',
              border: '1px solid rgba(236, 121, 107, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* Top Address Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '1rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Official Customer Support Email
                  </div>
                  <div className="mono" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 800, color: 'var(--text-main)' }}>
                    {supportEmail}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    onClick={handleCopyEmail}
                    className="btn btn-secondary"
                    style={{ padding: '0.65rem 1.1rem', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy Email'}</span>
                  </button>

                  <a
                    href={defaultMailto}
                    className="btn btn-primary"
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}
                  >
                    <Send size={16} />
                    <span>Send Email (Mailto)</span>
                  </a>
                </div>
              </div>

              {/* Trust Indicators */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                  <Clock size={18} style={{ color: '#ec796b', flexShrink: 0 }} />
                  <span><strong>Fast Response:</strong> Average reply under 15 minutes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                  <span><strong>1-on-1 Human Support:</strong> No automated bot loops</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                  <Sparkles size={18} style={{ color: '#ec796b', flexShrink: 0 }} />
                  <span><strong>VIP Priority:</strong> Expedited queue for registered members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categorized Pre-Filled Email Options */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Select a Topic to Pre-Fill Your Email
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {categories.map((cat, idx) => (
                <a
                  key={idx}
                  href={`mailto:${supportEmail}?subject=${encodeURIComponent(cat.subject)}&body=${encodeURIComponent(cat.body)}`}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ec796b';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      {cat.title}
                    </h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {cat.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ec796b', fontSize: '0.82rem', fontWeight: 700 }}>
                    <span>Email Support Desk</span>
                    <ExternalLink size={13} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Security Disclaimer Box */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '0.85rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <ShieldCheck size={20} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--text-main)' }}>Anti-Phishing &amp; Security Notice:</strong> Official Starknet support will ONLY communicate with you from verified addresses ending in <code>@starknet-portal.io</code>. Our team will NEVER ask for your private keys, seed phrase, or passwords.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}