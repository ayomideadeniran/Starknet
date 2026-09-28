'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  ArrowUpRight,
  Mail,
  CheckCircle2,
  Loader2,
  ExternalLink,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('💰 Deposit & Capital Allocation');
  const [userMessage, setUserMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Access user session if logged in
  const { user } = useAuth();

  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@starknet-portal.io';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill user email if logged in
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const quickTopics = [
    {
      label: '💰 Deposit & Capital Allocation',
      placeholder: 'Hello, I need assistance with a deposit or capital allocation on my Starknet account...',
    },
    {
      label: '⚡ Withdrawal Support',
      placeholder: 'Hello, I have an inquiry regarding a withdrawal execution and settlement time...',
    },
    {
      label: '📑 Custodial Agreement Inquiry',
      placeholder: 'Hello, I have a question regarding institutional custody documentation and vault tiers...',
    },
    {
      label: '🔐 Account & Security Help',
      placeholder: 'Hello, I need assistance with my account security, 2FA, or verification...',
    },
  ];

  const handleSelectTopic = (topic: { label: string; placeholder: string }) => {
    setSelectedTopic(topic.label);
    if (!userMessage.trim()) {
      setUserMessage(topic.placeholder);
    }
  };

  const handleSendEmailInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    const trimmedMessage = userMessage.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address so we can reply.');
      return;
    }

    if (!trimmedMessage) {
      setErrorMessage('Please enter your question or inquiry details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name || trimmedEmail.split('@')[0],
          email: trimmedEmail,
          category: selectedTopic,
          subject: selectedTopic,
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTicketId(data.ticketId || `SPT-${Math.floor(100000 + Math.random() * 900000)}`);
        setIsSuccess(true);
      } else {
        setErrorMessage(data.error || 'Failed to dispatch inquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error occurred. Please try again or use direct mailto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setTicketId('');
    setUserMessage('');
    setErrorMessage('');
  };

  const directMailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(
    `[Support Desk] ${selectedTopic}`
  )}&body=${encodeURIComponent(userMessage || 'Hello Support Team,')}`;

  if (!mounted) return null;

  return (
    <>
      {/* Floating Support Desk Launcher */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.5rem',
        }}
      >
        {/* Tooltip / Prompt pill */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#ffffff',
              padding: '0.45rem 0.95rem',
              borderRadius: '99px',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
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
            <span>Direct Email Support Desk</span>
            <ArrowUpRight size={13} style={{ color: '#38bdf8' }} />
          </button>
        )}

        {/* Main Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Support Desk' : 'Open Support Desk'}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 8px 28px rgba(2, 132, 199, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isOpen ? 'scale(0.92)' : 'scale(1)',
          }}
        >
          {isOpen ? <X size={26} /> : <Mail size={26} />}
        </button>
      </div>

      {/* Direct Email Support Modal Card */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: 'calc(100vw - 48px)',
            maxWidth: '430px',
            background: '#0d131f',
            border: '1px solid rgba(56, 189, 248, 0.28)',
            borderRadius: '1.25rem',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'inherit',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(180deg, rgba(2, 132, 199, 0.2) 0%, rgba(13, 19, 31, 0.85) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
                }}
              >
                <Mail size={22} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Direct Support Desk
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.76rem',
                    color: '#4ade80',
                    marginTop: '0.15rem',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 6px #22c55e',
                      display: 'inline-block',
                    }}
                  />
                  <span>Human Desk &bull; Responds in &lt;15 mins</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
              maxHeight: '520px',
              overflowY: 'auto',
            }}
          >
            {isSuccess ? (
              /* Success confirmation state */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1.5rem 0.5rem',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#22c55e',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      margin: '0 0 0.35rem 0',
                    }}
                  >
                    Inquiry Dispatched!
                  </h4>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '0.4rem',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Ticket #{ticketId}
                  </div>
                  <p
                    style={{
                      fontSize: '0.825rem',
                      color: '#94a3b8',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    Our private compliance and operations desk has received your ticket. We have logged your request and a specialist will reply directly to <strong style={{ color: '#ffffff' }}>{email}</strong>.
                  </p>
                </div>

                <div
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.78rem',
                    color: '#cbd5e1',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
                    Topic Logged
                  </div>
                  <div style={{ fontWeight: 600 }}>{selectedTopic}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', width: '100%', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.65rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    New Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.65rem',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Email submission form */
              <>
                {/* Direct human desk badge */}
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '0.85rem',
                    background: 'rgba(2, 132, 199, 0.08)',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <ShieldCheck size={20} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.81rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    <strong style={{ color: '#ffffff' }}>Direct 1-on-1 Human Support:</strong> No automated bots. Submit your question directly to our institutional desk via email.
                  </div>
                </div>

                {/* Quick topics picker */}
                <div>
                  <div
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Quick Direct Inquiries
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {quickTopics.map((topic, i) => {
                      const isSelected = selectedTopic === topic.label;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectTopic(topic)}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '0.65rem',
                            background: isSelected
                              ? 'rgba(2, 132, 199, 0.16)'
                              : 'rgba(255, 255, 255, 0.03)',
                            border: isSelected
                              ? '1px solid rgba(56, 189, 248, 0.45)'
                              : '1px solid rgba(255, 255, 255, 0.07)',
                            color: isSelected ? '#ffffff' : '#cbd5e1',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{topic.label}</span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: isSelected ? '#38bdf8' : '#64748b',
                              fontWeight: 700,
                            }}
                          >
                            {isSelected ? '✓ Selected' : 'Select'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSendEmailInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Email address field */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Your Contact Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '0.65rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          outline: 'none',
                          fontSize: '0.85rem',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {/* Message field */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Your Question or Inquiry
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Type your question or transaction details here..."
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '0.65rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        outline: 'none',
                        fontSize: '0.85rem',
                        resize: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Error banner if any */}
                  {errorMessage && (
                    <div
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        fontSize: '0.78rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem',
                      boxShadow: '0 8px 24px rgba(2, 132, 199, 0.4)',
                      opacity: isSubmitting ? 0.75 : 1,
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseDown={(e) => !isSubmitting && (e.currentTarget.style.transform = 'scale(0.98)')}
                    onMouseUp={(e) => !isSubmitting && (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending to Support Desk...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Support Inquiry</span>
                      </>
                    )}
                  </button>

                  {/* Optional direct mail app launcher */}
                  <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
                    <a
                      href={directMailtoUrl}
                      style={{
                        fontSize: '0.74rem',
                        color: '#38bdf8',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <span>Prefer your default mail app? Click to launch mailto</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer note */}
          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: 'rgba(0, 0, 0, 0.35)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.72rem',
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            256-bit Encrypted &bull; Institutional Support Desk &bull; Direct Human Contact
          </div>
        </div>
      )}
    </>
  );
}
