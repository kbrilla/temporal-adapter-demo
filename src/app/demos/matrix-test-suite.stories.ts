import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter, MatTemporalDateAdapterOptions } from '@angular/material-temporal-adapter';
import { MatrixTestSuiteComponent } from './matrix-test-suite.component';

import 'temporal-polyfill/global';

const meta: Meta<MatrixTestSuiteComponent> = {
  title: 'Tests/Matrix Test Suite',
  component: MatrixTestSuiteComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Comprehensive Matrix Test Suite

This suite validates the **TemporalDateAdapter** across:
- **10+ Calendar Systems**
- **3 Modes** (Date, DateTime, Zoned)
- **Output Calendar Transformations**
- **Configuration Options**
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<MatrixTestSuiteComponent>;

// Helper to create stories concise
function createStory(
  name: string, 
  options: Partial<MatTemporalDateAdapterOptions>, 
  description?: string
): Story {
  return {
    name,
    parameters: description ? { docs: { description: { story: description } } } : undefined,
    decorators: [
      applicationConfig({
        providers: [
          provideAnimationsAsync(),
          provideTemporalDateAdapter(undefined, options),
        ],
      }),
    ],
  };
}

// ==================================================================
// 1. CALENDARS (Mode: Date)
// ==================================================================

export const Calendar_ISO8601 = createStory('Calendar: ISO 8601', { calendar: 'iso8601', mode: 'date' });
export const Calendar_Gregory = createStory('Calendar: Gregorian', { calendar: 'gregory', mode: 'date' });
export const Calendar_Japanese = createStory('Calendar: Japanese', { calendar: 'japanese', mode: 'date' });
export const Calendar_Hebrew = createStory('Calendar: Hebrew', { calendar: 'hebrew', mode: 'date' });
export const Calendar_Chinese = createStory('Calendar: Chinese', { calendar: 'chinese', mode: 'date' });
export const Calendar_Persian = createStory('Calendar: Persian', { calendar: 'persian', mode: 'date' });
export const Calendar_Buddhist = createStory('Calendar: Buddhist', { calendar: 'buddhist', mode: 'date' });
export const Calendar_Indian = createStory('Calendar: Indian', { calendar: 'indian', mode: 'date' });
export const Calendar_Ethiopic = createStory('Calendar: Ethiopic', { calendar: 'ethiopic', mode: 'date' });
export const Calendar_Coptic = createStory('Calendar: Coptic', { calendar: 'coptic', mode: 'date' });

// ==================================================================
// 2. MODES (Calendar: ISO 8601)
// ==================================================================

export const Mode_Date = createStory('Mode: Date (PlainDate)', { calendar: 'iso8601', mode: 'date' });
export const Mode_DateTime = createStory('Mode: DateTime (PlainDateTime)', { calendar: 'iso8601', mode: 'datetime' });
export const Mode_Zoned_UTC = createStory('Mode: Zoned (UTC)', { calendar: 'iso8601', mode: 'zoned', timezone: 'UTC' });
export const Mode_Zoned_NY = createStory('Mode: Zoned (New York)', { calendar: 'iso8601', mode: 'zoned', timezone: 'America/New_York' });
export const Mode_Zoned_Tokyo = createStory('Mode: Zoned (Tokyo)', { calendar: 'iso8601', mode: 'zoned', timezone: 'Asia/Tokyo' });

// ==================================================================
// 3. OUTPUT CALENDAR TRANSFORMATIONS
// Store in [calendar], Display in [outputCalendar]
// ==================================================================

export const Xform_ISO_to_Japanese = createStory('Output: ISO -> Japanese', 
  { calendar: 'iso8601', outputCalendar: 'japanese' },
  'Storage: 2026-01-20, Display: Reiwa 8'
);

export const Xform_ISO_to_Hebrew = createStory('Output: ISO -> Hebrew', 
  { calendar: 'iso8601', outputCalendar: 'hebrew' },
  'Storage: 2026-01-20, Display: 2 Shevat 5786'
);

export const Xform_ISO_to_Chinese = createStory('Output: ISO -> Chinese', 
  { calendar: 'iso8601', outputCalendar: 'chinese' }
);

export const Xform_ISO_to_Persian = createStory('Output: ISO -> Persian', 
  { calendar: 'iso8601', outputCalendar: 'persian' }
);

export const Xform_ISO_to_Ethiopic = createStory('Output: ISO -> Ethiopic', 
  { calendar: 'iso8601', outputCalendar: 'ethiopic' }
);

export const Xform_Japanese_to_Gregory = createStory('Output: Japanese -> Gregory', 
  { calendar: 'japanese', outputCalendar: 'gregory' }
);

export const Xform_Hebrew_to_Gregory = createStory('Output: Hebrew -> Gregory', 
  { calendar: 'hebrew', outputCalendar: 'gregory' }
);

export const Xform_Persian_to_Gregory = createStory('Output: Persian -> Gregory', 
  { calendar: 'persian', outputCalendar: 'gregory' }
);

// ==================================================================
// 4. OPTIONS
// ==================================================================

export const Option_WeekStart_Mon = createStory('Option: Week Start Mon', 
  { calendar: 'gregory', firstDayOfWeek: 1 }
);

export const Option_WeekStart_Sat = createStory('Option: Week Start Sat', 
  { calendar: 'gregory', firstDayOfWeek: 6 }
);

export const Option_Round_Hour = createStory('Option: Round to Hour (Zoned)', 
  { calendar: 'iso8601', mode: 'zoned', timezone: 'UTC', rounding: { smallestUnit: 'hour' } }
);

// ==================================================================
// 5. COMPLEX COMBINATIONS
// ==================================================================

export const Complex_Zoned_Japanese_NY = createStory('Complex: Zoned (NY) + Japanese', 
  { calendar: 'japanese', mode: 'zoned', timezone: 'America/New_York' }
);

export const Complex_DateTime_Hebrew = createStory('Complex: DateTime + Hebrew', 
  { calendar: 'hebrew', mode: 'datetime' }
);
