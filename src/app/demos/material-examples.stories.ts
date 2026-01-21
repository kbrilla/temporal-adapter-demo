import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter } from '@angular/material-temporal-adapter';
import { MaterialExamplesComponent } from './material-examples.component';

import 'temporal-polyfill/global';

const meta: Meta<MaterialExamplesComponent> = {
  title: 'Demos/Material Components Copy',
  component: MaterialExamplesComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter()
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<MaterialExamplesComponent>;

export const Default: Story = {
  name: 'Standard Examples',
};
