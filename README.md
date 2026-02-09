# 🚀 CryptoWallet — Crypto Portfolio Tracker

**CryptoWallet** is a modern, high-performance web application designed to track and manage cryptocurrency assets. Built with a focus on seamless UX, security, and scalable architecture.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?logo=redux)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)

---

## ✨ Features

- **Dashboard Overview:** Visual summary of your crypto holdings and total balance.
- **Dynamic Asset Roadmap:** An interactive, draggable roadmap of technical goals built with `Framer Motion` and `react-xarrows`.
- **Global State Management:** Centralized user and UI data handling using `Redux Toolkit`.
- **User Profile System:** Customizable profile with local image upload (Base64) and persistence via `LocalStorage`.
- **Advanced UI/UX:**
    - Glassmorphism design principles.
    - Smooth Parallax and Reveal scroll effects.
    - Interactive Sidebar with active route highlighting.
- **Custom Notification System:** A Redux-based Toast notification system with smooth `Framer Motion` animations.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite)
- **Language:** TypeScript (Strict mode)
- **State Management:** Redux Toolkit (Slices, Typed Hooks)
- **Styling:** Tailwind CSS (v4)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM v6

---

## 🏗 Architecture & Patterns

The project follows a clean architectural approach:
- **Feature-based Folder Structure:** Organized by components, layout, and logic slices.
- **Custom Hooks:** Typed wrappers for Redux (`useAppDispatch`, `useAppSelector`).
- **Persistence Layer:** Syncing Redux state with `Web Storage API` for data retention.
- **Component Composition:** Reusable UI components (Cards, Buttons, Inputs).

---

## 🔒 Security Audit

This project has undergone a professional **Security Penetration Test** based on the **OWASP WSTG** standard.
- **Vulnerabilities Found:** 0
- **Security Level:** High
- **Key focus:** Clean dependency management, zero-trust input handling, and secure data persistence.

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kholod13/cryptoWallet.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run development server:**
    ```bash
   npm run dev
    ```
   
---

## 👨‍💻 Author
**Vladyslav Kholod**

- **LinkedIn:** https://www.linkedin.com/in/vladyslav-kholod-86647120a/
- **GitHub:** https://github.com/Kholod13/cryptoWallet
- **Telegram:** @kah13x
- **Host:** not released
