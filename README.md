# 🛡️ VERIFYGUARD v1.0 Security Inspector
> AI-Powered Phishing & Fake Offer Letter Inspector

![Hackathon: PromptWars](https://img.shields.io/badge/Hackathon-PromptWars_x_GEN_AI-blue)
![Powered By: Google Gemini](https://img.shields.io/badge/Powered_By-Google_Gemini-purple)
![Tech Stack: Next.js](https://img.shields.io/badge/Built_With-Next.js_|_Tailwind-teal)

## 🚀 Live Demo
**[Insert Cloud Run Live URL Here]**

---

## 📖 Project Overview & Problem Statement
As digital scams become increasingly sophisticated, job seekers and individuals are frequently targeted by fake offer letters, upfront equipment deposit scams, and rental traps. 

**VERIFYGUARD** is a single-page security dashboard designed to parse employment letters, rental listings, and suspicious URLs. It instantly detects advance-fee traps and domain impersonation, calculating a dynamic **Scam Threat Index (0-100%)** to help users make informed, safe decisions before they lose money or sensitive credentials.

---

## ✨ Core Features

*   **Dynamic Threat Index & Risk Vectors:** Calculates a dynamic Scam Threat Index (0-100%) and categorizes risks into Financial, Domain, and Interview vectors, visualized via a sleek circular gauge and progress bars.
*   **Google Gemini Search Grounding:** Leverages the Gemini built-in search tool to cross-reference company names, recruiters, and domains against live web data, exposing discrepancies and verifying legitimate entities instantly.
*   **"Honey-Trap" AI Counter-Interrogator:** Dynamically generates a highly strategic, customized email draft. Instead of a generic reply, it acts as bait, challenging scammers to expose their lack of corporate infrastructure by asking for verifiable markers (e.g., official procurement links, EINs).
*   **Cyber Crime Dossier Export:** 1-click print-to-PDF functionality that exports an official, high-contrast incident report tailored for law enforcement. Includes quick access to the Indian Cyber Crime Portal, FTC, and FBI IC3.
*   **RDAP WHOIS Domain Audit:** Automatically flags newly registered domains and issues severe warnings against corporate entities utilizing public webmail providers.
*   **Premium UI/UX:** Fully responsive layout with seamless Light/Dark mode transitions, high-contrast Tailwind styling, and 1-Click Hackathon Presets for rapid live testing of various scam vectors.

---

## 🛠️ Tech Stack

*   **Frontend & Framework:** Next.js (App Router), TypeScript, React
*   **Styling:** Tailwind CSS, Lucide Icons
*   **AI Engine:** Google Gemini API (`@google/genai` SDK) utilizing `gemini-2.5-flash` with live Google Search Grounding tools.
*   **Deployment:** Docker, Google Cloud Run

---

## 💻 Getting Started / Local Setup

Follow these steps to run VERIFYGUARD locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/phishing-inspector.git
   cd phishing-inspector
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and securely add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to start inspecting offers.

---

## 🙌 Acknowledgments
Built with ❤️ for the **PromptWars x GEN AI Club** hackathon. 
Special thanks to **Hack2Skill** and **Google for Developers** for providing the platform, tools, and inspiration to build a safer web.
