# Auth Feature

This feature handles authentication, employee management, and role-based access control for the Counter Portal application.

## Structure

```
features/auth/
├── api/
│   └── authApi.ts          # RTK Query API endpoints
├── components/
│   ├── LoginForm.tsx       # Reusable login form component
│   └── index.ts           # Component exports
├── hooks/
│   ├── useAuth.ts         # Authentication logic hook
│   ├── useEmployeeData.ts # Employee data management hook
│   └── index.ts          # Hook exports
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   ├── validation.ts     # Form validation utilities
│   └── errorHandler.ts   # Error handling utilities
└── index.ts             # Main feature exports
```

## Key Components

### LoginForm Component

A reusable form component that handles:

- Employee ID and PIN input
- Form validation
- Password visibility toggle
- Loading states

### useAuth Hook

Manages authentication state and provides:

- `login(formData)` - Handle user login
- `logout()` - Handle user logout
- `isLoading` - Loading state

### useEmployeeData Hook

Manages employee data fetching:

- Employee information
- Employee roles
- Automatic caching and refetching

## Usage Examples

### Basic Login

```tsx
import { useAuth, LoginForm } from '@/features/auth';

function LoginScreen() {
  const { login, isLoading } = useAuth();

  const handleLogin = async formData => {
    await login(formData);
  };

  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} />;
}
```

### Employee Data

```tsx
import { useEmployeeData } from '@/features/auth';

function EmployeeProfile() {
  const { employeeInfo, employeeRoles, isLoading } = useEmployeeData();

  if (isLoading) return <LoadingSpinner />;

  return (
    <View>
      <Text>
        {employeeInfo?.first_name} {employeeInfo?.last_name}
      </Text>
      <Text>Role: {employeeRoles[0]?.role_name}</Text>
    </View>
  );
}
```

## State Management

The auth feature uses Redux with the following slices:

- `authSlice` - Authentication state (isAuthenticated, employee, roles, etc.)
- `employeeSlice` - Legacy employee state (maintained for backward compatibility)

## API Endpoints

- `POST /employee/login` - Employee authentication
- `GET /employee?employee_id={id}` - Get employee information
- `GET /employee/role?employee_schedule.employee_id={id}` - Get employee roles

## Error Handling

Centralized error handling with specific error types:

- Network errors
- Authentication errors
- Server errors
- Validation errors

## Validation

Form validation includes:

- Required field validation
- Employee ID format validation
- PIN format validation (numeric only)
- Minimum length requirements
