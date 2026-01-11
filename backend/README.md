# 🎯 AudienceSnap

AudienceSnap is a simple analytics tool built for small creators to track which links their audience actually clicks. It’s designed for creators who want to understand audience behavior from one shared link — like the one in their Instagram bio.

---

## 📦 What Problem This Solves

Creators often share multiple links (YouTube, products, forms, etc.) but have no real way of knowing *which ones their audience is clicking*. AudienceSnap solves this by tracking link clicks and giving creators simple performance data.

---

## 👥 Who It’s For

AudienceSnap is ideal for:
- Small creators on Instagram
- Micro-influencers
- Content makers with multiple online pages
- Anyone who wants simple engagement data from shared links

---

## 🚀 Core Features

- **One bio link page** — A single link creators can add to their Instagram or other social bios.
- **Add and manage links** — Creators can add any URL, add a title, and reorder or disable links.
- **Click tracking** — Every click on a link is recorded automatically.
- **Simple analytics** — Shows total clicks, today’s clicks, and which link is most clicked.
- **Mobile-friendly** — Designed to work well on phones (where most audiences click).

---

## 🔁 User Flow

1. Creator signs up with email.
2. Creator adds links they want to share.
3. System generates a public page link.
4. Creator places this link in their bio.
5. Followers click links on the page.
6. Clicks are tracked and shown in analytics.

---

## 🚫 What’s Not Included

- Content hosting (videos, images, or posts)
- Advanced analytics (heatmaps, demographic data, etc.)
- Monetization (payments, subscriptions, affiliate tracking)
- Social media API integrations
- Custom themes or page designs
- Team/multi-user accounts

---

## 🛠 Tech Stack

This project uses:
- **Node.js + Express** (backend)
- **PostgreSQL** (database)
- **React** (frontend)
- **Render / Railway / Fly.io** (hosting when deployed)

---

## 💻 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Vamp-harshit/AudienceSnap.git
2. Install dependencies:
   ```bash
   npm install
3. Add environment variables (e.g., database URL, JWT secret).
   
4. Start server and frontend:
   ```bash
   npm run dev
