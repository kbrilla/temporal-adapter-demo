import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter } from '@angular/material-temporal-adapter';
import { MatrixTestSuiteComponent } from './matrix-test-suite.component';

// Import Temporal polyfill
import 'temporal-polyfill/global';

const meta: Meta<MatrixTestSuiteComponent> = {
  title: 'Tests/Matrix Test Suite',
  component: MatrixTestSuiteComponent,
  parameters: {
    docs: {
      description: {
        component: `
# Temporal Date Adapter Matrix Test Suite

This comprehensive test suite validates the \`TemporalDateAdapter\` across multiple dimensions:

## Test Dimensions

### Calendars (10)
- **ISO 8601** (default) - Standard international calendar
- **Gregorian** - Western calendar
- **Japanese** - Emperor era-based calendar (Reiwa, Heisei, etc.)
- **Hebrew** - Jewish calendar (12-13 months)
- **Chinese** - Lunisolar calendar (12-13 months with intercalary)
- **Persian** - Solar Hijri calendar
- **Buddhist** - Thai Buddhist calendar (+543 years)
- **Indian** - Indian National Calendar
- **Ethiopic** - Ethiopian calendar (13 months)
- **Coptic** - Coptic calendar (13 months)

### Modes (3)
- **date** - Date only (PlainDate)
- **datetime** - Date + time without timezone (PlainDateTime)
- **zoned** - Date + time with timezone (ZonedDateTime)

### Options
- **outputCalendar** - Display calendar different from storage calendar
- **firstDayOfWeek** - Week start day (0-6)
- **overflow** - How to handle invalid dates ('constrain' | 'reject')

## Test Categories
1. **Core Adapter** - Basic operations (today, createDate, clone, invalid)
2. **Date Components** - Getters (year, month, date, dayOfWeek)
3. **Calendar Arithmetic** - Add/subtract (days, months, years)
4. **Formatting** - toIso8601, format, getMonthNames, getDayOfWeekNames
5. **Parsing** - parse, deserialize
6. **Comparison** - compareDate, sameDate, clampDate
7. **Validation** - isValid, isDateInstance, getValidDateOrNull
8. **Calendar Specific** - Tests unique to each calendar system
9. **Material Components** - Integration with mat-datepicker, mat-timepicker
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<MatrixTestSuiteComponent>;

// ============================================================
// PART 1: CALENDAR STORIES (mode: 'date')
// ============================================================

export const ISO8601Calendar: Story = {
  name: '📅 ISO 8601 (Default)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'iso8601', mode: 'date' }),
      ],
    }),
  ],
};

export const GregorianCalendar: Story = {
  name: '📅 Gregorian',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'gregory', mode: 'date' }),
      ],
    }),
  ],
};

export const JapaneseCalendar: Story = {
  name: '📅 Japanese (Reiwa Era)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'japanese', mode: 'date' }),
      ],
    }),
  ],
};

export const HebrewCalendar: Story = {
  name: '📅 Hebrew (13 months)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'hebrew', mode: 'date' }),
      ],
    }),
  ],
};

export const ChineseCalendar: Story = {
  name: '📅 Chinese (Lunisolar)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'chinese', mode: 'date' }),
      ],
    }),
  ],
};

export const PersianCalendar: Story = {
  name: '📅 Persian (Solar Hijri)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'persian', mode: 'date' }),
      ],
    }),
  ],
};

export const BuddhistCalendar: Story = {
  name: '📅 Buddhist',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'buddhist', mode: 'date' }),
      ],
    }),
  ],
};

export const IndianCalendar: Story = {
  name: '📅 Indian National',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'indian', mode: 'date' }),
      ],
    }),
  ],
};

export const EthiopicCalendar: Story = {
  name: '📅 Ethiopic (13 months)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'ethiopic', mode: 'date' }),
      ],
    }),
  ],
};

export const CopticCalendar: Story = {
  name: '📅 Coptic (13 months)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'coptic', mode: 'date' }),
      ],
    }),
  ],
};

// ============================================================
// PART 2: MODE STORIES
// ============================================================

export const DateMode: Story = {
  name: '⏰ Mode: date (PlainDate)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'iso8601', mode: 'date' }),
      ],
    }),
  ],
};

export const DateTimeMode: Story = {
  name: '⏰ Mode: datetime (PlainDateTime)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { calendar: 'iso8601', mode: 'datetime' }),
      ],
    }),
  ],
};

export const ZonedModeUTC: Story = {
  name: '⏰ Mode: zoned (ZonedDateTime UTC)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          mode: 'zoned', 
          timezone: 'UTC' 
        }),
      ],
    }),
  ],
};

export const ZonedModeNewYork: Story = {
  name: '⏰ Mode: zoned (New York)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          mode: 'zoned', 
          timezone: 'America/New_York' 
        }),
      ],
    }),
  ],
};

export const ZonedModeTokyo: Story = {
  name: '⏰ Mode: zoned (Tokyo)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          mode: 'zoned', 
          timezone: 'Asia/Tokyo' 
        }),
      ],
    }),
  ],
};

// ============================================================
// PART 3: OUTPUT CALENDAR COMBINATIONS
// ============================================================

export const ISOtoJapaneseOutput: Story = {
  name: '🔄 ISO → Japanese output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          outputCalendar: 'japanese',
          mode: 'date' 
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Store dates in ISO format, display in Japanese era format (Reiwa 8 = 2026)'
      }
    }
  }
};

export const ISOtoHebrewOutput: Story = {
  name: '🔄 ISO → Hebrew output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          outputCalendar: 'hebrew',
          mode: 'date' 
        }),
      ],
    }),
  ],
};

export const ISOtoChineseOutput: Story = {
  name: '🔄 ISO → Chinese output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          outputCalendar: 'chinese',
          mode: 'date' 
        }),
      ],
    }),
  ],
};

export const ISOtoEthiopicOutput: Story = {
  name: '🔄 ISO → Ethiopic output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          outputCalendar: 'ethiopic',
          mode: 'date' 
        }),
      ],
    }),
  ],
};

export const IsotoPersianOutput: Story = {
  name: '🔄 ISO → Persian output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          outputCalendar: 'persian',
          mode: 'date' 
        }),
      ],
    }),
  ],
};

export const IsotoBuddhistOutput: Story = {
  name: '🔄 ISO → Buddhist output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          outputCalendar: 'buddhist',
          mode: 'date' 
        }),
      ],
    }),
  ],
};

export const JapanesetoISOOutput: Story = {
  name: '🔄 Japanese → ISO output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'japanese', 
          outputCalendar: 'iso8601',
          mode: 'date' 
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Store dates in Japanese era format, display in ISO format'
      }
    }
  }
};

export const HebrewtoGregorianOutput: Story = {
  name: '🔄 Hebrew → Gregorian output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'hebrew', 
          outputCalendar: 'gregory',
          mode: 'date' 
        }),
      ],
    }),
  ],
};

export const PersiantoGregorianOutput: Story = {
  name: '🔄 Persian → Gregorian output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'persian', 
          outputCalendar: 'gregory',
          mode: 'date' 
        }),
      ],
    }),
  ],
};

export const ChinesetoGregorianOutput: Story = {
  name: '🔄 Chinese → Gregorian output',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'chinese', 
          outputCalendar: 'gregory',
          mode: 'date' 
        }),
      ],
    }),
  ],
};

// ============================================================
// PART 4: FIRST DAY OF WEEK OPTIONS
// ============================================================

export const FirstDaySunday: Story = {
  name: '📆 First day: Sunday (0)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          mode: 'date',
          firstDayOfWeek: 0 
        }),
      ],
    }),
  ],
};

export const FirstDayMonday: Story = {
  name: '📆 First day: Monday (1)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          mode: 'date',
          firstDayOfWeek: 1 
        }),
      ],
    }),
  ],
};

export const FirstDaySaturday: Story = {
  name: '📆 First day: Saturday (6)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          mode: 'date',
          firstDayOfWeek: 6 
        }),
      ],
    }),
  ],
};

// ============================================================
// PART 5: OVERFLOW OPTIONS
// ============================================================

export const OverflowConstrain: Story = {
  name: '⚠️ Overflow: constrain',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          mode: 'date',
          overflow: 'constrain' 
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Invalid dates are constrained to valid ones (e.g., Feb 31 → Feb 28/29)'
      }
    }
  }
};

export const OverflowReject: Story = {
  name: '⚠️ Overflow: reject',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          mode: 'date',
          overflow: 'reject' 
        }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Invalid dates throw errors (e.g., Feb 31 → RangeError)'
      }
    }
  }
};

// ============================================================
// PART 6: COMPLEX COMBINATIONS
// ============================================================

export const JapaneseDateTime: Story = {
  name: '🎌 Japanese + datetime mode',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'japanese', 
          mode: 'datetime'
        }),
      ],
    }),
  ],
};

export const HebrewDateTimeMondayStart: Story = {
  name: '✡️ Hebrew + datetime + Monday start',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'hebrew', 
          mode: 'datetime',
          firstDayOfWeek: 1
        }),
      ],
    }),
  ],
};

export const ChineseZonedShanghai: Story = {
  name: '🐉 Chinese + zoned (Shanghai)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'chinese', 
          mode: 'zoned',
          timezone: 'Asia/Shanghai'
        }),
      ],
    }),
  ],
};

export const PersianZonedTehran: Story = {
  name: '🇮🇷 Persian + zoned (Tehran)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'persian', 
          mode: 'zoned',
          timezone: 'Asia/Tehran'
        }),
      ],
    }),
  ],
};

export const EthiopicZonedAddisAbaba: Story = {
  name: '🇪🇹 Ethiopic + zoned (Addis Ababa)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'ethiopic', 
          mode: 'zoned',
          timezone: 'Africa/Addis_Ababa'
        }),
      ],
    }),
  ],
};

export const BuddhistZonedBangkok: Story = {
  name: '🇹🇭 Buddhist + zoned (Bangkok)',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'buddhist', 
          mode: 'zoned',
          timezone: 'Asia/Bangkok'
        }),
      ],
    }),
  ],
};

// ============================================================
// PART 7: CROSS-CALENDAR OUTPUT MATRIX (selected important ones)
// ============================================================

export const GregorianToJapanese: Story = {
  name: '🔁 Gregorian storage → Japanese display',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'gregory', 
          outputCalendar: 'japanese',
          mode: 'date'
        }),
      ],
    }),
  ],
};

export const GregorianToHebrew: Story = {
  name: '🔁 Gregorian storage → Hebrew display',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'gregory', 
          outputCalendar: 'hebrew',
          mode: 'date'
        }),
      ],
    }),
  ],
};

export const ISOtoIndian: Story = {
  name: '🔁 ISO storage → Indian display',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          outputCalendar: 'indian',
          mode: 'date'
        }),
      ],
    }),
  ],
};

export const IsotoCoptic: Story = {
  name: '🔁 ISO storage → Coptic display',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(undefined, { 
          calendar: 'iso8601', 
          outputCalendar: 'coptic',
          mode: 'date'
        }),
      ],
    }),
  ],
};
