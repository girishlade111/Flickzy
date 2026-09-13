# 🎬 Flickzy — Premium Movie & Trailer Discovery Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/girishlade111/Flickzy?style=social)](https://github.com/girishlade111/Flickzy)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript%20ES6%2B-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vite](https://img.shields.io/badge/Tool-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**Flickzy** is a modern, high-performance web application engineered for movie enthusiasts to discover trending cinema, watch high-definition official trailers, search by cast or genre, and curate a persistent personalized watchlist.

Built with a focus on visual excellence, glassmorphism design, fluid animations, and zero heavy framework overhead, **Flickzy** provides a buttery-smooth desktop and mobile user experience.

---

## ✨ Features

- 🌟 **Spotlight Hero Section**: Dynamic featured banner displaying top-rated movies with backdrop imagery, meta ratings, cast details, and instant trailer playback.
- 🔍 **Real-Time Search**: Instant fuzzy filtering across titles, genres, and cast members.
- 🏷️ **Genre Filtering**: Filter catalog by Action, Sci-Fi, Drama, Thriller, Animation, and Comedy with tabbed pill navigation.
- ↕️ **Smart Sorting**: Sort catalog by Popularity, Rating, Release Year, or Alphabetical title order.
- 🍿 **Embedded Trailer Modal**: Modal overlay playing YouTube HD trailers seamlessly.
- 🔖 **Persistent Watchlist**: Add or remove movies to your watchlist, stored locally in `localStorage` with slide-out drawer management.
- 🔔 **Toast Notifications**: Interactive feedback toasts for watchlist actions.
- 🎨 **Glassmorphism Dark Aesthetics**: Premium dark palette (`#0B0E14`), glowing ambient lights, micro-interactions, backdrop blurs, and responsive layout grids.

---

## 🛠️ Tech Stack

- **Markup**: HTML5 (Semantic elements, Open Graph & SEO tags)
- **Styling**: Modern Vanilla CSS3 (Custom properties, Glassmorphism, CSS Grid, Flexbox, Animations)
- **Scripting**: Vanilla JavaScript (ES6 Modules, DOM API, `localStorage`)
- **Icons & Fonts**: FontAwesome 6, Google Fonts (*Outfit* & *Plus Jakarta Sans*)
- **Build Tool**: Vite (Lightning-fast local development server)

---

## 📁 Directory Structure

```
Flickzy/
├── index.html          # Main HTML5 entry point & modal/drawer layouts
├── styles.css          # Core CSS design system, glassmorphism & responsive styles
├── app.js              # Application logic, movie dataset, search & state management
├── package.json        # Node.js project manifest & scripts
├── .gitignore          # Excluded files (node_modules, builds, environment logs)
└── README.md           # Detailed project documentation
```

---

## 🚀 Quick Start & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### 1. Clone the Repository
```bash
git clone https://github.com/girishlade111/Flickzy.git
cd Flickzy
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🛠️ GitHub CLI Setup & Deployment

This repository was created and configured using GitHub CLI (`gh`):

```bash
# Initialize local Git repository
git init
git add .
git commit -m "feat: initial commit of Flickzy movie discovery app"

# Create public GitHub repository and push code
gh repo create Flickzy --public --source=. --remote=origin --push
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

Made with ❤️ by [Girish Lade](https://github.com/girishlade111).
