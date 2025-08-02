# Mobile Counter Application - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Feature Architecture](#feature-architecture)
6. [Data Flow](#data-flow)
7. [State Management](#state-management)
8. [Navigation Flow](#navigation-flow)
9. [Development Workflow](#development-workflow)
10. [Deployment](#deployment)

## Project Overview

The Mobile Counter Application is a React Native/Expo-based mobile application designed for managing customer service counters and ticket systems. The application provides a modern, cross-platform solution for counter management with features including authentication, ticket management, settings, and developer tools.

### Key Features

- **Counter Management**: Real-time ticket processing and customer service management
- **Authentication System**: Secure user authentication and authorization
- **Settings Management**: User preferences and application configuration
- **Developer Tools**: Debugging and development utilities
- **Cross-Platform**: iOS, Android, and Web support via Expo

## Architecture Overview

```mermaid
graph TB
    subgraph "Mobile App"
        UI[UI Layer]
        BL[Business Logic]
        SM[State Management]
        API[API Layer]
    end
    
    subgraph "External Services"
        AS[Async Storage]
        EX[Expo Services]
        WB[Web Browser]
    end
    
    UI --> BL
    BL --> SM
    BL --> API
    API --> AS
    API --> EX
    API --> WB
    
    style UI fill:#e1f5fe
    style BL fill:#f3e5f5
    style SM fill:#e8f5e8
    style API fill:#fff3e0
```

## Technology Stack

### Core Technologies

```mermaid
graph LR
    subgraph "Frontend"
        RN[React Native]
        EX[Expo]
        TS[TypeScript]
        TW[TailwindCSS]
    end
    
    subgraph "State Management"
        RTK[Redux Toolkit]
        RP[Redux Persist]
        RR[React Redux]
    end
    
    subgraph "Navigation"
        ER[Expo Router]
        RNB[React Navigation]
        RNT[React Native Tab View]
    end
    
    subgraph "UI/UX"
        RNG[React Native Gesture Handler]
        RNR[React Native Reanimated]
        RNTM[React Native Toast Message]
    end
    
    RN --> EX
    EX --> TS
    TS --> TW
    RN --> RTK
    RTK --> RP
    RP --> RR
    RN --> ER
    ER --> RNB
    RNB --> RNT
    RN --> RNG
    RNG --> RNR
    RNR --> RNTM
```

### Development Tools

- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **TypeScript**: Type safety and development experience
- **Metro**: React Native bundler
- **Babel**: JavaScript compiler

## Project Structure

```mermaid
graph TD
    A[mobile-counter] --> B[app/]
    A --> C[features/]
    A --> D[assets/]
    A --> E[libs/]
    A --> F[android/]
    A --> G[Configuration Files]
    
    B --> B1[_layout.tsx]
    B --> B2[auth/]
    B --> B3[(tabs)/]
    B --> B4[(developer)/]
    
    C --> C1[auth/]
    C --> C2[counter/]
    C --> C3[customer/]
    C --> C4[developer/]
    C --> C5[error/]
    C --> C6[navigation/]
    C --> C7[queue/]
    C --> C8[settings/]
    C --> C9[config/]
    
    G --> G1[package.json]
    G --> G2[app.config.ts]
    G --> G3[tsconfig.json]
    G --> G4[tailwind.config.js]
    G --> G5[metro.config.js]
    G --> G6[babel.config.js]
    G --> G7[eslint.config.js]
    G --> G8[.prettierrc]
```

## Feature Architecture

### Feature-Based Organization

Each feature follows a consistent structure for maintainability and scalability:

```mermaid
graph LR
    subgraph "Feature Structure"
        COMP[components/]
        HOOKS[hooks/]
        TYPES[types/]
        API[api/]
        UTILS[utils/]
        INDEX[index.ts]
    end
    
    COMP --> INDEX
    HOOKS --> INDEX
    TYPES --> INDEX
    API --> INDEX
    UTILS --> INDEX
    
    style COMP fill:#e3f2fd
    style HOOKS fill:#f3e5f5
    style TYPES fill:#e8f5e8
    style API fill:#fff3e0
    style UTILS fill:#fce4ec
    style INDEX fill:#f1f8e9
```

### Feature Dependencies

```mermaid
graph TD
    subgraph "Core Features"
        AUTH[auth]
        COUNTER[counter]
        SETTINGS[settings]
        NAV[navigation]
    end
    
    subgraph "Supporting Features"
        CONFIG[config]
        ERROR[error]
        DEV[developer]
        CUST[customer]
        QUEUE[queue]
    end
    
    AUTH --> COUNTER
    AUTH --> SETTINGS
    NAV --> COUNTER
    NAV --> SETTINGS
    CONFIG --> AUTH
    CONFIG --> COUNTER
    ERROR --> AUTH
    ERROR --> COUNTER
    DEV --> COUNTER
    CUST --> COUNTER
    QUEUE --> COUNTER
    
    style AUTH fill:#ffebee
    style COUNTER fill:#e8f5e8
    style SETTINGS fill:#e3f2fd
    style NAV fill:#fff3e0
```

## Data Flow

### Application State Flow

```mermaid
graph TD
    subgraph "User Actions"
        UA1[User Login]
        UA2[Counter Operations]
        UA3[Settings Changes]
        UA4[Navigation]
    end
    
    subgraph "State Management"
        SM1[Redux Store]
        SM2[Redux Persist]
        SM3[Async Storage]
    end
    
    subgraph "UI Updates"
        UI1[Component Re-render]
        UI2[Toast Messages]
        UI3[Navigation Updates]
    end
    
    UA1 --> SM1
    UA2 --> SM1
    UA3 --> SM1
    UA4 --> SM1
    
    SM1 --> SM2
    SM2 --> SM3
    
    SM1 --> UI1
    SM1 --> UI2
    SM1 --> UI3
    
    style SM1 fill:#e8f5e8
    style SM2 fill:#fff3e0
    style SM3 fill:#f3e5f5
```

### API Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant H as Hook
    participant A as API
    participant S as Store
    participant AS as AsyncStorage
    
    U->>C: User Action
    C->>H: Call Hook
    H->>A: API Request
    A-->>H: Response
    H->>S: Update Store
    S->>AS: Persist Data
    S-->>C: State Update
    C-->>U: UI Update
```

## State Management

### Redux Store Structure

```mermaid
graph TD
    subgraph "Redux Store"
        ROOT[Root State]
        
        subgraph "Slices"
            AUTH_SLICE[authSlice]
            COUNTER_SLICE[counterSlice]
            SETTINGS_SLICE[settingsSlice]
            CONFIG_SLICE[configSlice]
        end
        
        subgraph "Middleware"
            PERSIST[Redux Persist]
            LOGGER[Logger]
        end
    end
    
    ROOT --> AUTH_SLICE
    ROOT --> COUNTER_SLICE
    ROOT --> SETTINGS_SLICE
    ROOT --> CONFIG_SLICE
    
    AUTH_SLICE --> PERSIST
    COUNTER_SLICE --> PERSIST
    SETTINGS_SLICE --> PERSIST
    CONFIG_SLICE --> PERSIST
    
    style ROOT fill:#e8f5e8
    style AUTH_SLICE fill:#ffebee
    style COUNTER_SLICE fill:#e3f2fd
    style SETTINGS_SLICE fill:#fff3e0
    style CONFIG_SLICE fill:#f3e5f5
```

### State Persistence Flow

```mermaid
graph LR
    subgraph "Persistence Layer"
        RP[Redux Persist]
        AS[Async Storage]
        ENC[Encryption]
    end
    
    subgraph "Data Flow"
        STORE[Redux Store]
        PERSIST[Persist Config]
        RESTORE[Restore Data]
    end
    
    STORE --> RP
    RP --> PERSIST
    PERSIST --> AS
    AS --> ENC
    
    RESTORE --> AS
    AS --> RP
    RP --> STORE
    
    style RP fill:#e8f5e8
    style AS fill:#fff3e0
    style ENC fill:#f3e5f5
```

## Navigation Flow

### App Navigation Structure

```mermaid
graph TD
    subgraph "App Router"
        ROOT[_layout.tsx]
        
        subgraph "Main Routes"
            AUTH[auth/]
            TABS[(tabs)/]
            DEV[(developer)/]
        end
        
        subgraph "Tab Routes"
            HOME[index.tsx]
            SETTINGS[setting.tsx]
        end
        
        subgraph "Auth Routes"
            LOGIN[login.tsx]
            REGISTER[register.tsx]
        end
        
        subgraph "Developer Routes"
            DEV_TOOLS[dev-tools.tsx]
            DEBUG[debug.tsx]
        end
    end
    
    ROOT --> AUTH
    ROOT --> TABS
    ROOT --> DEV
    
    TABS --> HOME
    TABS --> SETTINGS
    
    AUTH --> LOGIN
    AUTH --> REGISTER
    
    DEV --> DEV_TOOLS
    DEV --> DEBUG
    
    style ROOT fill:#e8f5e8
    style AUTH fill:#ffebee
    style TABS fill:#e3f2fd
    style DEV fill:#fff3e0
```

### Navigation State Management

```mermaid
stateDiagram-v2
    [*] --> Splash
    Splash --> Auth
    Splash --> Main
    
    Auth --> Login
    Auth --> Register
    Login --> Main
    Register --> Main
    
    Main --> Counter
    Main --> Settings
    Main --> Developer
    
    Counter --> Settings
    Settings --> Counter
    Developer --> Counter
    
    Counter --> [*]
    Settings --> [*]
    Developer --> [*]
```

## Development Workflow

### Development Environment Setup

```mermaid
graph TD
    subgraph "Development Setup"
        NODE[Node.js]
        NPM[npm install]
        EXPO[Expo CLI]
        DEV[Development Build]
    end
    
    subgraph "Development Commands"
        START[npm start]
        ANDROID[npm run android]
        IOS[npm run ios]
        WEB[npm run web]
        LINT[npm run lint]
        FORMAT[npm run format]
    end
    
    NODE --> NPM
    NPM --> EXPO
    EXPO --> DEV
    
    DEV --> START
    START --> ANDROID
    START --> IOS
    START --> WEB
    
    DEV --> LINT
    DEV --> FORMAT
    
    style NODE fill:#e8f5e8
    style EXPO fill:#fff3e0
    style DEV fill:#f3e5f5
```

### Code Quality Pipeline

```mermaid
graph LR
    subgraph "Code Quality"
        ESLINT[ESLint]
        PRETTIER[Prettier]
        TS[TypeScript]
        FORMAT[Format Check]
    end
    
    subgraph "Development"
        EDIT[Code Editor]
        SAVE[Save File]
        CHECK[Quality Check]
        FIX[Auto Fix]
    end
    
    EDIT --> SAVE
    SAVE --> ESLINT
    SAVE --> PRETTIER
    SAVE --> TS
    
    ESLINT --> CHECK
    PRETTIER --> CHECK
    TS --> CHECK
    
    CHECK --> FIX
    FIX --> EDIT
    
    style ESLINT fill:#ffebee
    style PRETTIER fill:#e3f2fd
    style TS fill:#e8f5e8
```

## Deployment

### Build and Deployment Process

```mermaid
graph TD
    subgraph "Build Process"
        SOURCE[Source Code]
        BUILD[EAS Build]
        CONFIG[app.config.ts]
        ASSETS[Assets]
    end
    
    subgraph "Platforms"
        ANDROID[Android APK/AAB]
        IOS[iOS IPA]
        WEB[Web Build]
    end
    
    subgraph "Distribution"
        STORE[App Stores]
        INTERNAL[Internal Testing]
        OTA[Over-the-Air Updates]
    end
    
    SOURCE --> BUILD
    CONFIG --> BUILD
    ASSETS --> BUILD
    
    BUILD --> ANDROID
    BUILD --> IOS
    BUILD --> WEB
    
    ANDROID --> STORE
    IOS --> STORE
    WEB --> STORE
    
    ANDROID --> INTERNAL
    IOS --> INTERNAL
    
    ANDROID --> OTA
    IOS --> OTA
    
    style BUILD fill:#e8f5e8
    style ANDROID fill:#e3f2fd
    style IOS fill:#fff3e0
    style STORE fill:#f3e5f5
```

### Configuration Management

```mermaid
graph TD
    subgraph "Configuration Files"
        APP_CONFIG[app.config.ts]
        PACKAGE[package.json]
        TS_CONFIG[tsconfig.json]
        TAILWIND[tailwind.config.js]
        METRO[metro.config.js]
        BABEL[babel.config.js]
        ESLINT[eslint.config.js]
        PRETTIER[.prettierrc]
    end
    
    subgraph "Environment"
        DEV[Development]
        STAGING[Staging]
        PROD[Production]
    end
    
    subgraph "Build Properties"
        EAS[eas.json]
        EXPO[expo-env.d.ts]
        NATIVEWIND[nativewind-env.d.ts]
    end
    
    APP_CONFIG --> DEV
    APP_CONFIG --> STAGING
    APP_CONFIG --> PROD
    
    PACKAGE --> DEV
    TS_CONFIG --> DEV
    TAILWIND --> DEV
    METRO --> DEV
    BABEL --> DEV
    ESLINT --> DEV
    PRETTIER --> DEV
    
    EAS --> DEV
    EXPO --> DEV
    NATIVEWIND --> DEV
    
    style APP_CONFIG fill:#e8f5e8
    style PACKAGE fill:#fff3e0
    style EAS fill:#f3e5f5
```

## Key Features Documentation

### Counter Feature

The counter feature is the core functionality of the application, providing ticket management and customer service operations.

**Components:**
- `CounterScreen`: Main counter interface
- `TicketDisplay`: Ticket information display
- `CounterControls`: Counter operation controls

**Hooks:**
- `useCounter`: Counter state management
- `useTicket`: Ticket operations

**Types:**
- `Ticket`: Ticket data structure
- `CounterState`: Counter application state

### Authentication Feature

Handles user authentication, authorization, and session management.

**Components:**
- `LoginScreen`: User login interface
- `RegisterScreen`: User registration interface
- `AuthProvider`: Authentication context provider

**API:**
- `authApi`: Authentication API calls
- `employeeApi`: Employee management

**Types:**
- `User`: User data structure
- `AuthState`: Authentication state

### Settings Feature

Manages user preferences and application configuration.

**Components:**
- `SettingsScreen`: Settings interface
- `SettingRow`: Individual setting row
- `InfoRow`: Information display row

**Hooks:**
- `useSettings`: Settings state management

**Types:**
- `SettingsState`: Settings application state
- `SettingRowProps`: Setting row properties

## Best Practices

### Code Organization

1. **Feature-Based Architecture**: Organize code by features rather than technical concerns
2. **TypeScript First**: Use TypeScript for all new code
3. **Custom Hooks**: Extract business logic into custom hooks
4. **Component Composition**: Use composition over inheritance
5. **Consistent Naming**: Follow consistent naming conventions

### Performance Optimization

1. **Memoization**: Use React.memo for expensive components
2. **Lazy Loading**: Implement lazy loading for routes
3. **Image Optimization**: Use Expo Image for optimized image loading
4. **Bundle Optimization**: Minimize bundle size with tree shaking

### Security Considerations

1. **Secure Storage**: Use AsyncStorage for sensitive data
2. **Input Validation**: Validate all user inputs
3. **API Security**: Implement proper API authentication
4. **Code Obfuscation**: Protect sensitive code in production

## Troubleshooting

### Common Issues

1. **Metro Bundler Issues**: Clear cache with `npx expo start -c`
2. **TypeScript Errors**: Run `npx tsc --noEmit` to check types
3. **Linting Issues**: Run `npm run lint` to identify issues
4. **Formatting Issues**: Run `npm run format` to fix formatting

### Debug Tools

1. **React Native Debugger**: For debugging React Native applications
2. **Flipper**: For debugging and inspecting app state
3. **Expo DevTools**: For Expo-specific debugging
4. **Redux DevTools**: For Redux state inspection

## References

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)

---

*This documentation is maintained as part of the Mobile Counter Application project. For updates and contributions, please refer to the project repository.* 