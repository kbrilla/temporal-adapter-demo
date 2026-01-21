import { Component, Injector, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { 
  MAT_TEMPORAL_DATE_ADAPTER_OPTIONS, 
  provideTemporalDateAdapter, 
  TemporalCalendarId 
} from '@angular/material-temporal-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

// The content component that displays the datepickers
// This will be dynamically created with a specific adapter configuration
@Component({
  selector: 'app-playground-content',
  standalone: true,
  imports: [
    CommonModule, 
    MatDatepickerModule, 
    MatTimepickerModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatCardModule
  ],
  template: `
    <div class="content-container">
      <h3>Current Configuration</h3>
      <div class="config-display">
        <span class="badgem badge-cal">📅 {{ adapter.customOptions?.calendar }}</span>
        @if (adapter.customOptions?.outputCalendar) {
          <span class="badge badge-out">🔄 {{ adapter.customOptions?.outputCalendar }}</span>
        }
        <span class="badge badge-mode">⚙️ {{ adapter.customOptions?.mode || 'date' }}</span>
        <span class="badge badge-loc">🌍 {{ getLocale() }}</span>
      </div>

      <div class="demo-grid">
        <!-- Datepicker -->
        <mat-card>
          <mat-card-header><mat-card-title>Datepicker</mat-card-title></mat-card-header>
          <mat-card-content>
            <mat-form-field>
              <mat-label>Choose a date</mat-label>
              <input matInput [matDatepicker]="picker">
              <mat-hint>MM/DD/YYYY</mat-hint>
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- Range Picker -->
        <mat-card>
          <mat-card-header><mat-card-title>Date Range</mat-card-title></mat-card-header>
          <mat-card-content>
            <mat-form-field>
              <mat-label>Enter a date range</mat-label>
              <mat-date-range-input [rangePicker]="rangePicker">
                <input matStartDate placeholder="Start date">
                <input matEndDate placeholder="End date">
              </mat-date-range-input>
              <mat-hint>MM/DD/YYYY – MM/DD/YYYY</mat-hint>
              <mat-datepicker-toggle matIconSuffix [for]="rangePicker"></mat-datepicker-toggle>
              <mat-date-range-picker #rangePicker></mat-date-range-picker>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- Timepicker (only relevant if mode allows?) -->
         <!-- Note: Material Timepicker is experimental/new in strict Angular Material, 
              but the adapter supports it. If matched version exists. -->
        <mat-card *ngIf="isTimeSupported()">
          <mat-card-header><mat-card-title>Timepicker</mat-card-title></mat-card-header>
          <mat-card-content>
            <mat-form-field>
              <mat-label>Choose time</mat-label>
              <input matInput [matTimepicker]="timepicker">
              <mat-timepicker-toggle matIconSuffix [for]="timepicker"></mat-timepicker-toggle>
              <mat-timepicker #timepicker></mat-timepicker>
            </mat-form-field>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="adapter-info">
        <h4>Adapter Info</h4>
        <pre>{{ getAdapterState() | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .content-container { padding: 16px; }
    .demo-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); margin-top: 16px; }
    .config-display { display: flex; gap: 8px; flex-wrap: wrap; }
    .badge { padding: 4px 8px; border-radius: 4px; background: #eee; font-size: 12px; }
    .badge-cal { background: #e3f2fd; color: #0d47a1; }
    .badge-out { background: #fff3e0; color: #e65100; }
    .badge-mode { background: #e8f5e9; color: #1b5e20; }
    .adapter-info { margin-top: 24px; background: #f5f5f5; padding: 12px; border-radius: 4px; }
  `]
})
export class PlaygroundContentComponent {
  // We allow 'any' cast to access internal options for display
  adapter = inject(DateAdapter) as any;

  getLocale() {
    return this.adapter.locale;
  }

  isTimeSupported() {
    return this.adapter.customOptions?.mode === 'datetime' || this.adapter.customOptions?.mode === 'zoned';
  }

  getAdapterState() {
    return {
      today: this.adapter.today().toString(),
      valid: this.adapter.isValid(this.adapter.today()),
      format: this.adapter.format(this.adapter.today(), 'shortDate'),
    };
  }
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatSlideToggleModule, 
    MatButtonModule, 
    MatExpansionModule
  ],
  template: `
    <div class="playground-layout">
      <!-- Sidebar Controls -->
      <mat-card class="controls-panel">
        <mat-card-header>
          <mat-card-title>Configuration</mat-card-title>
        </mat-card-header>
        <mat-card-content [formGroup]="configForm">
          
          <mat-accordion multi>
            <mat-expansion-panel expanded>
              <mat-expansion-panel-header>Adapter Options</mat-expansion-panel-header>
              
              <mat-form-field class="full-width">
                <mat-label>Calendar</mat-label>
                <mat-select formControlName="calendar">
                  @for (cal of calendars; track cal) { <mat-option [value]="cal">{{cal}}</mat-option> }
                </mat-select>
              </mat-form-field>

              <mat-form-field class="full-width">
                <mat-label>Output Calendar</mat-label>
                <mat-select formControlName="outputCalendar">
                  <mat-option [value]="null">Same as Calendar</mat-option>
                  @for (cal of calendars; track cal) { <mat-option [value]="cal">{{cal}}</mat-option> }
                </mat-select>
              </mat-form-field>

              <mat-form-field class="full-width">
                <mat-label>Mode</mat-label>
                <mat-select formControlName="mode">
                  <mat-option value="date">Date (PlainDate)</mat-option>
                  <mat-option value="datetime">DateTime (PlainDateTime)</mat-option>
                  <mat-option value="zoned">Zoned (ZonedDateTime)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field class="full-width">
                <mat-label>Locale</mat-label>
                <input matInput formControlName="locale" placeholder="e.g. en-US, ja-JP">
              </mat-form-field>

              @if (configForm.get('mode')?.value === 'zoned') {
                <mat-form-field class="full-width">
                  <mat-label>Timezone</mat-label>
                  <input matInput formControlName="timezone">
                </mat-form-field>
              }

              <mat-form-field class="full-width">
                 <mat-label>First Day (0=Sun, 1=Mon)</mat-label>
                 <mat-select formControlName="firstDayOfWeek">
                   <mat-option [value]="null">Auto (Locale)</mat-option>
                   <mat-option [value]="0">Sunday (0)</mat-option>
                   <mat-option [value]="1">Monday (1)</mat-option>
                   <mat-option [value]="6">Saturday (6)</mat-option>
                 </mat-select>
              </mat-form-field>

            </mat-expansion-panel>
          </mat-accordion>

          <div class="actions">
            <button mat-raised-button color="primary" (click)="applyConfig()">
              Apply Configuration
            </button>
          </div>

        </mat-card-content>
      </mat-card>

      <!-- Main Content Area -->
      <div class="content-panel">
        <ng-template #contentHost></ng-template>
        @if (!hasContent) {
          <div class="placeholder">Click "Apply Configuration" to load the playground.</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .playground-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .controls-panel {
      width: 350px;
      height: 100%;
      overflow-y: auto;
      border-right: 1px solid #e0e0e0;
      border-radius: 0;
    }
    .content-panel {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: #fafafa;
    }
    .full-width { width: 100%; margin-bottom: 8px; }
    .actions { margin-top: 16px; }
    .placeholder { 
      display: flex; justify-content: center; align-items: center; 
      height: 100%; color: #999; 
    }
  `]
})
export class PlaygroundComponent implements OnInit {
  calendars: TemporalCalendarId[] = [
    'iso8601', 'gregory', 'japanese', 'hebrew', 'chinese', 
    'persian', 'buddhist', 'indian', 'ethiopic', 'coptic'
  ];

  configForm = inject(FormBuilder).group({
    calendar: ['iso8601'],
    outputCalendar: [null],
    mode: ['date'],
    locale: ['en-US'],
    timezone: ['UTC'],
    firstDayOfWeek: [null]
  });

  @ViewChild('contentHost', { read: ViewContainerRef }) contentHost!: ViewContainerRef;
  
  hasContent = false;
  private injector = inject(Injector);

  ngOnInit() {
    // Initial load
     setTimeout(() => this.applyConfig());
  }

  applyConfig() {
    if (!this.contentHost) return;

    this.contentHost.clear();
    const val = this.configForm.value;

    const options = {
      calendar: val.calendar as TemporalCalendarId,
      outputCalendar: val.outputCalendar as TemporalCalendarId || undefined,
      mode: val.mode as any,
      timezone: val.timezone || undefined,
      firstDayOfWeek: val.firstDayOfWeek === null ? undefined : Number(val.firstDayOfWeek)
    };

    // Create a new injector with the adapter configured via these options
    const childInjector = Injector.create({
      parent: this.injector,
      providers: [
        provideTemporalDateAdapter(undefined, options),
        { provide: MAT_DATE_LOCALE, useValue: val.locale || 'en-US' }
      ]
    });

    this.contentHost.createComponent(PlaygroundContentComponent, { injector: childInjector });
    this.hasContent = true;
  }
}
