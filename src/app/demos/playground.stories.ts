import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PlaygroundComponent } from './playground.component';

import 'temporal-polyfill/global';

const calendars = [
  'iso8601', 'gregory', 'japanese', 'hebrew', 'chinese', 
  'persian', 'buddhist', 'indian', 'ethiopic', 'coptic'
];

const meta: Meta<PlaygroundComponent> = {
  title: 'Demos/Playground',
  component: PlaygroundComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Interactive Playground

Use the **Controls** panel below (or on the right) to configure the Temporal Adapter dynamically.
You can mix and match:
- **Calendar Systems**
- **Modes** (Date, DateTime, Zoned)
- **Locales**
        `,
      },
    },
  },
  args: {
    calendar: 'iso8601',
    mode: 'date',
    locale: 'en-US',
    timezone: 'UTC',
  },
  argTypes: {
    calendar: {
      control: 'select',
      options: calendars,
      description: 'Internal calendar for date calculations',
    },
    outputCalendar: {
      control: 'select',
      options: [undefined, ...calendars],
      description: 'Optional output calendar for display',
    },
    mode: {
      control: 'radio',
      options: ['date', 'datetime', 'zoned'],
      description: 'Adapter mode',
    },
    locale: {
      control: 'text',
      description: 'BCP 47 locale string',
    },
    timezone: {
      control: 'text',
      if: { arg: 'mode', eq: 'zoned' },
      description: 'Timezone (only for zoned mode)',
    },
    firstDayOfWeek: {
      control: 'select',
      options: [undefined, 0, 1, 6],
      description: 'Override first day of week (0=Sun)',
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<PlaygroundComponent>;

export const Interactive: Story = {
  name: '🛠️ Interactive Playground',
};
