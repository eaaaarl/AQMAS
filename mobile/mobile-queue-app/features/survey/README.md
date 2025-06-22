# Survey Feature

This feature follows the feature-based architecture pattern and handles all survey-related functionality.

## Structure

```
features/survey/
├── api/                    # API layer
│   ├── surveyApi.ts       # Survey API endpoints
│   └── interface.ts       # API interfaces
├── components/            # UI components
│   ├── index.ts          # Component exports
│   ├── SurveyQuestion.tsx # Individual survey question component
│   ├── SurveyQuestionModal.tsx # Modal for answering questions
│   ├── SurveyLayout.tsx  # Main layout wrapper
│   ├── SurveyContent.tsx # Content area with questions list
│   ├── CustomerFormModal.tsx # Customer information form
│   └── BackButton.tsx    # Back navigation button
├── hooks/                 # Custom hooks
│   └── useSurvey.ts      # Main survey logic hook
├── interface/            # TypeScript interfaces
│   ├── survey.interface.ts
│   ├── surveyQuestion.interface.ts
│   └── surveyQuestionDetail.interface.ts
├── utils/                # Utility functions
│   └── shuffleArray.ts   # Array shuffling utility
└── README.md            # This file
```

## Components

### SurveyLayout
Main layout wrapper that handles:
- Loading states
- Error states
- Header with back button
- Basic structure

### SurveyContent
Content area that handles:
- Questions list rendering
- Submit button when all questions are answered
- Empty state

### SurveyQuestion
Individual question component that displays:
- Question text and type
- Answer status (answered/unanswered)
- Answer preview
- Question metadata

### SurveyQuestionModal
Modal for answering questions with:
- Yes/No questions
- Multiple choice questions
- Text/commentary questions
- Answer validation

### CustomerFormModal
Modal for collecting customer information:
- Name, address, contact, reference
- Form validation
- Submission handling

## Hooks

### useSurvey
Main custom hook that encapsulates all survey logic:
- State management
- API calls
- Event handlers
- Business logic

## Usage

The main survey screen (`app/(survey)/survey.tsx`) uses the feature components:

```tsx
import { CustomerFormModal, SurveyContent, SurveyLayout, SurveyQuestionModal } from '@/features/survey/components';
import { useSurvey } from '@/features/survey/hooks/useSurvey';

export default function SurveyResultsScreen() {
    const survey = useSurvey();
    
    return (
        <DismissKeyboard>
            <SurveyLayout {...survey}>
                <SurveyContent {...survey} />
                <SurveyQuestionModal {...survey} />
                <CustomerFormModal {...survey} />
            </SurveyLayout>
        </DismissKeyboard>
    );
}
```

## Benefits of This Architecture

1. **Separation of Concerns**: Logic is separated from UI components
2. **Reusability**: Components can be reused across different screens
3. **Testability**: Each component and hook can be tested independently
4. **Maintainability**: Clear structure makes it easy to find and modify code
5. **Scalability**: Easy to add new features or modify existing ones 