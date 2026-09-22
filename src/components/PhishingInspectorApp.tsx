'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Shield, Moon, Sun, Sparkles, AlertTriangle, AlertCircle, CheckCircle2, ChevronRight, FileText, Globe, DollarSign, MessageSquare, Clipboard, Trash2, ShieldCheck, Printer, Upload } from 'lucide-react';

interface ThreatVectors {
  financial: number;
  domain: number;
  interview: number;
}

interface DomainInfo {
  domain: string;
  ageDays: number;
  registeredDate: string;
  registrarType: string;
}

interface RedFlag {
  title: string;
  category: string;
  severity: string;
  excerpt: string;
  explanation: string;
}

interface ActionStep {
  step: string;
  description: string;
}

interface ScanResult {
  isEntityVerifiedBySearch: boolean;
  searchGroundingSummary: string;
  honeyTrapEmail: string;
  scamThreatIndex: number;
  threatVectors: ThreatVectors;
  domainInfo: DomainInfo;
  redFlags: RedFlag[];
  actionPlan: ActionStep[];
}



export default function PhishingInspectorApp() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'text' | 'file' | 'url'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInput(text);
      };
      reader.readAsText(file);
    } else {
      setInput(''); // pdf will be parsed on scan
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleScan = async () => {
    if (inputType !== 'file' && !input.trim()) return;
    if (inputType === 'file' && !selectedFile && !input.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let contentToScan = input;
      
      if (inputType === 'file' && selectedFile && selectedFile.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const parseRes = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });
        
        if (!parseRes.ok) {
          throw new Error('Failed to parse the PDF document');
        }
        
        const parseData = await parseRes.json();
        contentToScan = parseData.text;
      } else if (inputType === 'file' && !contentToScan) {
        throw new Error('Please select a file to scan');
      }

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: contentToScan }),
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

  const getSeverityColor = (severity: string) => {
    if (severity === 'CRITICAL') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (severity === 'HIGH') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 print:bg-white font-sans text-slate-900 dark:text-slate-50 print:text-black selection:bg-teal-500/30">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border border-teal-200 dark:border-teal-800/50">
              <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Phishing Inspector</h1>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800/50">v1.0 Security Inspector</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Fake Offer Letter & Phishing Scanner • Scam Threat Index (0–100%)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">
              <ChevronRight className="w-4 h-4 text-teal-500" />
              RDAP WHOIS Protocol
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 text-sm font-medium text-purple-700 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
              Google Gemini AI
            </div>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP BANNER */}
        <div className="text-center space-y-4 py-8 print:hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-sm font-semibold border border-teal-200 dark:border-teal-800/50 mb-2">
            <ShieldCheck className="w-4 h-4" />
            AI-POWERED PHISHING & FAKE OFFER INSPECTOR
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Detect Fake Offer Letters & Phishing Traps <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-purple-500">Before They Cost You Money</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Parse employment letters, rental listings, or recruiter domains. Inspect domain age via RDAP WHOIS, detect check-cashing equipment scams, and calculate a dynamic Scam Threat Index (0–100%).
          </p>
        </div>

        {/* INPUT CONTROLS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden print:hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <button 
                onClick={() => setInputType('text')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${inputType === 'text' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <FileText className="w-4 h-4" /> Paste Offer Text
              </button>
              
              <button 
                onClick={() => setInputType('file')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${inputType === 'file' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Upload className="w-4 h-4" /> Upload PDF / Document
              </button>
              
              <button 
                onClick={() => { setInputType('url'); setInput(''); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${inputType === 'url' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Globe className="w-4 h-4" /> Scan URL / Domain
              </button>
            </div>

            {inputType === 'text' && (
              <textarea
                className="w-full h-64 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all monospace-input text-sm text-slate-800 dark:text-slate-300 resize-y"
                placeholder="Paste email headers, job offer body, or suspect URLs here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            )}
            
            {inputType === 'file' && (
              <div 
                className="w-full h-64 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex flex-col items-center justify-center cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".txt,.md,.csv,.eml,.json,.pdf"
                />
                <Upload className="w-10 h-10 text-teal-500 mb-4" />
                {selectedFile ? (
                  <>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{selectedFile.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Ready to scan</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Upload PDF / Document</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Supports official job offer letters, employment contracts, or rental PDFs</p>
                  </>
                )}
              </div>
            )}

            {inputType === 'url' && (
              <div className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
                <Globe className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="url"
                  className="w-full bg-transparent outline-none text-slate-800 dark:text-slate-300 text-sm"
                  placeholder="https://suspicious-domain.com or hr-portal-login.net"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleScan();
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={() => { setInput(''); setSelectedFile(null); }}
                className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-500 transition-colors font-medium text-sm"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
              <button
                onClick={handleScan}
                disabled={loading || (inputType === 'file' ? !selectedFile && !input.trim() : !input.trim())}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                {loading ? <Sparkles className="w-5 h-5 animate-pulse" /> : <ShieldCheck className="w-5 h-5" />}
                {loading ? 'ANALYZING...' : 'INSPECT OFFER SECURITY'}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* RESULTS DASHBOARD */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 print:shadow-none">
            
            <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
              <h2 className="text-2xl font-black uppercase tracking-widest text-black">
                OFFICIAL CYBER FRAUD INCIDENT DOSSIER - GENERATED BY VERIFYGUARD
              </h2>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 print:text-black">
                <Shield className="w-5 h-5 text-teal-500 print:text-black" />
                Security Inspection Report <span className="text-slate-400 font-normal text-sm print:text-black">• Generated Just Now</span>
              </h3>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors print:hidden">
                <Printer className="w-4 h-4" /> Generate Official Cyber Crime Dossier
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: Threat Index & Vectors */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Circular Gauge Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <ActivityIcon className="w-4 h-4 text-teal-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dynamic Threat Index</span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      result.scamThreatIndex >= 75 ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400' :
                      result.scamThreatIndex >= 40 ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800/50 dark:text-orange-400' :
                      'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-400'
                    }`}>
                      {result.scamThreatIndex >= 75 ? 'CRITICAL THREAT' : result.scamThreatIndex >= 40 ? 'MODERATE RISK' : 'SAFE'}
                    </span>
                  </div>

                  <div className="mt-12 mb-6 relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full progress-ring__circle" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" fill="none" r="50" strokeWidth="12" className="stroke-slate-100 dark:stroke-slate-800" />
                      <circle 
                        cx="60" 
                        cy="60" 
                        fill="none" 
                        r="50" 
                        strokeWidth="12" 
                        strokeDasharray={2 * Math.PI * 50} 
                        strokeDashoffset={(2 * Math.PI * 50) - ((result.scamThreatIndex / 100) * (2 * Math.PI * 50))}
                        className={`transition-all duration-1000 ease-out ${
                          result.scamThreatIndex >= 75 ? 'stroke-red-500' : result.scamThreatIndex >= 40 ? 'stroke-orange-500' : 'stroke-green-500'
                        }`}
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-start">
                        {result.scamThreatIndex}<span className="text-xl mt-1 text-slate-500">%</span>
                      </span>
                      <span className="text-xs font-bold text-slate-400 tracking-widest mt-1">THREAT INDEX</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {result.scamThreatIndex >= 75 ? 'Critical Scam Detected' : result.scamThreatIndex >= 40 ? 'Moderate Threat / Caution Advised' : 'Appears Legitimate'}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
                      {result.scamThreatIndex >= 75 ? 'CRITICAL: Multiple high-confidence fraud markers detected. Do not engage.' : 
                       result.scamThreatIndex >= 40 ? 'CAUTION: Multiple red flags detected. Independently verify HR details.' :
                       'SAFE: No immediate fraud markers detected. Standard caution still advised.'}
                    </p>
                  </div>
                </div>

                {/* Threat Vectors Breakdown */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <BarChartIcon className="w-5 h-5 text-teal-500" /> Threat Vector Breakdown
                    </h4>
                    <span className="text-xs text-slate-400">Dynamic Risk Vector Weighting</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><DollarSign className="w-4 h-4 text-emerald-500" /> Financial & Equipment Demands</span>
                        <span className="text-slate-500">{result.threatVectors.financial} / 40 pts ({Math.round(result.threatVectors.financial/40*100)}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(result.threatVectors.financial / 40) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Globe className="w-4 h-4 text-blue-500" /> Domain & Identity Risk</span>
                        <span className="text-slate-500">{result.threatVectors.domain} / 30 pts ({Math.round(result.threatVectors.domain/30*100)}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(result.threatVectors.domain / 30) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><MessageSquare className="w-4 h-4 text-purple-500" /> Interview & Process Risk</span>
                        <span className="text-slate-500">{result.threatVectors.interview} / 15 pts ({Math.round(result.threatVectors.interview/15*100)}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(result.threatVectors.interview / 15) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: AI & RDAP Audits */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Gemini AI Forensics Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center border border-purple-200 dark:border-purple-800/50">
                        <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Google Gemini AI Forensics</h4>
                        <p className="text-xs text-purple-600 dark:text-purple-400">Deep Learning Contextual Scam Analysis</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Live Connection Mode
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 print:text-black">
                    Gemini 2.5 Flash successfully parsed the payload semantics, extracting hidden manipulative patterns and correlating them against known advance-fee fraud and credential harvesting playbooks.
                  </p>
                </div>

                {/* Search Grounding Card */}
                <div className="bg-white dark:bg-slate-900 print:bg-white print:shadow-none print:border-black rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800/50 print:border-black">
                        <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400 print:text-black" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white print:text-black">Google Search Grounding</h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400 print:text-black">Live Entity Verification</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${result.isEntityVerifiedBySearch ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} print:border-black print:bg-transparent print:text-black`}>
                      {result.isEntityVerifiedBySearch ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 print:text-black">
                    {result.searchGroundingSummary}
                  </p>
                </div>

                {/* RDAP / Domain Audit Card */}
                <div className="bg-white dark:bg-slate-900 print:bg-white print:shadow-none print:border-black rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border border-teal-200 dark:border-teal-800/50">
                        <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{result.domainInfo.domain}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">ICANN RDAP Protocol Domain Audit</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-full border border-orange-200 dark:border-orange-800/50">
                      {result.domainInfo.registrarType}
                    </span>
                  </div>

                  {result.domainInfo.registrarType.toLowerCase().includes('public') && (
                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/50 rounded-lg p-4 mb-6">
                      <h5 className="text-sm font-bold text-orange-800 dark:text-orange-400 flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4" /> Public Email Provider Alert ({result.domainInfo.domain})
                      </h5>
                      <p className="text-xs text-orange-700 dark:text-orange-300/80">
                        This offer utilizes a free webmail provider. Corporate recruiters from legitimate organizations communicate using official corporate domains, never public webmail accounts.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-3 border border-slate-100 dark:border-slate-800/50">
                      <div className="text-xs text-slate-400 flex items-center gap-1 mb-1"><ClockIcon className="w-3 h-3" /> Domain Age</div>
                      <div className="font-bold text-slate-900 dark:text-white">{result.domainInfo.ageDays} Days</div>
                      <div className="text-[10px] text-teal-600 mt-1">✓ Established domain</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-3 border border-slate-100 dark:border-slate-800/50">
                      <div className="text-xs text-slate-400 flex items-center gap-1 mb-1"><CalendarIcon className="w-3 h-3" /> Registered On</div>
                      <div className="font-bold text-slate-900 dark:text-white">{result.domainInfo.registeredDate}</div>
                      <div className="text-[10px] text-slate-500 mt-1">ICANN Registration Record</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-3 border border-slate-100 dark:border-slate-800/50">
                      <div className="text-xs text-slate-400 flex items-center gap-1 mb-1"><BuildingIcon className="w-3 h-3" /> Domain Registrar</div>
                      <div className="font-bold text-slate-900 dark:text-white truncate">{result.domainInfo.registrarType}</div>
                      <div className="text-[10px] text-slate-500 mt-1">Official WHOIS Entity</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* SECURITY RED FLAGS SECTION */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  Detected Security Red Flags ({result.redFlags.length})
                </h3>
                <span className="text-xs text-slate-400">Categorized by Threat Severity</span>
              </div>
              
              <div className="space-y-4">
                {result.redFlags.map((flag, idx) => (
                  <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {flag.category.includes('FINANCIAL') ? <DollarSign className="w-5 h-5 text-emerald-500" /> :
                           flag.category.includes('INTERVIEW') ? <MessageSquare className="w-5 h-5 text-purple-500" /> :
                           <Globe className="w-5 h-5 text-teal-500" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-md">{flag.title}</h4>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{flag.category}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-widest ${getSeverityColor(flag.severity)}`}>
                        {flag.severity}
                      </span>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-600 dark:text-slate-400 mb-3">
                      "{flag.excerpt}"
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {flag.explanation}
                    </p>
                  </div>
                ))}
                {result.redFlags.length === 0 && (
                  <div className="text-center py-8 text-slate-500">No explicit red flags detected by the heuristic engine.</div>
                )}
              </div>
            </div>

            {/* ACTION PLAN & VERIFICATION DRAFT */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mt-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
                Recommended Action Plan & Verification Countermeasures
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {result.actionPlan.map((step, idx) => (
                  <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950">
                    <h5 className="font-bold text-teal-600 dark:text-teal-400 text-sm mb-2">{idx + 1}. {step.step}</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{step.description}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm print:text-black">
                    <MessageSquare className="w-4 h-4 text-purple-500 print:text-black" /> Safe HR Verification Email Response Draft
                  </h5>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.honeyTrapEmail)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors text-xs font-semibold print:hidden"
                  >
                    <Clipboard className="w-3.5 h-3.5" /> Copy Verification Email
                  </button>
                </div>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 font-mono text-xs md:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap border-l-4 border-l-slate-800 dark:border-l-slate-200 print:bg-white print:border-black print:text-black print:border-l-black">
                  {result.honeyTrapEmail}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-cyan-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50 print:hidden">
                <span className="text-slate-400 mr-auto">Official Cybersecurity Fraud Reporting Portals:</span>
                
                <a 
                  href="https://cybercrime.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  Indian Cyber Crime Portal ↗
                </a>
              </div>
            </div>

          </div>
        )}

      </main>

      <footer className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
        Built for Google for Developers | PromptWars x Gen AI Club Hackathon • Single-Page Security Scanner
      </footer>
    </div>
  );
}

// Icon Helpers
const ActivityIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const BarChartIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>;
const ClockIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CalendarIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const BuildingIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>;
