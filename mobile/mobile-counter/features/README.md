## Structure

```
features/
├── auth/           # Authentication feature
├── config/         # Configuration feature
├── counter/        # Counter interface feature
├── dashboard/      # Dashboard feature
├── navigation/     # Navigation feature
└── settings/       # Settings feature
```

## Feature Structure

Each feature follows this structure:

```
feature-name/
├── components/     # React components
├── hooks/          # Custom hooks
├── types/          # TypeScript interfaces/types
├── api/            # API calls (if applicable)
├── utils/          # Utility functions (if applicable)
└── index.ts        # Main exports
```

## Features Overview

### Counter Feature (`features/counter/`)

- **Purpose**: Main counter interface for managing customer tickets
- **Components**: `CounterScreen`
- **Hooks**: `useCounter`
- **Types**: `Ticket`, `CounterState`

### Settings Feature (`features/settings/`)

- **Purpose**: User settings and profile management
- **Components**: `SettingsScreen`
- **Hooks**: `useSettings`
- **Types**: `SettingsState`, `SettingRowProps`, `InfoRowProps`

### Navigation Feature (`features/navigation/`)

- **Purpose**: Tab navigation layout
- **Components**: `TabLayout`
- **Types**: `TabConfig`

### Auth Feature (`features/auth/`)

- **Purpose**: Authentication and user management
- **API**: `authApi`, employee interfaces
- **Components**: Login, registration components

### Config Feature (`features/config/`)

- **Purpose**: Application configuration
- **API**: `configApi`

## Benefits

1. **Separation of Concerns**: Each feature is self-contained
2. **Maintainability**: Easy to find and modify feature-specific code
3. **Scalability**: Easy to add new features without affecting existing ones
4. **Reusability**: Features can be easily reused across the application
5. **Testing**: Each feature can be tested independently

## Usage

### Importing Components

```typescript
import { CounterScreen } from '@/features/counter';
import { SettingsScreen } from '@/features/settings';
import { TabLayout } from '@/features/navigation';
```

### Using Hooks

```typescript
import { useCounter } from '@/features/counter/hooks';
import { useSettings } from '@/features/settings/hooks';
```

### Using Types

```typescript
import { Ticket } from '@/features/counter/types';
import { SettingsState } from '@/features/settings/types';
```

## Adding New Features

1. Create a new folder in `features/`
2. Follow the standard structure (components, hooks, types, index.ts)
3. Export main components and types from `index.ts`
4. Import and use in your app

## Best Practices

1. **Keep features self-contained**: Don't import from other features unless necessary
2. **Use TypeScript**: Define proper types for all data structures
3. **Extract business logic**: Use custom hooks for complex logic
4. **Consistent naming**: Use clear, descriptive names for components and functions
5. **Documentation**: Add comments for complex logic and update this README
