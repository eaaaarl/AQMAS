# AQMAS - Active Queue Management System

[![React Native](https://img.shields.io/badge/React%20Native-0.79.4-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

> Internal queue management solution for company operations

**Maintained by:** Earl Dominic V. Ado

## Project Overview

AQMAS consists of two specialized mobile applications:

- **mobile-counter** - Staff interface for queue management operations
- **mobile-queue** - Customer-facing kiosk for self-service ticket generation

## Release Information

### Latest Release

- **Version:** 1.0.2
- **Release Date:** 7/17/2025
- **Build Numbers:**
  - mobile-counter: 1.0.2
  - mobile-queue: 1.0.0

### Release Notes

#### New Features

- Initial release of mobile-queue kiosk application
- Initial release of mobile-counter staff interface
- Bluetooth receipt printing integration
- Real-time queue synchronization
- Staff authentication system

#### Bug Fixes

- N/A (Initial Release)

#### Known Issues

- Bluetooth connectivity may require manual reconnection on some Android devices
- Legacy API integration requires HTTP cleartext traffic to be enabled

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Development Setup

```bash
# Customer Kiosk App
cd mobile-queue
npm install
npm start

# Staff Counter App
cd mobile-counter
npm install
npm start
```

## Deployment

### Build Commands

```bash
# Build Android APK
eas build -p android --profile preview

# Build iOS IPA
eas build -p ios --profile preview

# Production Builds
eas build -p android --profile production
eas build -p ios --profile production
```

### Installation Instructions

1. Download the appropriate APK/IPA file for your device
2. Follow the standard installation procedures for your platform
3. Configure the application settings as per deployment documentation

## Configuration

Both applications require proper configuration before deployment:

- Backend API endpoints
- Authentication credentials
- Device-specific settings
- Bluetooth printer settings (mobile-queue only)

## Technical Support

For technical issues or deployment assistance, contact:

- **Internal Support:** [SUPPORT_EMAIL]
- **Documentation:** [LINK_TO_INTERNAL_DOCS]

## Project Structure

```
AQMAS/
├── mobile-counter/    # Staff counter application
├── mobile-queue/      # Customer kiosk application
└── README.md          # Project documentation
```

## Technology Stack

- **React Native** 0.79.4
- **Expo** 53.0
- **TypeScript** 5.8
- **Redux Toolkit** 2.8+
- **NativeWind** 4.1+
- **Expo Router** for navigation
- **React Native Bluetooth Classic** (mobile-queue only)
