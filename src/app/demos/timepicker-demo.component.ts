import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { TemporalDateType } from '@angular/material-temporal-adapter';

/**
 * Demo showing timepicker with Temporal adapter (datetime mode).
 */
@Component({
  selector: 'app-timepicker-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    JsonPipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Timepicker Demo</mat-card-title>
        <mat-card-subtitle>Using Temporal.PlainDateTime</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Select a time</mat-label>
          <input matInput [matTimepicker]="picker" [formControl]="timeControl">
          <mat-timepicker-toggle matIconSuffix [for]="picker"></mat-timepicker-toggle>
          <mat-timepicker #picker></mat-timepicker>
        </mat-form-field>

        <div class="info-section">
          <h4>Selected Time:</h4>
          @if (timeControl.value) {
            <div class="time-display">
              <span class="time-value">
                {{ padZero(adapter.getHours(timeControl.value)) }}:{{ padZero(adapter.getMinutes(timeControl.value)) }}:{{ padZero(adapter.getSeconds(timeControl.value)) }}
              </span>
            </div>
            
            <h4>Time Components:</h4>
            <ul>
              <li><strong>Hours:</strong> {{ adapter.getHours(timeControl.value) }}</li>
              <li><strong>Minutes:</strong> {{ adapter.getMinutes(timeControl.value) }}</li>
              <li><strong>Seconds:</strong> {{ adapter.getSeconds(timeControl.value) }}</li>
            </ul>
          } @else {
            <p>No time selected</p>
          }
        </div>

        <div class="raw-value">
          <h4>Raw Temporal Value:</h4>
          <pre>{{ timeControl.value | json }}</pre>
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
    .time-display {
      text-align: center;
      padding: 16px;
      background: #1976d2;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .time-value {
      font-size: 32px;
      font-weight: bold;
      color: white;
      font-family: monospace;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      padding: 4px 0;
    }
    .raw-value {
      background: #fff3e0;
      padding: 16px;
      border-radius: 4px;
    }
    pre {
      background: white;
      padding: 8px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }
  `],
})
export class TimepickerDemoComponent {
  adapter = inject(DateAdapter<TemporalDateType>);
  timeControl = new FormControl(this.adapter.today());

  padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
