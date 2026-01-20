import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter } from '@angular/material-temporal-adapter';
import { JapaneseCalendarDebugComponent } from './japanese-calendar-debug.component';

// Import Temporal polyfill
import 'temporal-polyfill/global';

const meta: Meta<JapaneseCalendarDebugComponent> = {
  title: 'Debug/Japanese Calendar',
  component: JapaneseCalendarDebugComponent,
  parameters: {
    docs: {
      description: {
        component: `
# Japanese Calendar Debug

This is a debug component to investigate date selection issues with the Japanese calendar.

## Instructions

1. Try selecting a date from the datepicker
2. Watch the event log at the bottom
3. Check if the value is properly set
4. Use the manual buttons to test date creation

## What to check

- Does the calendar popup open?
- Are dates rendered correctly?
- When you click a date, does the log show a value change?
- Is the selected value valid?
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<JapaneseCalendarDebugComponent>;

export const JapaneseCalendar: Story = {
  name: 'Japanese Calendar Mode',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'japanese' }),
      ],
    }),
  ],
};

export const ISOCalendar: Story = {
  name: 'ISO Calendar (Control)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(), // Default ISO calendar
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Control test with default ISO calendar - if this works but Japanese doesn\'t, the issue is calendar-specific.'
      }
    }
  }
};

export const HebrewCalendar: Story = {
  name: 'Hebrew Calendar',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'hebrew' }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Test with Hebrew calendar (13 months in leap years) - Adar I and Adar II appear in leap years.'
      }
    }
  }
};

export const EthiopicCalendar: Story = {
  name: 'Ethiopic Calendar',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'ethiopic' }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Test with Ethiopic calendar (13 months: 12 months of 30 days + Pagume with 5-6 days).'
      }
    }
  }
};

export const ChineseCalendar: Story = {
  name: 'Chinese Calendar',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'chinese' }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Test with Chinese lunisolar calendar (can have 13 months in leap years with intercalary month).'
      }
    }
  }
};

export const PersianCalendar: Story = {
  name: 'Persian Calendar',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'persian' }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Test with Persian/Solar Hijri calendar (12 months, used in Iran and Afghanistan).'
      }
    }
  }
};

// ============================================================
// Tests: Different calendar + outputCalendar combinations
// ============================================================

export const IsoCalendarWithJapaneseOutput: Story = {
  name: 'ISO (calc) → Japanese (display)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, {
          calendar: 'iso8601',          // Use ISO calendar for calculations/storage
          outputCalendar: 'japanese',   // Display in Japanese calendar format
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
**Use Case**: Store dates in ISO format (2026-01-20) but display them using the Japanese calendar format (8 Reiwa).

- **calendar**: 'iso8601' - dates are stored/calculated in ISO format
- **outputCalendar**: 'japanese' - dates are displayed in Japanese format (year shows Reiwa era)

This is useful when your backend stores ISO dates but users prefer to see dates in their local calendar system.
        `
      }
    }
  }
};

export const IsoCalendarWithHebrewOutput: Story = {
  name: 'ISO (calc) → Hebrew (display)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, {
          calendar: 'iso8601',          // Use ISO calendar for calculations/storage
          outputCalendar: 'hebrew',     // Display in Hebrew calendar format
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
**Use Case**: Store dates in ISO format (2026-01-20) but display them using the Hebrew calendar format (2 Shevat 5786).

- **calendar**: 'iso8601' - dates are stored/calculated in ISO format
- **outputCalendar**: 'hebrew' - dates are displayed in Hebrew format (year shows Hebrew year)

Useful for Jewish calendars applications where dates need to be stored in a standard format.
        `
      }
    }
  }
};

export const GregorianCalendarWithChineseOutput: Story = {
  name: 'Gregorian (calc) → Chinese (display)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, {
          calendar: 'gregory',          // Use Gregorian calendar for calculations
          outputCalendar: 'chinese',    // Display in Chinese calendar format
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
**Use Case**: Store dates in Gregorian format but display them using the Chinese lunisolar calendar.

- **calendar**: 'gregory' - dates are stored/calculated in Gregorian format
- **outputCalendar**: 'chinese' - dates are displayed with Chinese month names and sexagenary cycle year

Useful for applications serving Chinese users who want to see lunar dates but store standard dates.
        `
      }
    }
  }
};

export const IsoCalendarWithEthiopicOutput: Story = {
  name: 'ISO (calc) → Ethiopic (display)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, {
          calendar: 'iso8601',          // Use ISO calendar for calculations/storage
          outputCalendar: 'ethiopic',   // Display in Ethiopic calendar format
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
**Use Case**: Store dates in ISO format but display them using the Ethiopic calendar (13 months).

- **calendar**: 'iso8601' - dates are stored/calculated in ISO format
- **outputCalendar**: 'ethiopic' - dates are displayed in Ethiopic format (shows Ethiopic year and month names)

Note: The Ethiopic calendar has 13 months - 12 months of 30 days each, plus Pagumen (5-6 days).
        `
      }
    }
  }
};

export const PersianCalendarWithGregorianOutput: Story = {
  name: 'Persian (calc) → Gregorian (display)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, {
          calendar: 'persian',          // Use Persian calendar for calculations
          outputCalendar: 'gregory',    // Display in Gregorian calendar format
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
**Use Case**: Calculate/store dates in Persian calendar system but display them in Gregorian format.

- **calendar**: 'persian' - dates are stored using Persian calendar (e.g., year 1404)
- **outputCalendar**: 'gregory' - dates are displayed in Gregorian format (year 2026)

Useful for Persian users who store dates in their native calendar but need Gregorian display for international contexts.
        `
      }
    }
  }
};
