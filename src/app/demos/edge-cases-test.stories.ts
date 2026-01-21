import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter } from '@angular/material-temporal-adapter';
import { EdgeCasesTestComponent } from './edge-cases-test.component';

// Import Temporal polyfill
import 'temporal-polyfill/global';

const meta: Meta<EdgeCasesTestComponent> = {
  title: 'Tests/Edge Cases',
  component: EdgeCasesTestComponent,
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
# Edge Cases & Validation

This component tests boundary conditions and error handling:
- **Null/Undefined values**
- **Invalid Dates** (e.g. month 99)
- **Timezone Transitions**
- **Leap Years**
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<EdgeCasesTestComponent>;

export const Default: Story = {
  name: 'Edge Cases',
};
