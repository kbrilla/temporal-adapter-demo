import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { TemporalDateType } from '@angular/material-temporal-adapter';

/**
 * Demo showing calendar arithmetic operations with Temporal adapter.
 */
@Component({
  selector: 'app-calendar-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    JsonPipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Calendar Arithmetic Demo</mat-card-title>
        <mat-card-subtitle>Add/subtract days, months, years</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Base date</mat-label>
          <input matInput [matDatepicker]="picker" [formControl]="dateControl">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        @if (dateControl.value) {
          <div class="operations">
            <h4>Calendar Operations:</h4>
            
            <div class="operation-row">
              <span class="label">+7 days:</span>
              <span class="result">{{ formatDate(addDays(dateControl.value, 7)) }}</span>
            </div>
            
            <div class="operation-row">
              <span class="label">-7 days:</span>
              <span class="result">{{ formatDate(addDays(dateControl.value, -7)) }}</span>
            </div>
            
            <div class="operation-row">
              <span class="label">+1 month:</span>
              <span class="result">{{ formatDate(addMonths(dateControl.value, 1)) }}</span>
            </div>
            
            <div class="operation-row">
              <span class="label">-1 month:</span>
              <span class="result">{{ formatDate(addMonths(dateControl.value, -1)) }}</span>
            </div>
            
            <div class="operation-row">
              <span class="label">+1 year:</span>
              <span class="result">{{ formatDate(addYears(dateControl.value, 1)) }}</span>
            </div>
            
            <div class="operation-row">
              <span class="label">-1 year:</span>
              <span class="result">{{ formatDate(addYears(dateControl.value, -1)) }}</span>
            </div>
          </div>

          <div class="info-section">
            <h4>Month Info:</h4>
            <ul>
              <li><strong>Days in month:</strong> {{ adapter.getNumDaysInMonth(dateControl.value) }}</li>
              <li><strong>First day of week:</strong> {{ getDayName(adapter.getFirstDayOfWeek()) }}</li>
            </ul>
          </div>
        }
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
    .operations {
      background: #e3f2fd;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    }
    .operation-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #bbdefb;
    }
    .operation-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 500;
    }
    .result {
      font-family: monospace;
    }
    .info-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      padding: 4px 0;
    }
  `],
})
export class CalendarDemoComponent {
  adapter = inject(DateAdapter<TemporalDateType>);
  dateControl = new FormControl(this.adapter.today());

  private dayNames = this.adapter.getDayOfWeekNames('long');

  addDays(date: TemporalDateType, days: number): TemporalDateType {
    return this.adapter.addCalendarDays(date, days);
  }

  addMonths(date: TemporalDateType, months: number): TemporalDateType {
    return this.adapter.addCalendarMonths(date, months);
  }

  addYears(date: TemporalDateType, years: number): TemporalDateType {
    return this.adapter.addCalendarYears(date, years);
  }

  formatDate(date: TemporalDateType): string {
    return this.adapter.format(date, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getDayName(dayIndex: number): string {
    return this.dayNames[dayIndex];
  }
}
