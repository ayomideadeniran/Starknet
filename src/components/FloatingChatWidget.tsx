'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronUp,
  X,
  Send,
} from 'lucide-react';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@starknet-portal.io';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const supportTopics = [
    {
      label: '💰 Deposit & Capital Allocation',
      subject: 'Starknet Deposit & Capital Allocation Inquiry',
      body: 'Hello Support Team,\n\nI need assistance with a deposit or capital allocation.\n\nAccount Email:\nDetails:\n',
    },
    {
      label: '⚡ VIP Allocation & Whitelist',
      subject: 'Starknet VIP Allocation & Ticket Inquiry',
      body: 'Hello Support Team,\n\nI have an inquiry regarding my VIP launch queue ticket.\n\nTicket ID / Email:\nDetails:\n',
    },
    {
      label: '🔐 Security & Verification',
      subject: 'Starknet Security & Verification Help',
      body: 'Hello Support Team,\n\nI need assistance with my account security, verification, or credentials.\n\nAccount Email:\nDetails:\n',
    },
    {
      label: '📑 Institutional Vaults & Custody',
      subject: 'Starknet Institutional Custody Inquiry',
      body: 'Hello Support Team,\n\nI am requesting information regarding institutional vaults and multi-sig custody.\n\nEntity / Legal Name:\nEstimated Allocation:\n',
    },
  ];

  const defaultMailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
    'Starknet Protocol Customer Support Inquiry'
  )}&body=${encodeURIComponent(
    'Hello Starknet Support Desk,\n\nI am reaching out regarding:\n\nAccount Email:\nInquiry Details:\n'
  )}`;

  if (!mounted) return null;

  return (
    <aside
      aria-label="Customer Support Desk"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.75rem',
      }}
    >
      {/* Quick Email Launcher Card (Toggled via button or pill) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="support-card-title"
          style={{
            width: 'calc(100vw - 48px)',
            maxWidth: '380px',
            background: 'rgba(13, 19, 31, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(236, 121, 107, 0.35)',
            borderRadius: '1.25rem',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(236, 121, 107, 0.15)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0.65rem',
                  background: 'linear-gradient(135deg, #ec796b 0%, #d85d4f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(236, 121, 107, 0.4)',
                }}
              >
                <Mail size={20} />
              </div>
              <div>
                <h4
                  id="support-card-title"
                  style={{
                    margin: 0,
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--text-main, #ffffff)',
                  }}
                >
                  Customer Support Desk
                </h4>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.72rem',
                    color: '#22c55e',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 6px #22c55e',
                      display: 'inline-block',
                    }}
                  />
                  <span>Direct Mailto &bull; Replies &lt; 15 mins</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Support Desk"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: 'var(--text-muted, #94a3b8)',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Email Address & Quick Copy Box */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '0.85rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted, #94a3b8)', fontWeight: 700 }}>
                Official Desk Email
              </div>
              <div
                className="mono"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--text-main, #ffffff)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {supportEmail}
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              title="Copy email address"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '0.5rem',
                background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(236, 121, 107, 0.15)',
                border: copied ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(236, 121, 107, 0.3)',
                color: copied ? '#22c55e' : '#ec796b',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Primary Action: Direct Mailto Button */}
          <a
            href={defaultMailto}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.85rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #ec796b 0%, #d85d4f 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(236, 121, 107, 0.35)',
              boxSizing: 'border-box',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Send size={16} />
            <span>Open Email App (Mailto)</span>
            <ExternalLink size={14} />
          </a>

          {/* Pre-formatted Topic Mailto Links */}
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted, #94a3b8)',
                letterSpacing: '0.04em',
                marginBottom: '0.45rem',
              }}
            >
              Or Choose a Topic to Pre-Fill:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {supportTopics.map((topic, idx) => (
                <a
                  key={idx}
                  href={`mailto:${supportEmail}?subject=${encodeURIComponent(topic.subject)}&body=${encodeURIComponent(topic.body)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0.55rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-main, #ffffff)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(236, 121, 107, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(236, 121, 107, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                >
                  <span>{topic.label}</span>
                  <span style={{ fontSize: '0.68rem', color: '#ec796b', fontWeight: 700 }}>Email &rarr;</span>
                </a>
              ))}
            </div>
          </div>

          {/* Security Note */}
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted, #64748b)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '0.65rem',
            }}
          >
            <ShieldCheck size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
            <span>Support will never ask for your private key or seed phrase.</span>
          </div>
        </div>
      )}

      {/* Floating Launcher Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Clickable pill: Direct Mailto or open card */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(236, 121, 107, 0.35)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ec796b')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(236, 121, 107, 0.35)')}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
              display: 'inline-block',
            }}
          />
          <span>Customer Support</span>
          {isOpen ? <X size={14} style={{ color: '#ec796b' }} /> : <ChevronUp size={14} style={{ color: '#ec796b' }} />}
        </button>

        {/* Circular Mailto Floating Button */}
        <a
          href={defaultMailto}
          aria-label="Send Email to Customer Support"
          title={`Email Customer Support (${supportEmail})`}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ec796b 0%, #d85d4f 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(236, 121, 107, 0.45)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(236, 121, 107, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(236, 121, 107, 0.45)';
          }}
        >
          <Mail size={24} />
        </a>
      </div>
    </aside>
  );
}
