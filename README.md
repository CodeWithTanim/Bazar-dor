# বাজার দর (BazarDor) — Daily Commodity Price Tracker

A modern, responsive web application for tracking daily essential commodity prices across major markets in Bangladesh. BazarDor provides real-time market updates, daily price trends, market-wise price comparisons, and categorical breakdowns to keep consumers informed.

---

## 📌 Project Overview

**BazarDor (বাজার দর)** monitors the volatility and daily pricing trends of essential grocery items including rice, lentils, edible oil, vegetables, fish, meat, dairy, and spices. The portal aggregates data to present daily price increases, price drops, and historical market analyses with Bengali numeral support.

- **Live URL:** [https://bazardor.vercel.app](https://bazardor.vercel.app) *(Deployment Link)*
- **GitHub Repository:** [https://github.com/CodeWithTanim/bazar-dor](https://github.com/CodeWithTanim/bazar-dor)

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Modern full-stack React framework with server-side rendering & route handlers |
| **React 19** | Component-based UI library |
| **TypeScript** | Type-safe enterprise code architecture |
| **Tailwind CSS 4** | Utility-first responsive styling and typography |
| **BetterAuth** | Secure authentication engine (Email/Password, Google & GitHub OAuth) |
| **MongoDB** | Database storage with `@better-auth/mongo-adapter` |
| **React Toastify** | Interactive notification system |
| **React Marquee Text** | Real-time infinite price ticker strip |
| **BazarDor API** | Cloudflare Workers microservice data provider |

---

## ✨ Key Features

1. **Daily Price Ticker & Market Summary:**
   - Real-time infinite marquee strip beneath the navbar displaying current product prices, units, and fluctuation badges (`▲ / ▼ / — %`).
   - Daily overview showing today's top price risers (*আজ দাম বেড়েছে*) and fallers (*আজ দাম কমেছে*).

2. **Categorized Market Exploration & Sorting:**
   - Filter products across core categories: Chal, Dal, Tel, Sobji, Mach, Mangsho, Dim-Dudh, and Moshla.
   - Comprehensive sorting options (`ডিফল্ট`, `দাম: কম থেকে বেশি`, `দাম: বেশি থেকে কম`) accurately handling Bengali numerals.
   - Dynamic active category highlighting in the navigation bar.

3. **In-depth Product Analytics & Market Comparison:**
   - Detailed product view displaying minimum, maximum, and average market pricing across different geographical divisions and bazaars.
   - Daily price differential comparisons with yesterday's baseline.

4. **Robust Authentication & Protected Routes:**
   - Multi-provider authentication powered by BetterAuth supporting Email/Password, Google OAuth, and GitHub OAuth.
   - Route protection for detailed product views and user accounts with automatic redirection for unauthenticated visits.

5. **User Profile & Account Information Management:**
   - Dedicated user profile dashboard displaying account credentials and active session info.
   - Interactive profile update route allowing users to modify personal account information seamlessly.

6. **Responsive & Accessible Design:**
   - Built with mobile-first responsive architecture supporting smartphones, tablets, and desktop displays.
   - Bengali localization with Noto Serif Bengali typography and native numeral formatting.

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher
- **npm** / **yarn** / **pnpm**
- **MongoDB** instance (Local or Atlas)

### 2. Clone the Repository
```bash
git clone https://github.com/CodeWithTanim/bazar-dor.git
cd bazar-dor
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
# MongoDB Connection
MONGODB_CLIENT_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net"

# BetterAuth Settings
BETTER_AUTH_SECRET="your-better-auth-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (Optional for local testing)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the application.

---

## 📁 Directory Structure

```text
bazar-dor/
├── public/               # Static assets, logos, and hero graphics
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   │   ├── (auth)/       # Signin and Signup authentication routes
│   │   ├── api/          # BetterAuth route handlers
│   │   ├── category/     # Dynamic category view with sort controls
│   │   ├── product/      # Protected product detail & analytics view
│   │   ├── profile/      # User profile & profile update route
│   │   ├── layout.tsx    # Root layout with header, ticker, and notifications
│   │   └── page.tsx      # Main landing page (hero & market sections)
│   ├── components/       # Header, NavLinks, Footer, Marquee, UserInfo
│   ├── lib/              # BetterAuth server and client configuration
│   ├── proxy.ts          # Route middleware for access protection
│   └── type/             # TypeScript interfaces and data models
├── package.json
└── README.md
```

---

## 📄 License

This project is built as an educational submission for programming assessments. All rights reserved.
