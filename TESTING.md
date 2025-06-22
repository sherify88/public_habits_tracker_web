# Testing Guide for Habits Tracker

This document provides comprehensive information about the testing setup and how to run tests for the Habits Tracker application.

## 🧪 Testing Setup

The application uses the following testing stack:

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM testing
- **ts-jest** - TypeScript support for Jest
- **jest-environment-jsdom** - DOM environment for testing

## 📦 Test Dependencies

The following testing dependencies are included:

```json
{
  "@testing-library/jest-dom": "^5.15.1",
  "@testing-library/react": "^11.2.7",
  "@testing-library/user-event": "^12.8.3",
  "@types/jest": "^29.5.0",
  "identity-obj-proxy": "^3.0.0",
  "jest": "^29.5.0",
  "jest-environment-jsdom": "^29.5.0",
  "ts-jest": "^29.1.0"
}
```

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

### Test File Structure

```
src/
├── components/
│   ├── __tests__/
│   │   ├── HabitItem.test.tsx
│   │   ├── HabitList.test.tsx
│   │   ├── HabitStats.test.tsx
│   │   └── CreateHabitForm.test.tsx
│   └── ...
├── pages/
│   ├── __tests__/
│   │   └── HabitsPage.test.tsx
│   └── ...
├── api/
│   ├── __tests__/
│   │   └── habitsApi.test.ts
│   └── ...
└── setupTests.ts
```

## 🧩 Test Coverage

### Components Tested

#### 1. **HabitItem** (`src/components/__tests__/HabitItem.test.tsx`)
- ✅ Rendering with and without description
- ✅ Toggle functionality and loading states
- ✅ Delete functionality with confirmation
- ✅ Visual states (completed, incomplete, deleting)
- ✅ Error handling for failed operations
- ✅ Accessibility attributes
- ✅ Styling classes application

#### 2. **HabitList** (`src/components/__tests__/HabitList.test.tsx`)
- ✅ Rendering habits list
- ✅ Loading states
- ✅ Empty states
- ✅ Interaction with child components
- ✅ Delete confirmation dialog
- ✅ Error handling for delete operations
- ✅ Props validation

#### 3. **HabitStats** (`src/components/__tests__/HabitStats.test.tsx`)
- ✅ Stats display and formatting
- ✅ Progress bar calculations
- ✅ Celebration message logic
- ✅ Loading states
- ✅ Empty states
- ✅ Date formatting
- ✅ Edge cases (large numbers, zero values)

#### 4. **CreateHabitForm** (`src/components/__tests__/CreateHabitForm.test.tsx`)
- ✅ Form rendering and validation
- ✅ Input validation (name length, description length)
- ✅ Form submission with valid/invalid data
- ✅ Loading states during submission
- ✅ Error handling and display
- ✅ User interactions (close, cancel, outside click)
- ✅ Form clearing after successful submission

#### 5. **HabitsPage** (`src/pages/__tests__/HabitsPage.test.tsx`)
- ✅ Page rendering and layout
- ✅ Loading and error states
- ✅ Empty state handling
- ✅ Create form integration
- ✅ Habit interactions (toggle)
- ✅ Data passing to child components
- ✅ Performance optimizations (useCallback, useMemo)
- ✅ Edge cases and error handling

### API Tests

#### **habitsApi** (`src/api/__tests__/habitsApi.test.ts`)
- ✅ All API functions (getHabits, createHabit, deleteHabit, etc.)
- ✅ React Query hooks testing
- ✅ Error handling (404, network errors)
- ✅ Request/response formatting
- ✅ Query invalidation
- ✅ Loading and error states

## 🎯 Testing Best Practices

### 1. **Component Testing**
- Test user interactions, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test accessibility features
- Mock external dependencies
- Test error states and edge cases

### 2. **API Testing**
- Mock axios requests
- Test both success and error scenarios
- Verify correct request formatting
- Test React Query hook behavior
- Mock QueryClient for isolated testing

### 3. **Test Organization**
- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Clean up mocks between tests

### 4. **Mocking Strategy**
- Mock child components to isolate unit tests
- Mock API calls to avoid network dependencies
- Mock browser APIs (localStorage, window.confirm)
- Use jest.fn() for function mocks

## 🔧 Configuration

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    // ... other configuration
};
```

### Test Setup (`src/setupTests.ts`)
- Configures `@testing-library/jest-dom`
- Mocks browser APIs (matchMedia, IntersectionObserver)
- Suppresses console warnings for cleaner test output

## 📊 Coverage Reports

When running `npm run test:coverage`, you'll get:

- **Text coverage** in the terminal
- **HTML coverage** report in `coverage/` directory
- **LCOV coverage** for CI integration

### Coverage Targets
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

## 🐛 Debugging Tests

### Common Issues

1. **Async Operations**: Use `waitFor` for async operations
2. **Mock Cleanup**: Clear mocks in `beforeEach`
3. **Component Isolation**: Mock child components to avoid complex dependencies
4. **QueryClient**: Provide QueryClient wrapper for React Query tests

### Debug Commands

```bash
# Run specific test file
npm test -- HabitItem.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="toggle"

# Run tests in verbose mode
npm test -- --verbose

# Debug failing tests
npm test -- --detectOpenHandles
```

## 🚀 CI/CD Integration

The test suite is designed to run in CI/CD pipelines:

```bash
# CI command (no watch, with coverage)
npm run test:ci
```

This command:
- Runs all tests once
- Generates coverage reports
- Exits with appropriate code for CI systems
- Doesn't start watch mode

## 📝 Writing New Tests

### Template for Component Tests

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders correctly', () => {
            render(<YourComponent />);
            expect(screen.getByText('Expected Text')).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('handles user input', async () => {
            render(<YourComponent />);
            const input = screen.getByLabelText('Input Label');
            fireEvent.change(input, { target: { value: 'test' } });
            await waitFor(() => {
                expect(input).toHaveValue('test');
            });
        });
    });
});
```

### Template for API Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useYourHook } from '../yourHook';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('useYourHook', () => {
    it('fetches data successfully', async () => {
        const { result } = renderHook(() => useYourHook(), {
            wrapper: createWrapper()
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });
    });
});
```

## 🎉 Conclusion

This comprehensive testing setup ensures:

- **Reliability**: All critical functionality is tested
- **Maintainability**: Tests are well-organized and documented
- **Confidence**: High coverage gives confidence in code changes
- **CI/CD Ready**: Tests run automatically in deployment pipelines

Run `npm test` to start testing your habits tracker application! 