import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { TemporalDateType } from '@angular/material-temporal-adapter';

// Polyfill import to ensure globals are available for helper logic (though story imports it too)
import 'temporal-polyfill/global';

/**
 * Datepicker demo showing the Temporal adapter in action.
 */
@Component({
  selector: 'app-datepicker-demo',
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
        <mat-card-title>Temporal Datepicker Demo</mat-card-title>
        <mat-card-subtitle>Using Temporal.PlainDate</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Select a date</mat-label>
          <input matInput [matDatepicker]="picker" [formControl]="dateControl">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker [startView]="startView"></mat-datepicker>
        </mat-form-field>

        <div class="info-section">
          <h4>Selected Value:</h4>
          <pre>{{ dateControl.value | json }}</pre>
          
          @if (dateControl.value) {
            <h4>Adapter Methods:</h4>
            <ul>
              <li><strong>Year:</strong> {{ adapter.getYear(dateControl.value) }}</li>
              <li><strong>Month (0-indexed):</strong> {{ adapter.getMonth(dateControl.value) }}</li>
              <li><strong>Day:</strong> {{ adapter.getDate(dateControl.value) }}</li>
              <li><strong>Day of Week:</strong> {{ adapter.getDayOfWeek(dateControl.value) }}</li>
              <li><strong>ISO String:</strong> {{ adapter.toIso8601(dateControl.value) }}</li>
              <li><strong>Is Valid:</strong> {{ adapter.isValid(dateControl.value) }}</li>
            </ul>
          }
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
      margin-bottom: 16px;
    }
    .info-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin-top: 16px;
    }
    pre {
      background: #e0e0e0;
      padding: 8px;
      border-radius: 4px;
      overflow-x: auto;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      padding: 4px 0;
    }
  `],
})
export class DatepickerDemoComponent implements OnInit, OnChanges {
  adapter = inject(DateAdapter);
  dateControl = new FormControl<TemporalDateType>(null);
  
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';
  @Input() initialValue: any;

  ngOnInit() {
    this._setInitialValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue']) {
      this._setInitialValue();
    }
  }

  private _setInitialValue() {
    if (this.initialValue !== undefined && this.initialValue !== null && this.initialValue !== '') {
       if (typeof this.initialValue === 'string') {
           try {
             // Heuristic parsing for demo comfort
             if (this.initialValue.includes('[')) {
                this.dateControl.setValue(Temporal.ZonedDateTime.from(this.initialValue));
             } else if (this.initialValue.includes('T')) {
                this.dateControl.setValue(Temporal.PlainDateTime.from(this.initialValue));
             } else {
                this.dateControl.setValue(Temporal.PlainDate.from(this.initialValue));
             }
           } catch (e) {
             console.warn('Failed to parse initial value', e);
           }
       } else {
         this.dateControl.setValue(this.initialValue);
       }
    }
  }
}
