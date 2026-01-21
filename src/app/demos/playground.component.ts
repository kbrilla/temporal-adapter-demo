import { Component, Injector, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { 
  provideTemporalDateAdapter
} from '@angular/material-temporal-adapter';
import type { 
  MatTemporalDateAdapterOptions, 
  TemporalCalendarId 
} from '@angular/material-temporal-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-playground-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    MatDatepickerModule, 
    MatTimepickerModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatCardModule
  ],
  template: `
    <div class="content-container">
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

        <!-- Timepicker -->
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

        <!-- Integrated Picker -->
        <mat-card *ngIf="isTimeSupported()">
          <mat-card-header><mat-card-title>Integrated Date & Time</mat-card-title></mat-card-header>
          <mat-card-content>
            <mat-form-field>
              <mat-label>Date & Time</mat-label>
              <input matInput [matDatepicker]="dpCombined" [matTimepicker]="tpCombined" [formControl]="combinedControl">
              <mat-datepicker-toggle matIconSuffix [for]="dpCombined"></mat-datepicker-toggle>
              <mat-timepicker-toggle matIconSuffix [for]="tpCombined"></mat-timepicker-toggle>
              <mat-datepicker #dpCombined></mat-datepicker>
              <mat-timepicker #tpCombined></mat-timepicker>
            </mat-form-field>
            <div class="debug-val" style="margin-top: 8px;">
              <small style="color: #666">Value: {{ combinedControl.value?.toString() }}</small>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="adapter-info">
        <h4>Adapter State</h4>
        <pre>{{ getAdapterState() | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .content-container { padding: 16px; }
    .demo-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); margin-top: 16px; }
    .adapter-info { margin-top: 24px; background: #f5f5f5; padding: 12px; border-radius: 4px; }
  `]
})
export class PlaygroundContentComponent {
  adapter = inject(DateAdapter) as any;
  combinedControl = new FormControl<any>(null);

  isTimeSupported() {
    const mode = this.adapter.customOptions?.mode;
    return mode === 'datetime' || mode === 'zoned';
  }

  getAdapterState() {
    return {
      locale: this.adapter.locale,
      calendar: this.adapter.customOptions?.calendar,
      outputCalendar: this.adapter.customOptions?.outputCalendar,
      mode: this.adapter.customOptions?.mode,
      today: this.adapter.today().toString(),
      valid: this.adapter.isValid(this.adapter.today()),
      format: this.adapter.format(this.adapter.today(), 'shortDate'),
    };
  }
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-panel">
      <ng-template #contentHost></ng-template>
    </div>
  `,
  styles: [`
    .content-panel { padding: 24px; }
  `]
})
export class PlaygroundComponent implements OnChanges {
  @Input() calendar: TemporalCalendarId = 'iso8601';
  @Input() outputCalendar?: TemporalCalendarId;
  @Input() mode: 'date' | 'datetime' | 'zoned' = 'date';
  @Input() locale: string = 'en-US';
  @Input() timezone: string = 'UTC';
  @Input() firstDayOfWeek?: number;

  @ViewChild('contentHost', { read: ViewContainerRef }) contentHost!: ViewContainerRef;
  
  private injector = inject(Injector);

  ngOnChanges(changes: SimpleChanges) {
    // Re-create content whenever inputs change
    if (this.contentHost) {
      this.applyConfig();
    }
  }

  // Also call after view init to ensure initial render
  ngAfterViewInit() {
    this.applyConfig();
  }

  applyConfig() {
    this.contentHost.clear();

    const options: MatTemporalDateAdapterOptions = {
      calendar: this.calendar,
      outputCalendar: this.outputCalendar || undefined,
      mode: this.mode,
      timezone: this.mode === 'zoned' ? this.timezone : undefined,
      firstDayOfWeek: this.firstDayOfWeek
    } as any;

    const childInjector = Injector.create({
      parent: this.injector,
      providers: [
        provideTemporalDateAdapter(undefined, options),
        { provide: MAT_DATE_LOCALE, useValue: this.locale }
      ]
    });

    this.contentHost.createComponent(PlaygroundContentComponent, { injector: childInjector });
  }
}
