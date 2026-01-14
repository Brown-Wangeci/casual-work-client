# Task Marketplace (casual-work-client)

A modern mobile app for posting, discovering, and completing local tasks and gigs. Built with Expo, React Native, and TypeScript.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)


---

## Overview

**Task Marketplace** is a platform that connects people who need tasks done (Posters) with those willing to complete them (Taskers). Users can post tasks, apply for tasks, assign and track progress, and rate each other upon completion. The app is designed for local, real-world services such as cleaning, delivery, tech help, and more.

## Features

- **User Authentication**: Register, log in, and manage your profile.
- **Task Posting**: Create new tasks with details, category, location, and offer.
- **Task Feed**: Browse available tasks and apply as a Tasker.
- **Task Management**: View tasks you posted, were assigned, or applied for.
- **Task Application & Assignment**: Apply for tasks, assign Taskers, and track status.
- **Progress Tracking**: Update and monitor task progress.
- **Ratings & Reviews**: Rate and review users after task completion.
- **Location Integration**: Use Google Maps for location picking and task display.
- **Responsive UI**: Mobile-first, clean, and modern design.

## User Roles
- **Poster**: Users who post tasks and select Taskers.
- **Tasker**: Users who apply for and complete tasks. (Users can be both!)

## Screenshots
<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/eef318d3-1104-40c7-a6de-c47863eeb5ab" width="250" /><br/>
      <sub>Splash Screen</sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/b885037f-9d6d-4a00-af5f-41ff98e60a9b" width="250" /><br/>
      <sub>Login Screen</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/3c9f713e-81d6-481e-9e74-850d8a5bcacb" width="250" /><br/>
      <sub>Create Account</sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6400e648-4a36-4e07-8a72-e5a01cfc0c3f" width="250" /><br/>
      <sub>Dashboard</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/d3cd74f1-a5c1-496f-b3c3-9aaece3cb1a8" width="250" /><br/>
      <sub>Create Task</sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/21c2df62-14d1-4e86-b1c0-983d8a373980" width="250" /><br/>
      <sub>Task Confirmation</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/1dc0b19e-fae4-40ed-8bd0-18509b859f7c" width="250" /><br/>
      <sub>Task Tracking</sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/a15fb291-0429-439a-bffb-6c79a7cdfe7f" width="250" /><br/>
      <sub>Task Feed</sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/c50abc36-606a-40a2-a40c-14a3a1c8ea2e" width="250" /><br/>
      <sub>Profile</sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/0df91030-4419-40c6-93ea-87a2c59f1d7f" width="250" /><br/>
      <sub>Tasker Selection</sub>
    </td>
  </tr>

  <tr>
    <td colspan="2" align="center">
      <img src="https://github.com/user-attachments/assets/12385255-4fde-44be-a40f-72e054c6a61a" width="250" /><br/>
      <sub>Ratings & Reviews</sub>
    </td>
  </tr>
</table>

## Tech Stack
- **Framework**: [Expo](https://expo.dev), [React Native](https://reactnative.dev), [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [expo-router](https://expo.github.io/router/)
- **State Management**: [zustand](https://github.com/pmndrs/zustand)
- **UI**: Custom components, [@expo/vector-icons](https://docs.expo.dev/versions/latest/sdk/vector-icons/)
- **APIs**: [axios](https://axios-http.com/), Google Maps/Places


## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Brown-Wangeci/casual-work-client
   cd casual-work-client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in required values (see [Environment Variables](#environment-variables)).

4. **Start the development server:**
   ```bash
   npx expo start
   ```
   - Use the QR code to open in Expo Go, or run on an emulator/simulator.

### Build
- **Android:**
  ```bash
  npm run android
  ```
- **iOS:**
  ```bash
  npm run ios
  ```
- **Web:**
  ```bash
  npm run web
  ```

### Reset Project
To reset to a blank state (removes all app data and code, keeps starter template):
```bash
npm run reset-project
```

## Environment Variables
The app uses environment variables for API keys and configuration. Set these in a `.env` file at the project root:

- `APP_ENV` (development | preview | production)
- `EXPO_PUBLIC_API_URL` (your backend API endpoint)
- `EXPO_PUBLIC_SERVICE_FEE` (service fee percentage or value)
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (Google Maps API key)
- `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` (Google Places API key)
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` (Google OAuth client ID for Android)
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (Google OAuth client ID for Web)


## Scripts
- `npm start` — Start Expo development server
- `npm run android` — Run app on Android device/emulator
- `npm run ios` — Run app on iOS simulator
- `npm run web` — Run app in web browser
- `npm run test` — Run tests with Jest
- `npm run lint` — Lint codebase
- `npm run reset-project` — Reset to blank starter

## Project Structure
```
app/                # App screens and routing
components/         # Reusable UI and screen components
constants/          # Static data, types, and config
hooks/              # Custom React hooks
lib/                # Utilities and helpers
stores/             # Zustand state stores
assets/             # Images, fonts, etc.
scripts/            # Project scripts (e.g., reset-project.js)
```

---

*This project is built with ❤️ using Expo and React Native.*
