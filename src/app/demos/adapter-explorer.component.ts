import { Component, inject, signal, computed, input, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { JsonPipe } from '@angular/common';
import { TemporalDateType } from '@angular/material-temporal-adapter';

/**
 * Interactive demo for exploring all adapter methods with controls.
 */
@Component({
  selector: 'app-adapter-explorer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatSliderModule,
    MatDividerModule,
    JsonPipe,
  ],
  template: `
    <mat-card class="explorer-card">
      <mat-card-header>
        <mat-card-title>Adapter Method Explorer</mat-card-title>
        <mat-card-subtitle>Interactive controls for all adapter operations</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <!-- Base Date Selection -->
        <section class="section">
          <h3>Base Date</h3>
          <mat-form-field appearance="outline">
            <mat-label>Select base date</mat-label>
            <input matInput [matDatepicker]="picker" [formControl]="baseDateControl">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          @if (baseDateControl.value) {
            <div class="date-info">
              <code>{{ adapter.toIso8601(baseDateControl.value) }}</code>
            </div>
          }
        </section>

        <mat-divider></mat-divider>

        <!-- Date Component Getters -->
        <section class="section">
          <h3>Date Components (Getters)</h3>
          @if (baseDateControl.value; as date) {
            <div class="grid">
              <div class="grid-item">
                <span class="label">getYear()</span>
                <span class="value">{{ adapter.getYear(date) }}</span>
              </div>
              <div class="grid-item">
                <span class="label">getMonth() (0-indexed)</span>
                <span class="value">{{ adapter.getMonth(date) }}</span>
              </div>
              <div class="grid-item">
                <span class="label">getDate()</span>
                <span class="value">{{ adapter.getDate(date) }}</span>
              </div>
              <div class="grid-item">
                <span class="label">getDayOfWeek()</span>
                <span class="value">{{ adapter.getDayOfWeek(date) }} ({{ dayNames()[adapter.getDayOfWeek(date)] }})</span>
              </div>
              <div class="grid-item">
                <span class="label">getNumDaysInMonth()</span>
                <span class="value">{{ adapter.getNumDaysInMonth(date) }}</span>
              </div>
              <div class="grid-item">
                <span class="label">getFirstDayOfWeek()</span>
                <span class="value">{{ adapter.getFirstDayOfWeek() }} ({{ dayNames()[adapter.getFirstDayOfWeek()] }})</span>
              </div>
            </div>
          }
        </section>

        <mat-divider></mat-divider>

        <!-- Calendar Arithmetic -->
        <section class="section">
          <h3>Calendar Arithmetic</h3>
          <div class="controls-row">
            <mat-form-field appearance="outline" class="amount-field">
              <mat-label>Amount</mat-label>
              <input matInput type="number" [formControl]="amountControl">
            </mat-form-field>
            <mat-form-field appearance="outline" class="unit-field">
              <mat-label>Unit</mat-label>
              <mat-select [formControl]="unitControl">
                <mat-option value="days">Days</mat-option>
                <mat-option value="months">Months</mat-option>
                <mat-option value="years">Years</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          @if (baseDateControl.value && calculatedDate()) {
            <div class="result-box">
              <div class="operation">
                {{ adapter.toIso8601(baseDateControl.value) }} 
                {{ amountControl.value >= 0 ? '+' : '' }}{{ amountControl.value }} {{ unitControl.value }}
              </div>
              <div class="result">= {{ adapter.toIso8601(calculatedDate()!) }}</div>
              <div class="formatted">{{ adapter.format(calculatedDate()!, formatOptions()) }}</div>
            </div>
          }
        </section>

        <mat-divider></mat-divider>

        <!-- Date Comparison -->
        <section class="section">
          <h3>Date Comparison</h3>
          <mat-form-field appearance="outline">
            <mat-label>Compare with</mat-label>
            <input matInput [matDatepicker]="comparePicker" [formControl]="compareDateControl">
            <mat-datepicker-toggle matIconSuffix [for]="comparePicker"></mat-datepicker-toggle>
            <mat-datepicker #comparePicker></mat-datepicker>
          </mat-form-field>
          @if (baseDateControl.value && compareDateControl.value) {
            <div class="comparison-result">
              <div class="method">
                <code>compareDate(base, compare)</code>
                <span class="value">{{ adapter.compareDate(baseDateControl.value, compareDateControl.value) }}</span>
                <span class="meaning">
                  @if (adapter.compareDate(baseDateControl.value, compareDateControl.value) < 0) {
                    (base is before compare)
                  } @else if (adapter.compareDate(baseDateControl.value, compareDateControl.value) > 0) {
                    (base is after compare)
                  } @else {
                    (same date)
                  }
                </span>
              </div>
              <div class="method">
                <code>sameDate(base, compare)</code>
                <span class="value">{{ adapter.sameDate(baseDateControl.value, compareDateControl.value) }}</span>
              </div>
            </div>
          }
        </section>

        <mat-divider></mat-divider>

        <!-- Formatting Options -->
        <section class="section">
          <h3>Format Options</h3>
          <div class="format-controls">
            <mat-form-field appearance="outline">
              <mat-label>Year format</mat-label>
              <mat-select [formControl]="yearFormatControl">
                <mat-option value="numeric">numeric (2024)</mat-option>
                <mat-option value="2-digit">2-digit (24)</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Month format</mat-label>
              <mat-select [formControl]="monthFormatControl">
                <mat-option value="numeric">numeric (1)</mat-option>
                <mat-option value="2-digit">2-digit (01)</mat-option>
                <mat-option value="short">short (Jan)</mat-option>
                <mat-option value="long">long (January)</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Day format</mat-label>
              <mat-select [formControl]="dayFormatControl">
                <mat-option value="numeric">numeric (1)</mat-option>
                <mat-option value="2-digit">2-digit (01)</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Weekday format</mat-label>
              <mat-select [formControl]="weekdayFormatControl">
                <mat-option value="">none</mat-option>
                <mat-option value="short">short (Mon)</mat-option>
                <mat-option value="long">long (Monday)</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          @if (baseDateControl.value) {
            <div class="format-result">
              <code>format(date, {{ formatOptions() | json }})</code>
              <div class="formatted-output">{{ adapter.format(baseDateControl.value, formatOptions()) }}</div>
            </div>
          }
        </section>

        <mat-divider></mat-divider>

        <!-- Parsing -->
        <section class="section">
          <h3>Parsing</h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Parse string</mat-label>
            <input matInput [formControl]="parseInputControl" placeholder="e.g., 2024-01-15">
          </mat-form-field>
          <div class="parse-result">
            @if (parsedDate(); as parsed) {
              <div class="success">
                <strong>Parsed:</strong> {{ adapter.toIso8601(parsed) }}
              </div>
            } @else if (parseInputControl.value) {
              <div class="error">
                Could not parse "{{ parseInputControl.value }}"
              </div>
            }
          </div>
        </section>

        <mat-divider></mat-divider>

        <!-- Localized Names -->
        <section class="section">
          <h3>Localized Names</h3>
          <div class="names-grid">
            <div class="names-section">
              <h4>Month Names (long)</h4>
              <div class="names-list">
                @for (name of monthNames(); track $index) {
                  <span class="name-item">{{ $index }}: {{ name }}</span>
                }
              </div>
            </div>
            <div class="names-section">
              <h4>Day Names (long)</h4>
              <div class="names-list">
                @for (name of dayNames(); track $index) {
                  <span class="name-item">{{ $index }}: {{ name }}</span>
                }
              </div>
            </div>
            <div class="names-section">
              <h4>Date Names (1-31)</h4>
              <div class="names-list compact">
                @for (name of dateNames(); track $index) {
                  <span class="name-item">{{ name }}</span>
                }
              </div>
            </div>
          </div>
        </section>

        <mat-divider></mat-divider>

        <!-- Validation -->
        <section class="section">
          <h3>Validation</h3>
          @if (baseDateControl.value) {
            <div class="validation-grid">
              <div class="validation-item">
                <code>isValid(date)</code>
                <span class="value">{{ adapter.isValid(baseDateControl.value) }}</span>
              </div>
              <div class="validation-item">
                <code>isDateInstance(date)</code>
                <span class="value">{{ adapter.isDateInstance(baseDateControl.value) }}</span>
              </div>
              <div class="validation-item">
                <code>isDateInstance("string")</code>
                <span class="value">{{ adapter.isDateInstance("not a date") }}</span>
              </div>
              <div class="validation-item">
                <code>isValid(invalid())</code>
                <span class="value">{{ adapter.isValid(adapter.invalid()) }}</span>
              </div>
            </div>
          }
        </section>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .explorer-card {
      max-width: 900px;
      margin: 20px auto;
    }
    .section {
      padding: 16px 0;
    }
    h3 {
      margin: 0 0 16px 0;
      color: #1976d2;
    }
    h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
    }
    mat-divider {
      margin: 8px 0;
    }
    .date-info code {
      background: #e3f2fd;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    .grid-item {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
    }
    .grid-item .label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }
    .grid-item .value {
      font-family: monospace;
      font-weight: 500;
    }
    .controls-row {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .amount-field {
      width: 120px;
    }
    .unit-field {
      width: 150px;
    }
    .result-box {
      background: #e8f5e9;
      padding: 16px;
      border-radius: 4px;
      margin-top: 16px;
    }
    .operation {
      font-family: monospace;
      color: #666;
    }
    .result {
      font-size: 20px;
      font-weight: bold;
      color: #2e7d32;
      margin: 8px 0;
    }
    .formatted {
      color: #666;
    }
    .comparison-result {
      background: #fff3e0;
      padding: 16px;
      border-radius: 4px;
    }
    .method {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 8px 0;
    }
    .method code {
      background: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
    }
    .method .value {
      font-weight: bold;
      font-family: monospace;
    }
    .method .meaning {
      color: #666;
      font-size: 12px;
    }
    .format-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .format-controls mat-form-field {
      width: 180px;
    }
    .format-result {
      background: #fce4ec;
      padding: 16px;
      border-radius: 4px;
      margin-top: 16px;
    }
    .format-result code {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    .formatted-output {
      font-size: 18px;
      font-weight: 500;
    }
    .full-width {
      width: 100%;
    }
    .parse-result {
      margin-top: 8px;
    }
    .parse-result .success {
      color: #2e7d32;
    }
    .parse-result .error {
      color: #c62828;
    }
    .names-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }
    .names-section {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
    }
    .names-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .names-list.compact {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .name-item {
      font-family: monospace;
      font-size: 12px;
      padding: 2px 4px;
    }
    .validation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 12px;
    }
    .validation-item {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .validation-item code {
      font-family: monospace;
      font-size: 12px;
    }
    .validation-item .value {
      font-weight: bold;
      font-family: monospace;
    }
  `],
})
export class AdapterExplorerComponent {
  adapter = inject(DateAdapter<TemporalDateType>);
  
  // Controls
  baseDateControl = new FormControl(this.adapter.today());
  compareDateControl = new FormControl<TemporalDateType | null>(null);
  amountControl = new FormControl(1);
  unitControl = new FormControl<'days' | 'months' | 'years'>('years');
  
  // Format controls
  yearFormatControl = new FormControl<'numeric' | '2-digit'>('numeric');
  monthFormatControl = new FormControl<'numeric' | '2-digit' | 'short' | 'long'>('long');
  dayFormatControl = new FormControl<'numeric' | '2-digit'>('numeric');
  weekdayFormatControl = new FormControl<'' | 'short' | 'long'>('');
  
  // Parse control
  parseInputControl = new FormControl('');
  
  // Computed values
  monthNames = signal(this.adapter.getMonthNames('long'));
  dayNames = signal(this.adapter.getDayOfWeekNames('long'));
  dateNames = signal(this.adapter.getDateNames());
  
  calculatedDate = computed(() => {
    const base = this.baseDateControl.value;
    const amount = this.amountControl.value;
    const unit = this.unitControl.value;
    
    if (!base || amount === null) return null;
    
    switch (unit) {
      case 'days':
        return this.adapter.addCalendarDays(base, amount);
      case 'months':
        return this.adapter.addCalendarMonths(base, amount);
      case 'years':
        return this.adapter.addCalendarYears(base, amount);
      default:
        return base;
    }
  });
  
  formatOptions = computed(() => {
    const options: Intl.DateTimeFormatOptions = {
      year: this.yearFormatControl.value || 'numeric',
      month: this.monthFormatControl.value || 'long',
      day: this.dayFormatControl.value || 'numeric',
    };
    if (this.weekdayFormatControl.value) {
      options.weekday = this.weekdayFormatControl.value;
    }
    return options;
  });
  
  parsedDate = computed(() => {
    const input = this.parseInputControl.value;
    if (!input) return null;
    return this.adapter.parse(input, null);
  });
}
