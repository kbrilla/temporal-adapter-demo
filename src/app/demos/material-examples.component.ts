import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Temporal } from 'temporal-polyfill';

@Component({
  selector: 'app-material-examples',
  standalone: true,
  imports: [
    CommonModule, 
    MatDatepickerModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatCardModule,
    MatTimepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="examples-container">
      <h1>Material Components Demo Copy</h1>
      <p class="intro">These examples are adapted from the official Angular Material documentation, backed by the Temporal Date Adapter.</p>
      
      <!-- 1. Basic Datepicker -->
      <mat-card>
        <mat-card-header><mat-card-title>Basic Datepicker</mat-card-title></mat-card-header>
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

      <!-- 2. Datepicker with Min & Max Validation -->
      <mat-card>
        <mat-card-header><mat-card-title>Datepicker with Min & Max</mat-card-title></mat-card-header>
        <mat-card-content>
          <mat-form-field>
            <mat-label>Choose a date</mat-label>
            <input matInput [min]="minDate" [max]="maxDate" [matDatepicker]="picker2">
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
          </mat-form-field>
          <p>Min: {{minDate.toString()}}<br>Max: {{maxDate.toString()}}</p>
        </mat-card-content>
      </mat-card>

      <!-- 3. Date Range Picker -->
      <mat-card>
        <mat-card-header><mat-card-title>Date Range Picker</mat-card-title></mat-card-header>
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
      
      <!-- 4. Timepicker -->
       <mat-card>
        <mat-card-header><mat-card-title>Basic Timepicker</mat-card-title></mat-card-header>
        <mat-card-content>
           <mat-form-field>
            <mat-label>Pick a time</mat-label>
            <input matInput [matTimepicker]="timepicker"/>
            <mat-timepicker-toggle matIconSuffix [for]="timepicker"/>
            <mat-timepicker #timepicker/>
          </mat-form-field>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .examples-container { display: flex; flex-direction: column; gap: 24px; padding: 24px; }
    mat-card { max-width: 500px; }
    .intro { margin-bottom: 20px; color: #666; }
  `]
})
export class MaterialExamplesComponent {
  minDate = Temporal.Now.plainDateISO().subtract({ days: 7 });
  maxDate = Temporal.Now.plainDateISO().add({ days: 7 });
}
