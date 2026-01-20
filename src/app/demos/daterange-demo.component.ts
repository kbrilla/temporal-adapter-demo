import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { TemporalDateType } from '@angular/material-temporal-adapter';

/**
 * Demo showing date range picker with Temporal adapter.
 */
@Component({
  selector: 'app-daterange-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    JsonPipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Date Range Picker Demo</mat-card-title>
        <mat-card-subtitle>Select start and end dates</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Enter a date range</mat-label>
          <mat-date-range-input [rangePicker]="rangePicker">
            <input matStartDate [formControl]="startDate" placeholder="Start date">
            <input matEndDate [formControl]="endDate" placeholder="End date">
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="rangePicker"></mat-datepicker-toggle>
          <mat-date-range-picker #rangePicker></mat-date-range-picker>
        </mat-form-field>

        <div class="info-section">
          <h4>Selected Range:</h4>
          <div class="range-info">
            <div class="date-box">
              <span class="label">Start:</span>
              <span class="value">{{ startDate.value ? formatDate(startDate.value) : 'Not selected' }}</span>
            </div>
            <div class="date-box">
              <span class="label">End:</span>
              <span class="value">{{ endDate.value ? formatDate(endDate.value) : 'Not selected' }}</span>
            </div>
          </div>

          @if (startDate.value && endDate.value) {
            <div class="duration">
              <h4>Duration:</h4>
              <p>{{ calculateDuration() }} days</p>
            </div>
          }
        </div>

        <div class="raw-values">
          <h4>Raw Temporal Values:</h4>
          <pre>Start: {{ startDate.value | json }}</pre>
          <pre>End: {{ endDate.value | json }}</pre>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      max-width: 500px;
      margin: 20px auto;
    }
    mat-form-field {
      width: 100%;
    }
    .info-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    }
    .range-info {
      display: flex;
      gap: 16px;
    }
    .date-box {
      flex: 1;
      background: white;
      padding: 12px;
      border-radius: 4px;
      text-align: center;
    }
    .label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }
    .value {
      font-weight: 500;
      font-family: monospace;
    }
    .duration {
      margin-top: 16px;
      text-align: center;
    }
    .duration p {
      font-size: 24px;
      font-weight: bold;
      color: #1976d2;
      margin: 8px 0;
    }
    .raw-values {
      background: #e8f5e9;
      padding: 16px;
      border-radius: 4px;
    }
    pre {
      background: white;
      padding: 8px;
      border-radius: 4px;
      margin: 8px 0;
      overflow-x: auto;
      font-size: 12px;
    }
  `],
})
export class DateRangeDemoComponent {
  adapter = inject(DateAdapter<TemporalDateType>);
  
  startDate = new FormControl<TemporalDateType | null>(null);
  endDate = new FormControl<TemporalDateType | null>(null);

  formatDate(date: TemporalDateType): string {
    return this.adapter.format(date, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  calculateDuration(): number {
    if (!this.startDate.value || !this.endDate.value) return 0;
    
    // Calculate difference in days using adapter methods
    let days = 0;
    let current = this.adapter.clone(this.startDate.value);
    const end = this.endDate.value;
    
    while (this.adapter.compareDate(current, end) < 0) {
      days++;
      current = this.adapter.addCalendarDays(current, 1);
    }
    
    return days;
  }
}
