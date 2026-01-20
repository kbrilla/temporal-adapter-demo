import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MasterPlaygroundComponent } from './master-playground.component';

import 'temporal-polyfill/global';

const meta: Meta<MasterPlaygroundComponent> = {
  title: 'Demos/Master Playground',
  component: MasterPlaygroundComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Master Playground

A dynamic playground that allows re-configuring the **TemporalDateAdapter** at runtime.

Use the side panel to change:
- Calendar System
- Output Calendar
- Mode (Date/DateTime/Zoned)
- Locale
- Timezone
- First Day of Week

The playground uses a **Child Injector** pattern to re-instantiate the components with a fresh adapter configuration.
        `,
      },
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
type Story = StoryObj<MasterPlaygroundComponent>;

export const Default: Story = {
  name: '🛠️ Interactive Playground',
};
