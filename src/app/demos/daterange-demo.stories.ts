import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter } from '@angular/material-temporal-adapter';
import { DateRangeDemoComponent } from './daterange-demo.component';
import { within, userEvent, expect } from 'storybook/test';

// Import Temporal polyfill
import 'temporal-polyfill/global';

const meta: Meta<DateRangeDemoComponent> = {
  title: 'Demos/Date Range',
  component: DateRangeDemoComponent,
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
# Date Range Picker Demo

This demo shows the date range picker working with Temporal dates.

## Features Demonstrated

- \`mat-date-range-input\` with Temporal support
- \`compareDate()\` for range validation  
- \`clone()\` for safe iteration
- Duration calculation in days

## Range Calculation

\`\`\`typescript
const start = startDate.value;
const end = endDate.value;

// Compare dates
if (adapter.compareDate(start, end) < 0) {
  console.log('Valid range');
}

// Clone for iteration
let current = adapter.clone(start);
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DateRangeDemoComponent>;

export const Default: Story = {
  name: 'Date Range (Date Mode)',
};

export const DateTimeMode: Story = {
  name: 'DateTime Mode',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(undefined, { mode: 'datetime' }),
      ],
    }),
  ],
};

export const ZonedMode: Story = {
  name: 'Zoned Mode (UTC)',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(undefined, { mode: 'zoned', timezone: 'UTC' }),
      ],
    }),
  ],
};

export const InteractiveTest: Story = {
  name: 'Select Range',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find the range inputs
    const startInput = canvas.getByPlaceholderText('Start date');
    const endInput = canvas.getByPlaceholderText('End date');
    
    expect(startInput).toBeInTheDocument();
    expect(endInput).toBeInTheDocument();
    
    // Verify labels
    expect(canvas.getByText('Start:')).toBeInTheDocument();
    expect(canvas.getByText('End:')).toBeInTheDocument();
    
    // Click toggle to open calendar
    const toggleButton = canvas.getByRole('button');
    await userEvent.click(toggleButton);
    
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};
