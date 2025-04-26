# OZONE-REALM
**Multiplayer Tic Tac Toe – Reimagined**

Welcome to **OZONE-REALM**, a modern take on the classic Tic Tac Toe game. This project combines a sleek, animated frontend built with **Next.js** and a fast, lightweight backend written in **pure Rust** without any web framework.

---

## 📂 Project Structure

##### /ui → Frontend (Next.js, Tailwind CSS, Framer Motion, GSAP)
##### /backend → Backend (Rust, No web framework)
##### /README.md  → You are here 🚀

---

## 🌐 Frontend – `/ui`

### 🔧 Tech Stack
- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://gsap.com/)

### 💡 Features
- Landing page with animated UI
- Game modes:
  - 🧑‍🤝‍🧑 Player vs Player
- Animated buttons, modals, and page transitions
- Fully responsive and mobile-friendly
- Accessible, modular, and reusable UI components

### 🚀 Running the Frontend

```bash
cd ui
npm install
npm run dev
Then navigate to: http://localhost:3000
npm run build
```

## 🛠 Backend – /backend

### 🔧 Tech Stack
- Rust
- Pure Rust, no web framework
- WebSocket communication (for real-time multiplayer)
### 💡 Features
- Lightweight and ultra-fast
- Manages real-time multiplayer sessions
- Handles player matchmaking and game state synchronization

```bash
cd backend
cargo build --release
cargo run
```