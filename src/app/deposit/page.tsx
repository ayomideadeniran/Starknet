'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Wallet,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Info,
  ExternalLink,
  AlertTriangle,
  Clock,
  Zap,
  CheckCircle2,
  Lock,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface NetworkOption {
  id: string;
  name: string;
  symbol: string;
  networkName: string;
  address: string;
  memo?: string;
  minDeposit: string;
  confirmations: string;
  iconBg: string;
  iconColor: string;
  badge: string;
}

const DEPOSIT_NETWORKS: NetworkOption[] = [
  {
    id: 'eth_usdt',
    name: 'USDT (Ethereum ERC-20)',
    symbol: 'USDT',
    networkName: 'Ethereum Mainnet (ERC20)',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    minDeposit: '$50.00 USD',
    confirmations: '12 Confirmations (~3 mins)',
    iconBg: 'rgba(38, 161, 123, 0.15)',
    iconColor: '#26A17B',
    badge: 'MetaMask Recommended',
  },
  {
    id: 'eth_mainnet',
    name: 'Ethereum (ETH)',
    symbol: 'ETH',
    networkName: 'Ethereum Mainnet',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    minDeposit: '0.015 ETH',
    confirmations: '12 Confirmations (~3 mins)',
    iconBg: 'rgba(98, 126, 234, 0.15)',
    iconColor: '#627EEA',
    badge: 'Direct Web3 Transfer',
  },
  {
    id: 'trc20_usdt',
    name: 'USDT (TRON TRC-20)',
    symbol: 'USDT',
    networkName: 'TRON Network (TRC20)',
    address: 'TYD2vU4A2RzG9qg7R4f4X8X1v9K8P3Q5Wz',
    minDeposit: '$50.00 USD',
    confirmations: '19 Confirmations (~1 min)',
    iconBg: 'rgba(235, 0, 41, 0.15)',
    iconColor: '#FF0013',
    badge: 'Lowest Fees ($1 Gas)',
  },
  {
    id: 'starknet_strk',
    name: 'Starknet (STRK / L2 ETH)',
    symbol: 'STRK',
    networkName: 'Starknet Mainnet (Cairo L2)',
    address: '0x028c7f21226786a345512211f4405d415714041b65e9d342084992523f2b453',
    minDeposit: '20 STRK / 0.01 ETH',
    confirmations: 'Instant ZK-Proof Finality',
    iconBg: 'rgba(236, 121, 107, 0.15)',
    iconColor: '#EC796B',
    badge: 'Native L2 Vault',
  },
  {
    id: 'btc_onchain',
    name: 'Bitcoin (BTC)',
    symbol: 'BTC',
    networkName: 'Bitcoin On-Chain Network',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    minDeposit: '0.001 BTC',
    confirmations: '2 Confirmations (~20 mins)',
    iconBg: 'rgba(247, 147, 26, 0.15)',
    iconColor: '#F7931A',
    badge: 'Bitcoin Core',
  },
];

export default function DepositPage() {
  const [satsMode, setSatsMode] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption>(DEPOSIT_NETWORKS[0]);
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [submittingTx, setSubmittingTx] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) return;
    setSubmittingTx(true);

    setTimeout(() => {
      setSubmittingTx(false);
      setSubmittedSuccess(true);
      setTxHash('');
    }, 1500);
  };

  // QR Code generator URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    selectedNetwork.address
  )}&color=0f172a&bgcolor=ffffff`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <Navbar satsMode={satsMode} onToggleSatsMode={() => setSatsMode(!satsMode)} />

      {/* Hero Banner Header */}
      <section
        style={{
          padding: '4rem 1.5rem 3rem',
          background: 'linear-gradient(180deg, rgba(236, 121, 107, 0.1) 0%, rgba(8, 9, 26, 0) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(236, 121, 107, 0.12)',
              border: '1px solid rgba(236, 121, 107, 0.3)',
              color: '#ec796b',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '1.25rem',
            }}
          >
            <ShieldCheck size={16} />
            <span>SECURE CUSTODIAL PAYMENT PORTAL</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            Deposit &amp; Payment Details
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Transfer funds directly using <strong>MetaMask</strong> or any Web3 wallet. Your capital is instantly credited to your Starknet ZK-Vault portfolio upon network confirmation.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '3rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Network Selector & Payment Address Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Step 1: Select Network */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#ec796b',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                    }}
                  >
                    1
                  </span>
                  <span>Select Payment Network</span>
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {DEPOSIT_NETWORKS.map((net) => {
                    const isSelected = selectedNetwork.id === net.id;
                    return (
                      <button
                        key={net.id}
                        onClick={() => {
                          setSelectedNetwork(net);
                          setSubmittedSuccess(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.95rem 1.15rem',
                          borderRadius: '0.75rem',
                          border: isSelected
                            ? '1.5px solid #ec796b'
                            : '1px solid var(--border-subtle)',
                          background: isSelected
                            ? 'rgba(236, 121, 107, 0.08)'
                            : 'var(--bg-surface-elevated)',
                          color: 'var(--text-main)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '0.5rem',
                              background: net.iconBg,
                              color: net.iconColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: '0.95rem',
                              flexShrink: 0,
                            }}
                          >
                            <Wallet size={20} />
                          </div>

                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{net.name}</div>
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                              {net.networkName}
                            </div>
                          </div>
                        </div>

                        <span
                          className="pill"
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: isSelected ? '#ec796b' : 'var(--bg-surface)',
                            color: isSelected ? '#ffffff' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {net.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Payment Address & QR Code Box */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: '#ec796b',
                        color: '#ffffff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                      }}
                    >
                      2
                    </span>
                    <span>Deposit Address &amp; QR</span>
                  </h2>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--brand-success)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Active Wallet</span>
                  </span>
                </div>

                {/* QR Code & Address Display */}
                <div
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: '0.85rem',
                    padding: '1.5rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  {/* QR Image Box */}
                  <div
                    style={{
                      padding: '0.75rem',
                      background: '#ffffff',
                      borderRadius: '0.75rem',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                      display: 'inline-block',
                    }}
                  >
                    <img
                      src={qrUrl}
                      alt={`${selectedNetwork.name} Deposit QR Code`}
                      width={180}
                      height={180}
                      style={{ display: 'block', borderRadius: '0.35rem' }}
                    />
                  </div>

                  <div style={{ width: '100%' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.4rem',
                      }}
                    >
                      {selectedNetwork.name} Deposit Address
                    </label>

                    {/* Address Text Box with Click to Copy */}
                    <div
                      onClick={() => handleCopy(selectedNetwork.address)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: '0.65rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        gap: '0.5rem',
                        transition: 'all 0.15s ease',
                      }}
                      title="Click to copy deposit address"
                    >
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          wordBreak: 'break-all',
                          color: '#ec796b',
                          textAlign: 'left',
                        }}
                      >
                        {selectedNetwork.address}
                      </span>

                      <button
                        type="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '0.45rem',
                          background: copied ? 'var(--brand-success-bg)' : '#ec796b',
                          color: copied ? 'var(--brand-success)' : '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.775rem',
                          flexShrink: 0,
                        }}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Network Parameters */}
                  <div
                    style={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      fontSize: '0.8rem',
                      textAlign: 'left',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Minimum Deposit:</span>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {selectedNetwork.minDeposit}
                      </div>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Network Speed:</span>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {selectedNetwork.confirmations}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Warning Notice */}
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.65rem',
                    background: 'rgba(234, 179, 8, 0.08)',
                    border: '1px solid rgba(234, 179, 8, 0.25)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    fontSize: '0.8rem',
                    color: '#eab308',
                    lineHeight: 1.5,
                  }}
                >
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Important:</strong> Only send <strong>{selectedNetwork.symbol}</strong> via the <strong>{selectedNetwork.networkName}</strong>. Sending any other asset or using an incorrect network may result in permanent loss.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: How to Pay with MetaMask & Verification Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Step-by-Step "How to Pay with MetaMask" Guide */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Wallet size={20} style={{ color: '#ec796b' }} />
                  <span>How to Pay Using MetaMask</span>
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    {
                      step: '1',
                      title: 'Open MetaMask Wallet',
                      desc: 'Click the MetaMask browser extension or open the mobile app on your device.',
                    },
                    {
                      step: '2',
                      title: 'Select Correct Network',
                      desc: `Ensure your MetaMask is connected to ${selectedNetwork.networkName}.`,
                    },
                    {
                      step: '3',
                      title: 'Click Send & Paste Address',
                      desc: 'Click "Send" in MetaMask, paste the copied address above, and enter your deposit amount.',
                    },
                    {
                      step: '4',
                      title: 'Confirm Transaction',
                      desc: 'Review gas fees and click "Confirm". Your portfolio balance will update automatically upon network confirmation.',
                    },
                  ].map((s) => (
                    <div
                      key={s.step}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '0.65rem',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: '#ec796b',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          flexShrink: 0,
                        }}
                      >
                        {s.step}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                          {s.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {s.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Hash Submission & Confirmation Form */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={20} style={{ color: 'var(--brand-success)' }} />
                  <span>Verify Payment / Submit Tx Hash</span>
                </h2>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Paid already? Submit your Transaction Hash (TxID) to expedite vault allocation.
                </p>

                {submittedSuccess ? (
                  <div
                    style={{
                      padding: '1.25rem',
                      borderRadius: '0.75rem',
                      background: 'var(--brand-success-bg)',
                      border: '1px solid var(--brand-success)',
                      color: 'var(--brand-success)',
                      textAlign: 'center',
                    }}
                  >
                    <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      Payment Confirmation Submitted!
                    </h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                      Our node monitor is tracking your transaction on {selectedNetwork.networkName}. Your portfolio balance will update shortly.
                    </p>

                    <button
                      onClick={() => setSubmittedSuccess(false)}
                      className="btn btn-secondary"
                      style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      Submit Another Transaction
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label htmlFor="tx-hash-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                        Transaction Hash (TxID)
                      </label>
                      <input
                        id="tx-hash-input"
                        type="text"
                        placeholder="e.g. 0x9f4a8b... or Tx Hash from MetaMask"
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid var(--border-subtle)',
                          background: 'var(--bg-surface-elevated)',
                          fontSize: '0.9rem',
                          color: 'var(--text-main)',
                        }}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingTx || !txHash.trim()}
                      className="btn btn-primary"
                      style={{
                        padding: '0.85rem',
                        width: '100%',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        opacity: !txHash.trim() ? 0.6 : 1,
                      }}
                    >
                      {submittingTx ? (
                        <span>Verifying On-Chain...</span>
                      ) : (
                        <>
                          <span>Verify &amp; Confirm Payment</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Need Help Box */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <HelpCircle size={24} style={{ color: '#ec796b' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Need Assistance?</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      Contact our 24/7 Support Desk for deposit routing help.
                    </div>
                  </div>
                </div>

                <Link
                  href="/support"
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}
                >
                  Support Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
