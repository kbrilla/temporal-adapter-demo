import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PlaygroundComponent } from './playground.component';

import 'temporal-polyfill/global';

const meta: Meta<PlaygroundComponent> = {
  title: 'Demos/Playground',
  component: PlaygroundComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Playground

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
type Story = StoryObj<PlaygroundComponent>;

export const Default: Story = {
  name: '🛠️ Interactive Playground',
};
