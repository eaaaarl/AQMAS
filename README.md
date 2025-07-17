# AQMAS (Active Queueing Management System) 🚀

> **Modern Mobile Queue Management System** - Transforming legacy systems with cutting-edge mobile applications

[![React Native](https://img.shields.io/badge/React%20Native-0.794DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.19020tyle=for-the-badge&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-50.8378C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20olkit-20.824BC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Project Background](#project-background)
- [My Role & Achievements](#my-role--achievements)
- [Key Features](#key-features)
- [Mobile Applications](#mobile-applications)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Usage Instructions](#usage-instructions)
- [Architecture & Integration](#architecture--integration)
- [Challenges Overcome](#challenges-overcome)
- [Technical Achievements](#technical-achievements)
- [Screenshots](#screenshots)
- [Portfolio Project](#portfolio-project)
- [Contact](#contact)
- [License](#license)
- [Downloads](#downloads)

## 🎯 Overview

AQMAS (Active Queueing Management System) is a comprehensive queue management solution designed to modernize business operations through intuitive mobile interfaces. This project demonstrates the successful transformation of legacy systems into modern, user-friendly mobile applications that enhance customer experience and operational efficiency.

The system consists of two specialized mobile applications:
- **Customer Kiosk Interface** - Self-service ticket generation and queue management
- **Staff Counter Interface** - Real-time queue management and customer service operations

## 🏢 Project Background

### Legacy System Context
The company operated with an existing legacy system comprising:
- **VB6 Admin Interface** - Outdated desktop application for system administration
- **Angular Web Version** - Web-based queue management interface

### Modernization Initiative
Recognizing the need for improved user experience and operational efficiency, the project aimed to:
- Replace outdated interfaces with modern mobile applications
- Enhance customer self-service capabilities
- Streamline staff operations through intuitive mobile interfaces
- Maintain seamless integration with existing backend infrastructure

## 👨‍💻 My Role & Achievements

### Primary Responsibilities
- **Mobile Developer** - Led the complete development of both mobile applications from scratch
- **System Integration Specialist** - Successfully integrated mobile apps with existing legacy backend
- **UI/UX Designer** - Designed intuitive interfaces for both customer and staff workflows

### Key Achievements
✅ **Built from Scratch** - Developed two complete mobile applications without existing mobile codebase  
✅ **Legacy System Integration** - Successfully connected modern mobile apps to existing VB6/Angular backend  
✅ **Cross-Platform Development** - Created applications for both Android and iOS platforms  
✅ **Real-time Operations** - Implemented live queue management and customer service features  
✅ **Modern Architecture** - Utilized React Native, TypeScript, and modern development practices  

## ✨ Key Features

### Customer Kiosk Interface (`mobile-queue/`)
- 🎫 **Self-Service Ticket Generation** - Customers can generate queue tickets independently
- 📱 **Touch-Friendly Interface** - Optimized for kiosk displays and customer interaction
- 🔄 **Real-time Queue Updates** - Live display of current queue status and estimated wait times
- 🎨 **Customer Survey Integration** - Built-in feedback collection system
- 📊 **Service Selection** - Multiple service type options with visual categorization
- 🖨️ **Bluetooth Receipt Printing** - Direct integration with receipt printers

### Staff Counter Interface (`mobile-counter/`)
- 👥 **Queue Management** - Real-time control of customer queue flow
- 📋 **Customer Service Operations** - Call next customer, mark as served, skip tickets
- 📊 **Queue Analytics** - Track service times, skipped tickets, and operational metrics
- ⚙️ **Configuration Management** - Device settings, queue parameters, and system preferences
- 🔐 **Authentication System** - Secure staff login and role-based access control
- 📱 **Responsive Design** - Optimized for various screen sizes and orientations

## 📱 Mobile Applications

### Application Structure
```
AQMAS/
├── mobile-queue/          # Customer-facing kiosk application
│   ├── app/              # Main application screens
│   ├── features/         # Feature modules (queue, survey, service)
│   └── components/       # Reusable UI components
└── mobile-counter/       # Staff/admin counter application
    ├── app/              # Main application screens
    ├── features/         # Feature modules (counter, auth, settings)
    └── components/       # Reusable UI components
```

### Application Details

| Application | Purpose | Target Users | Key Features |
|-------------|---------|--------------|--------------|
| **Queue App** | Customer self-service kiosk | Customers | Ticket generation, service selection, survey |
| **Counter App** | Staff queue management | Staff/Admin | Queue control, customer service, analytics |

## 🛠️ Technology Stack

### Core Technologies
- **React Native** `0.79.4` - Cross-platform mobile development framework
- **Expo** `53.00.19velopment platform and build tools
- **TypeScript** `5.8pe-safe JavaScript development
- **Redux Toolkit** `2.8.2` - State management
- **NativeWind** `4.123- Tailwind CSS for React Native

### Key Libraries & Tools
- **Expo Router** - File-based navigation system
- **React Navigation** - Navigation library for mobile apps
- **AsyncStorage** - Local data persistence
- **React Native Reanimated** - Smooth animations
- **Expo Haptics** - Tactile feedback
- **React Native Bluetooth Classic** - Bluetooth printer integration

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **Expo Dev Client** - Development and testing tools

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18r higher)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Customer Kiosk App Setup
```bash
# Navigate to kiosk application
cd mobile-queue

# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Staff Counter App Setup
```bash
# Navigate to counter application
cd mobile-counter

# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Environment Configuration
Both applications require configuration for:
- Backend API endpoints
- Bluetooth printer settings (kiosk app)
- Authentication credentials
- Device-specific settings

## 📖 Usage Instructions

### Customer Kiosk Interface
1. **Service Selection** - Choose from available service categories
2. **Ticket Generation** - Generate queue ticket with unique number
3. **Queue Monitoring** - View current queue status and wait times
4. **Receipt Printing** - Print physical ticket (if printer connected)
5. **Survey Participation** - Complete customer feedback survey

### Staff Counter Interface
1. **Authentication** - Login with staff credentials
2. **Queue Management** - View and manage customer queue
3. **Customer Service** - Call next customer, mark as served
4lytics** - Monitor service metrics and performance5ings** - Configure device and queue parameters

## 🏗️ Architecture & Integration

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Legacy VB6    │    │   Angular Web   │    │   Mobile Apps   │
│   Admin System  │◄──►│   Interface     │◄──►│   (React Native)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Shared API    │
                    │   Backend       │
                    └─────────────────┘
```

### Integration Strategy
- **API Compatibility** - Mobile apps communicate with existing backend APIs
- **Data Synchronization** - Real-time updates between legacy and mobile systems
- **Authentication Bridge** - Shared authentication system across platforms
- **Database Integration** - Direct access to existing database schema

## 🎯 Challenges Overcome

### Technical Challenges
🔧 **Legacy System Integration** - Successfully integrated modern mobile apps with outdated VB6 backend  
🔧 **Cross-Platform Compatibility** - Ensured consistent functionality across Android and iOS  
🔧 **Real-time Synchronization** - Implemented live data updates between mobile and legacy systems  
🔧 **Bluetooth Integration** - Developed custom Bluetooth printer communication for receipt printing  
🔧 **State Management** - Designed robust state management for complex queue operations  

### Business Challenges
📊 **User Experience Modernization** - Transformed outdated interfaces into intuitive mobile experiences  
📊 **Operational Efficiency** - Streamlined customer service workflows and reduced wait times  
📊 **System Reliability** - Maintained system stability while adding new mobile capabilities  
📊 **Training Requirements** - Minimized staff training needs through intuitive interface design  

## 🏆 Technical Achievements

### Mobile Development Excellence
- **Cross-Platform Development** - Single codebase for Android and iOS
- **Modern Architecture** - Component-based, modular application structure
- **Type Safety** - Full TypeScript implementation for robust development
- **Performance Optimization** - Efficient rendering and state management
- **Offline Capabilities** - Graceful handling of network connectivity issues

### System Integration Skills
- **API Design & Integration** - Seamless communication with legacy backend
- **Database Connectivity** - Direct integration with existing database systems
- **Authentication Systems** - Secure user authentication and authorization
- **Real-time Communication** - Live data synchronization across platforms

### Development Best Practices
- **Code Quality** - ESLint, Prettier, and TypeScript for code standards
- **Version Control** - Git-based development workflow
- **Testing Strategy** - Comprehensive testing approach for mobile applications
- **Documentation** - Complete code documentation and setup instructions

## 📸 Screenshots

> *Screenshots will be added here to showcase the mobile application interfaces*

### Customer Kiosk Interface
- Service selection screen
- Ticket generation interface
- Queue status display
- Survey completion form

### Staff Counter Interface
- Login authentication screen
- Queue management dashboard
- Customer service controls
- Analytics and settings panels

## 💼 Portfolio Project

This project was developed during my **On-the-Job Training (OJT)** period and serves as a comprehensive portfolio piece demonstrating:

### Skills Demonstrated
- **Mobile Development** - Complete React Native application development from scratch
- **Legacy System Modernization** - Successfully modernizing outdated business systems
- **System Integration** - Integrating new technologies with existing infrastructure
- **User Experience Design** - Creating intuitive interfaces for diverse user groups
- **Project Management** - End-to-end development of complex business applications

### Professional Impact
- **Business Value** - Transformed customer experience and operational efficiency
- **Technical Innovation** - Introduced modern mobile technology to legacy environment
- **Scalability** - Designed applications for future growth and feature expansion
- **Maintainability** - Clean, well-documented codebase for long-term maintenance

## 📞 Contact

**Developer:** Earl Dominic V. Ado  
**Email:** dev.earl00@gmail.com   
**GitHub:** github.com/eaaaarl  

**Project Repository:** https://github.com/eaaaarl/AQMAS  
**Portfolio:** https://eaaaarl.vercel.app  

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📥 Downloads

> *Release links and download instructions will be added here*

### Latest Releases
- **Customer Kiosk App** - [Download APK] / [Download IPA]
- **Staff Counter App** - [Download APK] / [Download IPA]

### Installation Guides
- [Android Installation Guide]
- [iOS Installation Guide]
- [Development Setup Guide]

---

**⭐ Star this repository if you find it helpful!**

**🔗 Connect with me for collaboration opportunities or questions about this project.** 
