import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter } from '@angular/material-temporal-adapter';
import { CalendarDemoComponent } from './calendar-demo.component';
import { within, expect } from 'storybook/test';

// Import Temporal polyfill
import 'temporal-polyfill/global';

const meta: Meta<CalendarDemoComponent> = {
  title: 'Demos/Calendar Arithmetic',
  component: CalendarDemoComponent,
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
# Calendar Arithmetic Demo

This demo shows how the Temporal adapter handles calendar arithmetic operations.

## Operations Demonstrated

- \`addCalendarDays()\` - Adding/subtracting days
- \`addCalendarMonths()\` - Adding/subtracting months  
- \`addCalendarYears()\` - Adding/subtracting years
- \`getNumDaysInMonth()\` - Days in the current month
- \`getFirstDayOfWeek()\` - Locale-aware week start

## Temporal Advantages

Unlike JavaScript \`Date\`, Temporal handles these operations correctly:
- Month overflow (Jan 31 + 1 month = Feb 28/29)
- Leap years
- Calendar-aware arithmetic

\`\`\`typescript
const adapter = inject(DateAdapter);
const date = adapter.today();

// Add 7 days
const nextWeek = adapter.addCalendarDays(date, 7);

// Add 1 month (handles overflow)
const nextMonth = adapter.addCalendarMonths(date, 1);
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<CalendarDemoComponent>;

export const Default: Story = {
  name: 'Calendar Operations (Date Mode)',
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

export const FirstDayOfWeekMonday: Story = {
  name: 'First Day: Monday',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(undefined, { firstDayOfWeek: 1 }),
      ],
    }),
  ],
};

export const InteractiveTest: Story = {
  name: 'Verify Arithmetic',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify the operations section exists
    const heading = canvas.getByText('Calendar Operations:');
    expect(heading).toBeInTheDocument();
    
    // Verify day operations are shown
    expect(canvas.getByText('+7 days:')).toBeInTheDocument();
    expect(canvas.getByText('-7 days:')).toBeInTheDocument();
    
    // Verify month operations
    expect(canvas.getByText('+1 month:')).toBeInTheDocument();
    expect(canvas.getByText('-1 month:')).toBeInTheDocument();
    
    // Verify year operations  
    expect(canvas.getByText('+1 year:')).toBeInTheDocument();
    expect(canvas.getByText('-1 year:')).toBeInTheDocument();
    
    // Verify month info
    expect(canvas.getByText('Month Info:')).toBeInTheDocument();
  },
};
