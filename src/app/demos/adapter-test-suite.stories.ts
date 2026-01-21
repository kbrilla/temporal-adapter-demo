import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter } from '@angular/material-temporal-adapter';
import { AdapterTestSuiteComponent } from './adapter-test-suite.component';
import { within, userEvent, expect } from 'storybook/test';

// Import Temporal polyfill
import 'temporal-polyfill/global';

const meta: Meta<AdapterTestSuiteComponent> = {
  title: 'Tests/Legacy Suite',
  component: AdapterTestSuiteComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
# Temporal Date Adapter Test Suite

This component provides comprehensive testing coverage for the \`TemporalDateAdapter\`.
It tests all major adapter methods across these categories:

- **Basic Date Operations**: \`today()\`, \`createDate()\`, \`clone()\`
- **Date Component Getters**: \`getYear()\`, \`getMonth()\`, \`getDate()\`, \`getDayOfWeek()\`, \`getNumDaysInMonth()\`
- **Calendar Arithmetic**: \`addCalendarDays()\`, \`addCalendarMonths()\`, \`addCalendarYears()\`
- **Date Comparison**: \`compareDate()\`, \`sameDate()\`
- **Formatting**: \`toIso8601()\`, \`format()\`, \`getMonthNames()\`, \`getDayOfWeekNames()\`, \`getDateNames()\`
- **Parsing**: \`parse()\`, \`deserialize()\`
- **Validation**: \`isValid()\`, \`isDateInstance()\`, \`invalid()\`
- **Locale**: \`getFirstDayOfWeek()\`, \`setLocale()\`

Click "Run All Tests" to execute the test suite.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<AdapterTestSuiteComponent>;

export const Default: Story = {
  name: 'Run Tests',
};

export const AutoRun: Story = {
  name: 'Auto-Run Tests',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Click the Run All Tests button
    const runButton = canvas.getByRole('button', { name: /Run All Tests/i });
    expect(runButton).toBeInTheDocument();
    
    await userEvent.click(runButton);
    
    // Wait for tests to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verify test categories appear
    expect(canvas.getByText('Basic Date Operations')).toBeInTheDocument();
    expect(canvas.getByText('Date Component Getters')).toBeInTheDocument();
    expect(canvas.getByText('Calendar Arithmetic')).toBeInTheDocument();
    expect(canvas.getByText('Date Comparison')).toBeInTheDocument();
    expect(canvas.getByText('Formatting')).toBeInTheDocument();
    expect(canvas.getByText('Parsing')).toBeInTheDocument();
    expect(canvas.getByText('Validation')).toBeInTheDocument();
    expect(canvas.getByText('Locale')).toBeInTheDocument();
  },
};
