# 🎫 TicketZero - AI Triage Agent

**Turn vague client emails into ready-to-code engineering tickets in seconds.**

TicketZero is a Micro-SaaS tool designed for freelance developers and agencies. It uses Multimodal AI (Google Gemini 2.5 Flash) to analyze "angry" non-technical bug reports—including screenshots—and instantly converts them into structured Jira/GitHub tickets.

![App Screenshot](Screenshot%202025-12-04%20183057.png)
*(Replace this link with a screenshot of your actual app once deployed!)*

## 🚀 Live Demo
[**Click here to view the Live App**](ticket-zero.vercel.app)

---

## 🧐 The Problem
Clients often send bug reports like this:
> *"The website is broken! I clicked the button and it froze. Fix it now!"*

Developers waste hours going back and forth to get the **Browser**, **Steps to Reproduce**, and **Actual Error**.

## 💡 The Solution
TicketZero acts as the "Smart Translator."
1.  **Paste the Email:** The AI reads the emotional text.
2.  **Upload the Screenshot:** The AI analyzes the UI state (Vision capabilities).
3.  **Get the Ticket:** Instantly generates a structured report with:
    * **Severity:** (Critical/High/Medium/Low)
    * **Technical Summary**
    * **Steps to Reproduce**
    * **Suggested Technical Fix**

---

## 🛠️ Tech Stack
* **Framework:** Next.js 14 (App Router)
* **AI Model:** Google Gemini 2.5 Flash (via Google Generative AI SDK)
* **Styling:** Tailwind CSS + Custom Hand-Drawn SVGs
* **Language:** TypeScript
* **Hosting:** Vercel

## ✨ Key Features
* **Multimodal Analysis:** Reads both text and images to diagnose bugs.
* **Rate Limiting:** Custom implementation limiting users to 1,500 credits/day and cooldowns to prevent spam.
* **Markdown Export:** One-click copy formatted perfectly for GitHub Issues or Jira.
* **Dark Mode UI:** Modern, glassmorphic design with a developer-focused aesthetic.

---

## ⚡ Getting Started Locally

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/yourusername/ticket-zero.git](https://github.com/yourusername/ticket-zero.git)
    cd ticket-zero
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add your Google Gemini API key:
    ```env
    GEMINI_API_KEY=AIzaSy...
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)
