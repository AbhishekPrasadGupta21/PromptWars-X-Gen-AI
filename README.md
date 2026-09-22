# 🛡️ Phishing Inspector v1.0
> AI-Powered Phishing & Fake Offer Letter Scanner

![Hackathon: PromptWars](https://img.shields.io/badge/Hackathon-PromptWars_x_GEN_AI-blue?style=for-the-badge)
![Powered By: Google Gemini](https://img.shields.io/badge/Powered_By-Google_Gemini-purple?style=for-the-badge)
![Tech Stack: Next.js](https://img.shields.io/badge/Built_With-Next.js_|_Tailwind-teal?style=for-the-badge)

## 🚀 Live Demo
**[Insert Cloud Run Live URL Here]**

---

## 📖 Project Overview & Problem Statement

As digital scams become increasingly sophisticated, job seekers and individuals are frequently targeted by fake offer letters, upfront equipment deposit scams, and rental traps. These sophisticated attacks often bypass traditional spam filters by impersonating legitimate corporate identities.

**Phishing Inspector** is a single-page security dashboard designed to parse employment letters, rental listings, and suspicious URLs. It instantly detects advance-fee traps and domain impersonation, calculating a dynamic **Scam Threat Index (0-100%)** to help users make informed, safe decisions before they lose money or sensitive credentials.

---

## ✨ Core Features

- **"Honey-Trap" AI Counter-Interrogator:** A 1-click feature where Gemini dynamically drafts a strategically crafted bait/verification email. It asks for specific corporate verification markers (e.g., official procurement portal link, employer tax ID/EIN, official corporate landline) to force scammers to expose their lack of legitimate infrastructure.
- **Multi-Vector Google Ecosystem Leverage:** Pairs Gemini with the Google Safe Browsing Lookup API to cross-check extracted URLs/domains in real-time, and utilizes Gemini Google Search Grounding to verify if claimed hiring managers and corporate offices actually exist online.
- **Visual "Scam Heatmap" (Clause Inspector Mode):** Renders the original document text in an interactive viewer with color-coded annotations (crimson for advance-fee demands, amber for urgency pressure, purple for suspicious recruiter handles). Hovering over highlighted clauses triggers instant tooltips explaining the exact fraudulent tactic.
- **Evidentiary Incident Dossier & Reporting Generator:** A 1-click export of a structured incident report (formatted for FTC and Indian Cyber Crime reporting). It bundles the RDAP registration timeline, Google Safe Browsing verdict, extracted fraudulent clauses, and calculated threat index into an actionable PDF artifact for HR or law enforcement.
- **Modern UI/UX:** Fully responsive Light/Dark mode, high-contrast Tailwind styling, robust PDF upload capabilities, and 1-Click Hackathon Presets for rapid live testing.

---

## 💻 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **AI Integration:** Google Gemini API (`@google/genai` SDK)
- **Security Integrations:** Google Safe Browsing API
- **Deployment & Infra:** Docker, Google Cloud Run

---

## ⚙️ Getting Started / Local Setup

Follow these steps to run the Phishing Inspector locally on your machine.

**1. Clone the repository**
```bash
git clone https://github.com/AbhishekPrasadGupta21/PromptWars-X-Gen-AI.git
cd PromptWars-X-Gen-AI
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Create a `.env.local` file in the root directory and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_SAFE_BROWSING_API_KEY=your_safe_browsing_api_key_here
```

**4. Run the development server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🙏 Acknowledgments

Built with ❤️ for **PromptWars x GEN AI Club**, in collaboration with **Hack2Skill** and **Google for Developers**.
