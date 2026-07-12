# Media Downloader

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

Modern media downloader built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. The application provides a clean interface for downloading media through a backend API while applying caching, connection reuse, and request optimization for improved performance.

> This project acts as a frontend application with a server-side API that communicates with an underlying media extraction service.

---

# Features

- Modern responsive UI
- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Progressive Web App (PWA)
- API Route (`/api/download`)
- Axios HTTP client
- HTTP Keep-Alive
- Cache-Control support
- In-memory cache
- Concurrent request protection
- User-Agent rotation
- Error handling
- Ready for Vercel deployment

---

# Supported Platforms

The underlying media extraction service supports downloading content from many popular platforms, including:

- TikTok
- Douyin
- CapCut
- Threads
- Instagram
- Facebook
- ESPN
- Pinterest
- IMDb
- Imgur
- iFunny
- Izlesene
- Reddit
- YouTube
- Twitter / X
- Vimeo
- Snapchat
- Bilibili
- Dailymotion
- ShareChat
- Likee
- LinkedIn
- Tumblr
- Telegram
- Spotify
- SoundCloud

...and dozens of additional supported services provided by the backend extraction provider.

---

# Tech Stack

| Category | Technology |
|-----------|------------|
| Framework | Next.js 15 |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| HTTP | Axios |
| Runtime | Node.js |
| PWA | Manifest + Service Worker |
| Deployment | Vercel |

---

# Project Structure

```text
app/
components/
public/
lib/
api/
types/
```

---

# Performance

- Connection Keep-Alive
- Response caching
- Optimized API route
- Cache-Control headers
- Request optimization
- Stable error handling

---

# Installation

```bash
git clone <repository>
cd MEDIA-DOWNLOADER
npm install
npm run dev
```

---

# Environment

Create `.env.local`

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# Build

```bash
npm run build
npm start
```

---

# Deployment

The project is ready to deploy on Vercel without additional configuration.

---

# License

MIT
