# 🚀 SyncSpace — Fullstack Crypto Portfolio Organizer

**SyncSpace** is a comprehensive, high-performance ecosystem designed to consolidate fragmented crypto-assets into a single, interactive dashboard. Unlike simple trackers, SyncSpace offers a full-stack solution with real-time data synchronization across multiple blockchains and exchange accounts.

**Live Demo:** [https://syncspace-five.vercel.app/](https://syncspace-five.vercel.app/)

---

## ✨ Features

### 📊 Advanced Dashboard
- **Real-time Tracking:** Consolidate balances from multiple wallets and exchanges.
- **Data Visualization:** Interactive financial charts powered by **Recharts** for deep portfolio analysis.
- **Dynamic Asset Roadmap:** A draggable, interactive technical roadmap built with **Framer Motion** and **react-xarrows**.

### ⚙️ Fullstack Capabilities
- **Custom Backend:** Built from scratch to handle complex data aggregation and user management.
- **Blockchain Integration:** Seamless data fetching from **Moralis**, **Etherscan**, and **CoinGecko APIs**.
- **Global Ready:** Full multi-language support (English, Czech, Ukrainian) using **i18next**.

### 🎨 Premium UI/UX
- **Modern Aesthetics:** Built on **Glassmorphism** design principles.
- **Fluid Motion:** Smooth Parallax and Reveal scroll effects for a tactile feel.
- **Redux-based Notifications:** A custom Toast notification system with Framer Motion animations.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Language:** TypeScript (Strict mode)
- **State Management:** Redux Toolkit (Typed Hooks & Slices)
- **Styling:** Tailwind CSS (v4)
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Localization:** i18next (i18n)

### DevOps & Tools
- **Containerization:** Docker (for consistent dev/prod environments)
- **Version Control:** Git (Git Flow)
- **API Handling:** Axios with interceptors

---

## 🏗 Architecture
The project implements a clean, modular architecture:
- **Feature-based structure:** Decoupled logic for components, layouts, and state slices.
- **Type Safety:** End-to-end typing from database schemas (Prisma) to UI props.
- **Containerization:** The entire environment is containerized with Docker, ensuring "it works on my machine" reliability.

---

## 🔒 Security Audit (OWASP)
This project is currently undergoing a rigorous professional Security Penetration Test based on the **OWASP WSTG** standard.

> [!IMPORTANT]
> **Audit Status:** 🟡 IN PROGRESS  
> **Target Standards:** Clean dependency management, zero-trust input handling, and secure data persistence.  
> *Full results and vulnerability report will be published here upon completion.*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kholod13/cryptoWallet.git
   cd cryptoWallet
   
2. **Setup environment**
- Create ```.env``` file in the root and add your database and API keys.

3. **Run with Docker**
    ```bash
   docker-compose up --build
- The app will be availiable at ```http://localhost:5173```

## 👨‍💻 Author
**Vladyslav Kholod**
- LinkedIn: https://www.linkedin.com/in/vladyslav-kholod-86647120a/
- GitHub: https://github.com/Kholod13/cryptoWallet
- Telegram: @kah13x