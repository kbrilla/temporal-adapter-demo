import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { TemporalDateType } from '@angular/material-temporal-adapter';

// Polyfill import
import 'temporal-polyfill/global';

/**
 * Debug component for testing Japanese calendar date selection.
 */
@Component({
  selector: 'app-japanese-calendar-debug',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    JsonPipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Japanese Calendar Debug</mat-card-title>
        <mat-card-subtitle>Testing date selection with Japanese calendar</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <h3>Adapter Diagnostics:</h3>
        <div class="diagnostics">
          <p><strong>Adapter Type:</strong> {{ adapter.constructor.name }}</p>
          <p><strong>Today:</strong> {{ todayStr }}</p>
          <p><strong>Today ISO:</strong> {{ todayIso }}</p>
          <p><strong>getYear(today):</strong> {{ todayYear }}</p>
          <p><strong>getMonth(today):</strong> {{ todayMonth }}</p>
          <p><strong>getDate(today):</strong> {{ todayDay }}</p>
          <p><strong>getNumDaysInMonth(today):</strong> {{ daysInMonth }}</p>
          <p><strong>getMonthNames('short'):</strong></p>
          <pre>{{ monthNames | json }}</pre>
          <p><strong>getDateNames() length:</strong> {{ dateNamesLength }}</p>
          <p><strong>getDayOfWeekNames('narrow'):</strong></p>
          <pre>{{ dayOfWeekNames | json }}</pre>
        </div>

        <h3>Test: Datepicker</h3>
        <mat-form-field appearance="outline">
          <mat-label>Select a date</mat-label>
          <input matInput [matDatepicker]="picker" [formControl]="dateControl">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <div class="debug-info">
          <h4>FormControl Value:</h4>
          <pre>{{ dateControl.value | json }}</pre>
          <p><strong>Type:</strong> {{ getValueType() }}</p>
          <p><strong>Is Valid:</strong> {{ dateControl.value ? adapter.isValid(dateControl.value) : 'N/A' }}</p>
          
          @if (dateControl.value) {
            <h4>Adapter Methods on Selected Value:</h4>
            <ul>
              <li><strong>getYear():</strong> {{ adapter.getYear(dateControl.value) }}</li>
              <li><strong>getMonth():</strong> {{ adapter.getMonth(dateControl.value) }}</li>
              <li><strong>getDate():</strong> {{ adapter.getDate(dateControl.value) }}</li>
              <li><strong>toIso8601():</strong> {{ adapter.toIso8601(dateControl.value) }}</li>
            </ul>
          }
        </div>

        <h3>Test 2: Manual Date Creation</h3>
        <button mat-raised-button (click)="createTestDate()">Create 2025-01-15</button>
        <button mat-raised-button (click)="createTodayDate()">Set Today</button>
        
        @if (testDate) {
          <div class="debug-info">
            <h4>Manually Created Date:</h4>
            <pre>{{ testDate | json }}</pre>
            <p><strong>toString():</strong> {{ testDateStr }}</p>
          </div>
        }

        <h3>Test 3: Value Change Events</h3>
        <div class="event-log">
          @for (event of eventLog; track $index) {
            <div class="event">{{ event }}</div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      max-width: 700px;
      margin: 20px auto;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    .debug-info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    }
    pre {
      background: #e0e0e0;
      padding: 8px;
      border-radius: 4px;
      overflow-x: auto;
      max-height: 150px;
    }
    button {
      margin-right: 8px;
      margin-bottom: 16px;
    }
    .event-log {
      background: #1e1e1e;
      color: #0f0;
      font-family: monospace;
      font-size: 12px;
      padding: 8px;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
    }
    .event {
      padding: 2px 0;
    }
  `],
})
export class JapaneseCalendarDebugComponent implements OnInit {
  adapter = inject(DateAdapter) as DateAdapter<TemporalDateType>;
  dateControl = new FormControl<TemporalDateType | null>(null);
  testDate: TemporalDateType | null = null;
  testDateStr = '';
  todayStr = '';
  todayIso = '';
  todayYear = 0;
  todayMonth = 0;
  todayDay = 0;
  daysInMonth = 0;
  monthNames: string[] = [];
  dateNamesLength = 0;
  dayOfWeekNames: string[] = [];
  eventLog: string[] = [];

  ngOnInit() {
    // Log adapter info
    const today = this.adapter.today();
    this.todayStr = today.toString();
    this.todayIso = this.adapter.toIso8601(today);
    this.todayYear = this.adapter.getYear(today);
    this.todayMonth = this.adapter.getMonth(today);
    this.todayDay = this.adapter.getDate(today);
    this.daysInMonth = this.adapter.getNumDaysInMonth(today);
    this.monthNames = this.adapter.getMonthNames('short');
    this.dateNamesLength = this.adapter.getDateNames().length;
    this.dayOfWeekNames = this.adapter.getDayOfWeekNames('narrow');
    
    this.log(`Adapter initialized. Today: ${this.todayStr}`);
    this.log(`  - Year: ${this.todayYear}, Month: ${this.todayMonth}, Day: ${this.todayDay}`);
    this.log(`  - Days in month: ${this.daysInMonth}`);
    this.log(`  - Month names count: ${this.monthNames.length}`);
    this.log(`  - Date names count: ${this.dateNamesLength}`);
    this.log(`  - Day of week names: ${this.dayOfWeekNames.join(', ')}`);

    // Subscribe to value changes
    this.dateControl.valueChanges.subscribe(value => {
      if (value) {
        this.log(`Value changed: ${value.toString()}`);
        this.log(`  - getYear: ${this.adapter.getYear(value)}`);
        this.log(`  - getMonth: ${this.adapter.getMonth(value)}`);
        this.log(`  - getDate: ${this.adapter.getDate(value)}`);
        this.log(`  - isValid: ${this.adapter.isValid(value)}`);
      } else {
        this.log('Value changed to null');
      }
    });
  }

  getValueType(): string {
    const val = this.dateControl.value;
    if (!val) return 'null';
    return val.constructor?.name || typeof val;
  }

  createTestDate() {
    this.log('Creating date: createDate(2025, 0, 15)');
    try {
      this.testDate = this.adapter.createDate(2025, 0, 15);
      this.testDateStr = this.testDate.toString();
      this.log(`Success: ${this.testDateStr}`);
      this.dateControl.setValue(this.testDate);
    } catch (e: any) {
      this.log(`ERROR: ${e.message}`);
    }
  }

  createTodayDate() {
    this.log('Setting today');
    try {
      const today = this.adapter.today();
      this.testDate = today;
      this.testDateStr = today.toString();
      this.log(`Success: ${this.testDateStr}`);
      this.dateControl.setValue(today);
    } catch (e: any) {
      this.log(`ERROR: ${e.message}`);
    }
  }

  private log(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    this.eventLog.unshift(`[${timestamp}] ${message}`);
    if (this.eventLog.length > 50) {
      this.eventLog.pop();
    }
  }
}
