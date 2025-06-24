# Service Feature - Clean Architecture

This document describes the refactored clean architecture for the service feature.

## Architecture Overview

The service feature has been refactored following clean architecture principles with clear separation of concerns:

```
features/service/
├── api/                    # API layer - data fetching and interfaces
├── components/             # UI components - presentation layer
├── hooks/                  # Business logic - custom hooks
└── utils/                  # Utility functions and error handling
```

## Component Structure

### Core Components

1. **ServicePageContainer** - Main container component that orchestrates the entire service page
2. **ServiceLayout** - Handles the overall layout and structure
3. **ServiceGrid** - Displays the grid of service items
4. **ServiceNavigation** - Handles "More" and "Back" navigation
5. **PrintReceiptButton** - Receipt printing functionality
6. **ServiceModals** - Manages all modal components

### Custom Hooks

1. **useServicePage** - Main business logic hook that combines all service-related state and handlers
2. **useService** - Service data management (existing)
3. **useQueue** - Queue management (existing)
4. **useConfig** - Configuration management (existing)

## Benefits of the New Architecture

### 1. Single Responsibility Principle
- Each component has a single, well-defined responsibility
- Business logic is separated from UI components
- State management is centralized in custom hooks

### 2. Separation of Concerns
- **Presentation Layer**: Components focus only on rendering UI
- **Business Logic Layer**: Custom hooks handle all business logic
- **Data Layer**: API hooks manage data fetching and caching

### 3. Maintainability
- Easy to locate and modify specific functionality
- Clear component boundaries
- Reduced coupling between components

### 4. Testability
- Business logic can be tested independently
- Components can be tested in isolation
- Clear interfaces make mocking easier

### 5. Reusability
- Components can be reused in different contexts
- Hooks can be shared across features
- Clear interfaces enable easy composition

## Component Hierarchy

```
ServicePageContainer
├── ServiceLayout
│   ├── ServiceGrid
│   ├── ServiceNavigation
│   ├── PrintReceiptButton
│   └── PaginationControls
├── ServiceModals
│   ├── CustomerNameModal
│   ├── CustomerTypeModal
│   ├── ConfirmationToast
│   └── TicketModal
└── RenderNoServices (conditional)
```

## State Management

The state is managed through a hierarchy of custom hooks:

1. **useServicePage** - Orchestrates all service page state
2. **useService** - Service data and pagination
3. **useQueue** - Queue and transaction management
4. **useConfig** - Configuration settings

## Event Flow

1. User interactions trigger event handlers in components
2. Event handlers call functions from the custom hooks
3. Hooks update state and trigger re-renders
4. Components receive updated props and re-render

## Usage Example

```tsx
// Before (messy, hard to maintain)
export default function Transaction() {
  // 200+ lines of mixed concerns
  const { /* many hooks */ } = useService();
  const { /* more hooks */ } = useQueue();
  // ... complex JSX with mixed logic
}

// After (clean, maintainable)
export default function Transaction() {
  return <ServicePageContainer />;
}
```

## Migration Guide

To migrate other features to this architecture:

1. **Extract Business Logic**: Move logic from components to custom hooks
2. **Create Specialized Components**: Break down large components into smaller, focused ones
3. **Define Clear Interfaces**: Create TypeScript interfaces for all props and state
4. **Centralize State Management**: Use custom hooks to manage related state
5. **Separate Concerns**: Keep UI, business logic, and data fetching separate

## Best Practices

1. **Keep Components Pure**: Components should only handle rendering
2. **Use Custom Hooks**: Extract reusable logic into custom hooks
3. **Define Clear Interfaces**: Use TypeScript for better type safety
4. **Follow Naming Conventions**: Use descriptive names for components and hooks
5. **Document Complex Logic**: Add comments for complex business logic
6. **Test Each Layer**: Write tests for hooks, components, and integration

## Future Improvements

1. **Add Error Boundaries**: Implement error boundaries for better error handling
2. **Optimize Performance**: Add React.memo and useMemo where appropriate
3. **Add Loading States**: Implement skeleton loading for better UX
4. **Improve Accessibility**: Add proper ARIA labels and keyboard navigation
5. **Add Unit Tests**: Write comprehensive tests for all components and hooks 