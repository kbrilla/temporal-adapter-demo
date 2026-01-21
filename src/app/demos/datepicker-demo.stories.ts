import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter } from '@angular/material-temporal-adapter';
import { DatepickerDemoComponent } from './datepicker-demo.component';
import { within, userEvent, expect } from 'storybook/test';

// Import Temporal polyfill
import 'temporal-polyfill/global';

const meta: Meta<DatepickerDemoComponent> = {
  title: 'Demos/Datepicker',
  component: DatepickerDemoComponent,
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
# Temporal Datepicker Demo

This demo showcases the \`TemporalDateAdapter\` with Angular Material's datepicker.

## Features Demonstrated

- **Temporal.PlainDate** for date values
- Adapter methods: \`getYear()\`, \`getMonth()\`, \`getDate()\`, \`getDayOfWeek()\`
- ISO 8601 serialization with \`toIso8601()\`
- Validation with \`isValid()\`

## Usage

\`\`\`typescript
import { provideTemporalDateAdapter } from '@angular/material-temporal-adapter';

bootstrapApplication(AppComponent, {
  providers: [provideTemporalDateAdapter()],
});
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DatepickerDemoComponent>;

export const Default: Story = {
  name: 'Basic Datepicker (Date Mode)',
};

export const DateTimeMode: Story = {
  name: 'DateTime Mode',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(undefined, {
          mode: 'datetime'
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Uses `Temporal.PlainDateTime` internally. Time components default to 00:00:00 when selected via standard datepicker.'
      }
    }
  }
};

export const ZonedMode: Story = {
  name: 'Zoned Mode (UTC)',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(undefined, {
          mode: 'zoned',
          timezone: 'UTC'
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Uses `Temporal.ZonedDateTime` internally with UTC timezone.'
      }
    }
  }
};


export const OverflowConstrain: Story = {
  name: 'Overflow: Constrain (Feb 30 -> Feb 29)',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(undefined, { overflow: 'constrain' }),
      ],
    }),
  ],
};

export const JapaneseCalendar: Story = {
  name: 'Japanese Calendar',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'japanese' }),
      ],
    }),
  ],
};

export const OutputCalendarMismatch: Story = {
  name: 'ISO Calc / Japanese Output',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(undefined, { calendar: 'iso8601', outputCalendar: 'japanese' }),
      ],
    }),
  ],
};

export const YearView: Story = {
  name: 'Year View (Start View)',
  args: {
    startView: 'year',
  },
};

export const MultiYearView: Story = {
  name: 'Multi-Year View (Start View)',
  args: {
    startView: 'multi-year',
  },
};

export const InteractiveTest: Story = {
  name: 'Interactive Test',
  args: {
    initialValue: '2025-01-15',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find and verify the datepicker input exists
    const input = canvas.getByRole('textbox');
    expect(input).toBeInTheDocument();
    
    // Verify input has a value (format may vary by locale, just check it's not empty)
    expect(input).not.toHaveValue('');
    
    // Find the toggle button and click it
    const toggleButton = canvas.getByRole('button');
    await userEvent.click(toggleButton);
    
    // Wait for calendar to open
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};

export const Playground: Story = {
  name: 'Playground',
  args: {
    startView: 'month',
    initialValue: '2025-01-01',
  },
  argTypes: {
    startView: {
      control: 'select',
      options: ['month', 'year', 'multi-year'],
      description: 'The view that the calendar starts in.',
    },
    initialValue: {
      control: 'text',
      description: 'Initial date value (ISO-8601 string, e.g. 2024-01-01, 2024-01-01T10:00, or 2024-01-01T10:00[UTC])',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully configurable playground. Edit the `initialValue` in controls to see how the adapter parses different string formats into Temporal objects.',
      },
    },
  },
};
