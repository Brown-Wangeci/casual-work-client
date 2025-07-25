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
- [Contributing](#contributing)


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
*Add screenshots of the main screens here (Dashboard, Task Feed, Post Task, Profile, etc.)*

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


## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request


---

*This project is built with ❤️ using Expo and React Native.*
