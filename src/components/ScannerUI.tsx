'use client';

import React, { useState } from 'react';
import ThreatMeter from './ThreatMeter';

interface ScanResult {
  scamThreatIndex: number;
  redFlags: string[];
  isPaymentDemanded: boolean;
  domainAgeWarning: boolean;
  verdict: 'Safe' | 'Suspicious' | 'Phishing';
}

export default function ScannerUI() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to scan content');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-3xl p-6 md:p-10">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Analyze Content
        </h2>
        <p className="text-slate-400 mt-2">Paste an email, job offer, or URL to detect potential phishing threats.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleScan} className="flex flex-col gap-4">
          <label htmlFor="scan-input" className="sr-only">
            Content to scan
          </label>
          <textarea
            id="scan-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., You've been selected for a remote data entry position paying $85/hr. Please click here to verify your banking details..."
            className="input-field h-64"
            aria-required="true"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary"
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning...
              </span>
            ) : (
              'Scan Now'
            )}
          </button>
          
          {error && (
            <div className="p-4 bg-red-950/50 border border-red-500/50 rounded-xl text-red-200 mt-2" role="alert">
              <p className="font-semibold flex items-center gap-2">
                <span aria-hidden="true">⚠️</span> Error
              </p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </form>

        <div className="bg-slate-950/40 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
          {!result && !loading && (
            <div className="text-slate-500 text-center flex flex-col items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p>Your results will appear here</p>
            </div>
          )}

          {loading && (
            <div className="text-slate-400 text-center animate-pulse">
              <div className="h-32 w-32 rounded-full border-4 border-slate-800 border-t-primary animate-spin mb-4 mx-auto"></div>
              <p>Analyzing with Gemini AI...</p>
            </div>
          )}

          {result && !loading && (
            <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <ThreatMeter score={result.scamThreatIndex} />
                <div className="text-center sm:text-right">
                  <span className="block text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Verdict</span>
                  <span className={`text-3xl font-black ${result.verdict === 'Safe' ? 'text-emerald-400' : result.verdict === 'Phishing' ? 'text-red-500' : 'text-amber-400'}`}>
                    {result.verdict}
                  </span>
                </div>
              </div>

              <div className="space-y-4 w-full">
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border ${result.isPaymentDemanded ? 'bg-red-950/30 border-red-900 text-red-300' : 'bg-emerald-950/30 border-emerald-900 text-emerald-300'}`}>
                    <span className="text-xs font-bold uppercase block mb-1">Payment Demand</span>
                    <span className="text-sm">{result.isPaymentDemanded ? 'Detected' : 'None Detected'}</span>
                  </div>
                  <div className={`p-3 rounded-lg border ${result.domainAgeWarning ? 'bg-red-950/30 border-red-900 text-red-300' : 'bg-emerald-950/30 border-emerald-900 text-emerald-300'}`}>
                    <span className="text-xs font-bold uppercase block mb-1">Suspicious Links</span>
                    <span className="text-sm">{result.domainAgeWarning ? 'Detected' : 'None Detected'}</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
                  <h4 className="text-sm font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Analysis Details
                  </h4>
                  {result.redFlags.length > 0 ? (
                    <ul className="space-y-2">
                      {result.redFlags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400">No specific red flags were identified in this content.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
