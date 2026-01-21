import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTemporalDateAdapter, MAT_TEMPORAL_DATETIME_FORMATS } from '@angular/material-temporal-adapter';
import { AdapterExplorerComponent } from './adapter-explorer.component';
import { within, userEvent, expect } from 'storybook/test';

// Import Temporal polyfill
import 'temporal-polyfill/global';

const meta: Meta<AdapterExplorerComponent> = {
  title: 'Tests/Explorer',
  component: AdapterExplorerComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideTemporalDateAdapter(),
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Adapter Explorer

An exploratory component to test basic adapter functionality.
Consider using the **Master Playground** for a more comprehensive interactive experience.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<AdapterExplorerComponent>;

export const Default: Story = {
  name: 'Date Mode',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter()
      ],
    }),
  ]
};

export const DateTimeMode: Story = {
  name: 'DateTime Mode',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(MAT_TEMPORAL_DATETIME_FORMATS, {mode: 'datetime'})
      ],
    }),
  ]
};

export const ZonedDSTGapReject: Story = {
  name: 'Zoned Mode (DST Gap: Reject)',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(MAT_TEMPORAL_DATETIME_FORMATS, { 
          mode: 'zoned', 
          timezone: 'America/New_York',
          disambiguation: 'reject'
        }),
      ],
    }),
  ],
  parameters: {
      docs: {
        story: 'Configured to REJECT invalid times during DST transitions (spring forward gaps).'
      }
  }
};

export const ZonedDSTGapCompatible: Story = {
  name: 'Zoned Mode (DST Gap: Compatible)',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(MAT_TEMPORAL_DATETIME_FORMATS, { 
          mode: 'zoned', 
          timezone: 'America/New_York',
          disambiguation: 'compatible'
        }),
      ],
    }),
  ],
};

export const ComprehensiveTestSuite: Story = {
  name: 'Comprehensive Test Suite',
  decorators: [
    applicationConfig({
      providers: [
        provideTemporalDateAdapter(MAT_TEMPORAL_DATETIME_FORMATS, { mode: 'date' }),
      ],
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // --- Test 1: Base Date & Getters (Leap Year) ---
    const inputs = canvas.getAllByRole('textbox');
    const baseDateInput = inputs[0]; 
    
    // Set 2024-01-31
    await userEvent.clear(baseDateInput);
    await userEvent.type(baseDateInput, '2024-01-31');
    await userEvent.tab();
    
    // Verify getters: getYear() -> 2024
    expect(await canvas.findByText('2024')).toBeInTheDocument();
    
    // --- Test 2: Arithmetic (Overflow) ---
    // Set Amount 1 (inputs[1])
    const amountInput = inputs[1]; 
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '1');
    await userEvent.tab();

    // Verify comparison basics
    const compareInput = inputs[2]; // compare date
    await userEvent.clear(compareInput);
    await userEvent.type(compareInput, '2024-02-01');
    await userEvent.tab();
    
    // Verify -1 (base < compare)
    const comparisonSection = canvas.getByText('compareDate(base, compare)').closest('.method');
    expect(comparisonSection).toHaveTextContent('-1');
  },
};

