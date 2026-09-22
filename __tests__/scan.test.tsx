import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PhishingInspectorApp from '../src/components/PhishingInspectorApp';
import React from 'react';
import { ThemeProvider } from 'next-themes';

// Mock matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// Mock fetch globally
global.fetch = vi.fn();

// We need to wrap the app with ThemeProvider in tests if it uses next-themes
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="light">
    {children}
  </ThemeProvider>
);

describe('Phishing Inspector (PhishingInspectorApp) Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the scanner interface properly', () => {
    render(
      <TestWrapper>
        <PhishingInspectorApp />
      </TestWrapper>
    );
    
    // Check header
    expect(screen.getByText('Phishing Inspector')).toBeInTheDocument();
    
    // Check textarea
    expect(screen.getByPlaceholderText(/Paste email headers, job offer body/i)).toBeInTheDocument();
    
    // Check scan button is initially disabled
    const scanBtn = screen.getByRole('button', { name: /INSPECT OFFER SECURITY/i });
    expect(scanBtn).toBeDisabled();
  });

  it('handles input and successful scan submission', async () => {
    // Mock the API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        scamThreatIndex: 85,
        threatVectors: {
          financial: 35,
          domain: 25,
          interview: 10
        },
        domainInfo: {
          domain: 'scammer.com',
          ageDays: 2,
          registeredDate: '2023-10-01',
          registrarType: 'Public Registrar'
        },
        redFlags: [
          {
            title: 'Urgent payment demand',
            category: 'FINANCIAL RISK',
            severity: 'CRITICAL',
            excerpt: 'send $500',
            explanation: 'Demanding upfront money.'
          }
        ],
        actionPlan: [
          { step: 'Do Not Pay', description: 'Do not send any money.' }
        ]
      })
    });

    render(
      <TestWrapper>
        <PhishingInspectorApp />
      </TestWrapper>
    );
    
    const textarea = screen.getByPlaceholderText(/Paste email headers, job offer body/i);
    const scanBtn = screen.getByRole('button', { name: /INSPECT OFFER SECURITY/i });

    // Type in the textarea
    fireEvent.change(textarea, { target: { value: 'Please send $500 immediately to verify your account.' } });
    
    // Button should be enabled now
    expect(scanBtn).not.toBeDisabled();

    // Click submit
    fireEvent.click(scanBtn);

    // Wait for the result to render
    await waitFor(() => {
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('CRITICAL THREAT')).toBeInTheDocument();
    });

    // Check specific flags are rendered
    expect(screen.getByText('Urgent payment demand')).toBeInTheDocument();
  });

  it('displays an error message if the API fails', async () => {
    // Mock the API error
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Invalid API Key'
      })
    });

    render(
      <TestWrapper>
        <PhishingInspectorApp />
      </TestWrapper>
    );
    
    const textarea = screen.getByPlaceholderText(/Paste email headers, job offer body/i);
    const scanBtn = screen.getByRole('button', { name: /INSPECT OFFER SECURITY/i });

    fireEvent.change(textarea, { target: { value: 'Some test text' } });
    fireEvent.click(scanBtn);

    // Wait for error to render
    await waitFor(() => {
      expect(screen.getByText('Invalid API Key')).toBeInTheDocument();
    });
    
    // Ensure results are not shown
    expect(screen.queryByText('Security Inspection Report')).not.toBeInTheDocument();
  });
});
