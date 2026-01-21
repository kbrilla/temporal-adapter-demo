import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter, MAT_TEMPORAL_DATETIME_FORMATS } from '@angular/material-temporal-adapter';
import { TimepickerDemoComponent } from './timepicker-demo.component';
import { within, expect } from 'storybook/test';

// Import Temporal polyfill
import 'temporal-polyfill/global';

const meta: Meta<TimepickerDemoComponent> = {
  title: 'Demos/Timepicker',
  component: TimepickerDemoComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(MAT_TEMPORAL_DATETIME_FORMATS, { mode: 'datetime' }),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
# Timepicker Demo

This demo shows the timepicker working with Temporal in \`datetime\` mode.

## DateTime Mode

When using timepicker, configure the adapter in \`datetime\` mode:

\`\`\`typescript
provideTemporalDateAdapter(MAT_TEMPORAL_DATETIME_FORMATS, { 
  mode: 'datetime' 
})
\`\`\`

This uses \`Temporal.PlainDateTime\` which includes both date and time components.

## Time Methods Demonstrated

- \`getHours()\` - Get hour component (0-23)
- \`getMinutes()\` - Get minute component (0-59)
- \`getSeconds()\` - Get second component (0-59)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TimepickerDemoComponent>;

export const Default: Story = {
  name: 'Basic Timepicker (DateTime Mode)',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(MAT_TEMPORAL_DATETIME_FORMATS, { mode: 'datetime' }),
      ],
    }),
  ],
};

export const ZonedMode: Story = {
  name: 'Zoned Mode (UTC)',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(MAT_TEMPORAL_DATETIME_FORMATS, { mode: 'zoned', timezone: 'UTC' }),
      ],
    }),
  ],
};

export const DateMode: Story = {
  name: 'Date Mode (Validation Check)',
  parameters: {
    docs: {
      description: {
        story: 'In `date` mode, `setTime` is strict and will warn/reject changes. Expect time selection to be ineffective or warn in console.'
      }
    }
  },
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(undefined, { mode: 'date' }),
      ],
    }),
  ],
};

export const InteractiveTest: Story = {
  name: 'Verify Time Components',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(MAT_TEMPORAL_DATETIME_FORMATS, { mode: 'datetime' }),
      ],
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Selected Time:')).toBeInTheDocument();
    expect(canvas.getByText('Time Components:')).toBeInTheDocument();
    expect(canvas.getByText(/Hours:/)).toBeInTheDocument();
  },
};
