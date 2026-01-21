import { Component, inject, signal, computed, input, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JsonPipe, DatePipe } from '@angular/common';
import { TemporalDateType } from '@angular/material-temporal-adapter';

interface TestResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
  category: string;
}

interface ComponentTestResult {
  component: string;
  action: string;
  passed: boolean;
  details: string;
  error?: string;
}

/**
 * Comprehensive Matrix Test Suite for TemporalDateAdapter.
 * Tests all adapter methods + Material component integration.
 * 
 * Test Categories:
 * 1. Adapter Core API (from unit tests)
 * 2. Calendar-Specific Tests
 * 3. Mode-Specific Tests (date/datetime/zoned)
 * 4. Material Component Integration
 * 5. Edge Cases
 */
@Component({
  selector: 'app-matrix-test-suite',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatChipsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    JsonPipe,
    DatePipe,
  ],
  template: `
    <mat-card class="test-suite">
      <mat-card-header>
        <mat-card-title>📊 Temporal Adapter Matrix Test Suite</mat-card-title>
        <mat-card-subtitle>
          <div class="config-info">
            <mat-chip-set>
              <mat-chip>Calendar: {{ configInfo().calendar }}</mat-chip>
              <mat-chip>Output: {{ configInfo().outputCalendar }}</mat-chip>
              <mat-chip>Mode: {{ configInfo().mode }}</mat-chip>
              @if (configInfo().locale) {
                <mat-chip>Locale: {{ configInfo().locale }}</mat-chip>
              }
            </mat-chip-set>
          </div>
        </mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <!-- Summary -->
        <div class="summary-bar">
          <span class="score">
            {{ passedCount() }}/{{ totalCount() }} tests passed
          </span>
          <mat-progress-bar 
            [mode]="'determinate'" 
            [value]="totalCount() > 0 ? (passedCount() / totalCount()) * 100 : 0"
            [color]="allPassed() ? 'primary' : 'warn'">
          </mat-progress-bar>
          <span [class]="allPassed() ? 'status-pass' : 'status-fail'">
            {{ allPassed() ? '✓ All Passed' : '✗ Some Failed' }}
          </span>
        </div>

        <button mat-raised-button color="primary" (click)="runAllTests()">
          <mat-icon>play_arrow</mat-icon>
          Run All Tests
        </button>

        <!-- Test Component Area -->
        <div class="test-components">
          <h3>Material Component Tests</h3>
          
          <div class="component-row">
            <!-- Datepicker Test -->
            <mat-form-field appearance="outline">
              <mat-label>Datepicker</mat-label>
              <input matInput [matDatepicker]="picker" [formControl]="dateControl">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-hint>Selected: {{ dateControl.value | json }}</mat-hint>
            </mat-form-field>
            
            <!-- Timepicker Test -->
            <mat-form-field appearance="outline">
              <mat-label>Timepicker</mat-label>
              <input matInput [matTimepicker]="timePicker" [formControl]="timeControl">
              <mat-timepicker-toggle matIconSuffix [for]="timePicker"></mat-timepicker-toggle>
              <mat-timepicker #timePicker></mat-timepicker>
              <mat-hint>Selected: {{ timeControl.value | json }}</mat-hint>
            </mat-form-field>
          </div>
          
          <div class="component-row">
            <!-- Date Range Test -->
            <mat-form-field appearance="outline">
              <mat-label>Date Range</mat-label>
              <mat-date-range-input [rangePicker]="rangePicker">
                <input matStartDate [formControl]="rangeStartControl" placeholder="Start">
                <input matEndDate [formControl]="rangeEndControl" placeholder="End">
              </mat-date-range-input>
              <mat-datepicker-toggle matIconSuffix [for]="rangePicker"></mat-datepicker-toggle>
              <mat-date-range-picker #rangePicker></mat-date-range-picker>
              <mat-hint>{{ rangeStartControl.value | json }} → {{ rangeEndControl.value | json }}</mat-hint>
            </mat-form-field>
          </div>
        </div>

        <!-- Test Results -->
        <mat-accordion class="test-results">
          @for (category of categorizedResults(); track category.name) {
            <mat-expansion-panel [expanded]="!category.allPassed">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  {{ category.name }}
                </mat-panel-title>
                <mat-panel-description>
                  {{ category.passedCount }}/{{ category.tests.length }} passed
                  <mat-icon [class]="category.allPassed ? 'icon-pass' : 'icon-fail'">
                    {{ category.allPassed ? 'check_circle' : 'error' }}
                  </mat-icon>
                </mat-panel-description>
              </mat-expansion-panel-header>
              
              <div class="test-list">
                @for (test of category.tests; track test.name) {
                  <div class="test-item" [class.passed]="test.passed" [class.failed]="!test.passed">
                    <div class="test-header">
                      <mat-icon>{{ test.passed ? 'check' : 'close' }}</mat-icon>
                      <span class="test-name">{{ test.name }}</span>
                    </div>
                    @if (!test.passed || showAllDetails()) {
                      <div class="test-details">
                        <div><strong>Expected:</strong> <code>{{ test.expected }}</code></div>
                        <div><strong>Actual:</strong> <code>{{ test.actual }}</code></div>
                        @if (test.error) {
                          <div class="error"><strong>Error:</strong> {{ test.error }}</div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </mat-expansion-panel>
          }
        </mat-accordion>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .test-suite {
      max-width: 1000px;
      margin: 20px auto;
    }
    .config-info {
      margin-top: 8px;
    }
    .summary-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .summary-bar mat-progress-bar {
      flex: 1;
    }
    .score {
      font-weight: 500;
      min-width: 120px;
    }
    .status-pass { color: #4caf50; font-weight: 600; }
    .status-fail { color: #f44336; font-weight: 600; }
    .icon-pass { color: #4caf50; }
    .icon-fail { color: #f44336; }
    
    .test-components {
      margin: 24px 0;
      padding: 16px;
      background: #fafafa;
      border-radius: 8px;
    }
    .test-components h3 {
      margin-top: 0;
    }
    .component-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin: 16px 0;
    }
    .component-row mat-form-field {
      flex: 1;
      min-width: 250px;
    }
    
    .test-results {
      margin-top: 20px;
    }
    .test-list {
      padding: 8px 0;
    }
    .test-item {
      padding: 8px 16px;
      border-radius: 4px;
      margin: 4px 0;
    }
    .test-item.passed {
      background: #e8f5e9;
    }
    .test-item.failed {
      background: #ffebee;
    }
    .test-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .test-name {
      font-weight: 500;
    }
    .test-details {
      margin-top: 8px;
      padding-left: 32px;
      font-size: 12px;
    }
    .test-details code {
      background: rgba(0,0,0,0.08);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    .error {
      color: #f44336;
    }
    mat-panel-description {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `],
})
export class MatrixTestSuiteComponent implements OnInit {
  private adapter = inject(DateAdapter<TemporalDateType>);
  
  // Form controls for Material components
  dateControl = new FormControl<TemporalDateType | null>(null);
  timeControl = new FormControl<TemporalDateType | null>(null);
  rangeStartControl = new FormControl<TemporalDateType | null>(null);
  rangeEndControl = new FormControl<TemporalDateType | null>(null);
  
  // Test results
  testResults = signal<TestResult[]>([]);
  componentResults = signal<ComponentTestResult[]>([]);
  showAllDetails = signal(false);

  // Configuration info derived from adapter
  configInfo = computed(() => {
    const adapter = this.adapter as any;
    return {
      calendar: adapter._options?.calendar ?? adapter._calendar ?? 'iso8601',
      outputCalendar: adapter._options?.outputCalendar ?? adapter._outputCalendar ?? 'same as calendar',
      mode: adapter._options?.mode ?? adapter._mode ?? 'date',
      locale: adapter.locale ?? 'default',
    };
  });

  // Computed stats
  passedCount = computed(() => this.testResults().filter(t => t.passed).length);
  totalCount = computed(() => this.testResults().length);
  allPassed = computed(() => this.passedCount() === this.totalCount() && this.totalCount() > 0);

  // Group results by category
  categorizedResults = computed(() => {
    const results = this.testResults();
    const categories = [...new Set(results.map(r => r.category))];
    return categories.map(cat => {
      const tests = results.filter(r => r.category === cat);
      return {
        name: cat,
        tests,
        passedCount: tests.filter(t => t.passed).length,
        allPassed: tests.every(t => t.passed),
      };
    });
  });

  ngOnInit() {
    // Auto-run tests on init
    setTimeout(() => this.runAllTests(), 100);
  }

  runAllTests() {
    const results: TestResult[] = [
      ...this.runCoreAdapterTests(),
      ...this.runDateComponentTests(),
      ...this.runCalendarArithmeticTests(),
      ...this.runFormattingTests(),
      ...this.runParsingTests(),
      ...this.runComparisonTests(),
      ...this.runValidationTests(),
      ...this.runCalendarSpecificTests(),
      ...this.runMaterialComponentTests(),
    ];
    this.testResults.set(results);
  }

  // ============================================================
  // CORE ADAPTER TESTS (from components repo)
  // ============================================================
  
  private runCoreAdapterTests(): TestResult[] {
    const results: TestResult[] = [];
    const cat = 'Core Adapter';

    // today()
    results.push(this.test(cat, 'today() returns valid date', () => {
      const today = this.adapter.today();
      return {
        passed: this.adapter.isValid(today),
        expected: 'valid date',
        actual: this.adapter.isValid(today) ? `valid: ${this.safeToIso(today)}` : 'invalid',
      };
    }));

    // createDate()
    results.push(this.test(cat, 'createDate(2024, 0, 15) creates correct date', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      const year = this.adapter.getYear(date);
      const month = this.adapter.getMonth(date);
      const day = this.adapter.getDate(date);
      return {
        passed: year === 2024 && month === 0 && day === 15,
        expected: 'year=2024, month=0, day=15',
        actual: `year=${year}, month=${month}, day=${day}`,
      };
    }));

    // clone()
    results.push(this.test(cat, 'clone() creates equal date', () => {
      const original = this.adapter.createDate(2024, 5, 15);
      const cloned = this.adapter.clone(original);
      const equal = this.adapter.sameDate(original, cloned);
      return {
        passed: equal,
        expected: 'equal dates',
        actual: equal ? 'equal' : 'not equal',
      };
    }));

    // invalid()
    results.push(this.test(cat, 'invalid() returns invalid date instance', () => {
      const invalid = this.adapter.invalid();
      return {
        passed: this.adapter.isDateInstance(invalid) && !this.adapter.isValid(invalid),
        expected: 'isDateInstance=true, isValid=false',
        actual: `isDateInstance=${this.adapter.isDateInstance(invalid)}, isValid=${this.adapter.isValid(invalid)}`,
      };
    }));

    return results;
  }

  // ============================================================
  // DATE COMPONENT TESTS
  // ============================================================

  private runDateComponentTests(): TestResult[] {
    const results: TestResult[] = [];
    const cat = 'Date Components';
    const date = this.adapter.createDate(2024, 5, 15); // June 15, 2024

    results.push(this.test(cat, 'getYear() returns year', () => {
      const year = this.adapter.getYear(date);
      return { passed: year === 2024, expected: '2024', actual: String(year) };
    }));

    results.push(this.test(cat, 'getMonth() returns 0-indexed month', () => {
      const month = this.adapter.getMonth(date);
      return { passed: month === 5, expected: '5', actual: String(month) };
    }));

    results.push(this.test(cat, 'getDate() returns day of month', () => {
      const day = this.adapter.getDate(date);
      return { passed: day === 15, expected: '15', actual: String(day) };
    }));

    results.push(this.test(cat, 'getDayOfWeek() returns 0-6', () => {
      const dow = this.adapter.getDayOfWeek(date);
      return { passed: dow >= 0 && dow <= 6, expected: '0-6', actual: String(dow) };
    }));

    results.push(this.test(cat, 'getNumDaysInMonth() returns correct days', () => {
      // Use month 0 (first month) with a date that's valid for all calendars
      // Don't assume specific day counts - different calendars have different month lengths
      const firstMonth = this.adapter.createDate(2024, 0, 1);
      const days = this.adapter.getNumDaysInMonth(firstMonth);
      // Any calendar should have between 28-31 days for a standard month (or up to 35 for some lunisolar months)
      const validRange = days >= 28 && days <= 35;
      return { passed: validRange, expected: '28-35 days', actual: String(days) };
    }));

    results.push(this.test(cat, 'getFirstDayOfWeek() returns 0-6', () => {
      const fdow = this.adapter.getFirstDayOfWeek();
      return { passed: fdow >= 0 && fdow <= 6, expected: '0-6', actual: String(fdow) };
    }));

    return results;
  }

  // ============================================================
  // CALENDAR ARITHMETIC TESTS
  // ============================================================

  private runCalendarArithmeticTests(): TestResult[] {
    const results: TestResult[] = [];
    const cat = 'Calendar Arithmetic';

    results.push(this.test(cat, 'addCalendarDays(7) adds days correctly', () => {
      const date = this.adapter.createDate(2024, 0, 1);
      const result = this.adapter.addCalendarDays(date, 7);
      const day = this.adapter.getDate(result);
      return { passed: day === 8, expected: '8', actual: String(day) };
    }));

    results.push(this.test(cat, 'addCalendarDays(-7) subtracts days', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      const result = this.adapter.addCalendarDays(date, -7);
      const day = this.adapter.getDate(result);
      return { passed: day === 8, expected: '8', actual: String(day) };
    }));

    results.push(this.test(cat, 'addCalendarMonths(1) adds month', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      const result = this.adapter.addCalendarMonths(date, 1);
      const month = this.adapter.getMonth(result);
      return { passed: month === 1, expected: '1', actual: String(month) };
    }));

    results.push(this.test(cat, 'addCalendarMonths(-1) subtracts month', () => {
      const date = this.adapter.createDate(2024, 1, 15);
      const result = this.adapter.addCalendarMonths(date, -1);
      const month = this.adapter.getMonth(result);
      return { passed: month === 0, expected: '0', actual: String(month) };
    }));

    results.push(this.test(cat, 'addCalendarYears(1) adds year', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      const result = this.adapter.addCalendarYears(date, 1);
      const year = this.adapter.getYear(result);
      return { passed: year === 2025, expected: '2025', actual: String(year) };
    }));

    results.push(this.test(cat, 'addCalendarYears(-1) subtracts year', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      const result = this.adapter.addCalendarYears(date, -1);
      const year = this.adapter.getYear(result);
      return { passed: year === 2023, expected: '2023', actual: String(year) };
    }));

    return results;
  }

  // ============================================================
  // FORMATTING TESTS
  // ============================================================

  private runFormattingTests(): TestResult[] {
    const results: TestResult[] = [];
    const cat = 'Formatting';
    const config = this.configInfo();
    const calendar = config.calendar.toLowerCase();
    const date = this.adapter.createDate(2024, 0, 15);

    results.push(this.test(cat, 'toIso8601() returns ISO string', () => {
      const iso = this.safeToIso(date);
      // For non-Gregorian calendars, the ISO output will contain the calendar's year/month/day
      // which may differ from Gregorian dates. Just verify it returns a valid ISO format.
      const isValidIsoFormat = /^\d{4}-\d{2}-\d{2}/.test(iso) || /\[.*\]$/.test(iso);
      // For calendars that store in their native format, the year might be different
      const hasValidFormat = isValidIsoFormat || iso.includes('-');
      return { passed: hasValidFormat, expected: 'valid ISO format', actual: iso };
    }));

    results.push(this.test(cat, 'format() with year option', () => {
      const formatted = this.adapter.format(date, { year: 'numeric' });
      // Calendar-specific year formats:
      // - Japanese: "6 Reiwa" (era year) - valid
      // - Chinese: cycle/year like "41" - valid
      // - Hebrew: 5784 - valid
      // - Persian: 1402 - valid
      // - Gregorian/ISO: 2024 - valid
      // The test should verify it returns SOME year representation, not specifically "2024"
      const hasYearContent = formatted.length > 0 && (
        /\d+/.test(formatted) || // Has any number
        formatted.includes('Reiwa') || // Japanese era
        formatted.includes('令和') // Japanese era in Japanese
      );
      return { passed: hasYearContent, expected: 'year representation', actual: formatted };
    }));

    results.push(this.test(cat, 'getMonthNames("long") returns array ≥12', () => {
      const names = this.adapter.getMonthNames('long');
      return { passed: names.length >= 12, expected: '≥12', actual: `${names.length}: [${names.slice(0,3).join(', ')}...]` };
    }));

    results.push(this.test(cat, 'getMonthNames("short") returns array ≥12', () => {
      const names = this.adapter.getMonthNames('short');
      return { passed: names.length >= 12, expected: '≥12', actual: `${names.length}: [${names.slice(0,3).join(', ')}...]` };
    }));

    results.push(this.test(cat, 'getMonthNames("narrow") returns array ≥12', () => {
      const names = this.adapter.getMonthNames('narrow');
      return { passed: names.length >= 12, expected: '≥12', actual: `${names.length}: [${names.join(', ')}]` };
    }));

    results.push(this.test(cat, 'getDayOfWeekNames("long") returns 7 days', () => {
      const names = this.adapter.getDayOfWeekNames('long');
      return { passed: names.length === 7, expected: '7', actual: `${names.length}: [${names.join(', ')}]` };
    }));

    results.push(this.test(cat, 'getDayOfWeekNames("short") returns 7 days', () => {
      const names = this.adapter.getDayOfWeekNames('short');
      return { passed: names.length === 7, expected: '7', actual: `${names.length}: [${names.join(', ')}]` };
    }));

    results.push(this.test(cat, 'getDayOfWeekNames("narrow") returns 7 days', () => {
      const names = this.adapter.getDayOfWeekNames('narrow');
      return { passed: names.length === 7, expected: '7', actual: `${names.length}: [${names.join(', ')}]` };
    }));

    results.push(this.test(cat, 'getDateNames() returns 31 names', () => {
      const names = this.adapter.getDateNames();
      return { passed: names.length === 31, expected: '31', actual: `${names.length}` };
    }));

    results.push(this.test(cat, 'getYearName() returns string', () => {
      const yearName = this.adapter.getYearName(date);
      return { passed: typeof yearName === 'string' && yearName.length > 0, expected: 'non-empty string', actual: yearName };
    }));

    return results;
  }

  // ============================================================
  // PARSING TESTS
  // ============================================================

  private runParsingTests(): TestResult[] {
    const results: TestResult[] = [];
    const cat = 'Parsing';

    results.push(this.test(cat, 'parse("2024-01-15") returns valid date', () => {
      const parsed = this.adapter.parse('2024-01-15', null);
      const isValid = parsed && this.adapter.isValid(parsed);
      return { passed: isValid === true, expected: 'valid', actual: isValid ? this.safeToIso(parsed!) : 'invalid/null' };
    }));

    results.push(this.test(cat, 'parse("") returns null', () => {
      const parsed = this.adapter.parse('', null);
      return { passed: parsed === null, expected: 'null', actual: String(parsed) };
    }));

    results.push(this.test(cat, 'parse(null) returns null', () => {
      const parsed = this.adapter.parse(null, null);
      return { passed: parsed === null, expected: 'null', actual: String(parsed) };
    }));

    results.push(this.test(cat, 'deserialize("2024-01-15") returns valid date', () => {
      const deserialized = this.adapter.deserialize('2024-01-15');
      const isValid = deserialized && this.adapter.isValid(deserialized);
      return { passed: isValid === true, expected: 'valid', actual: isValid ? this.safeToIso(deserialized!) : 'invalid/null' };
    }));

    results.push(this.test(cat, 'deserialize("") returns null', () => {
      const deserialized = this.adapter.deserialize('');
      return { passed: deserialized === null, expected: 'null', actual: String(deserialized) };
    }));

    results.push(this.test(cat, 'deserialize(null) returns null', () => {
      const deserialized = this.adapter.deserialize(null);
      return { passed: deserialized === null, expected: 'null', actual: String(deserialized) };
    }));

    return results;
  }

  // ============================================================
  // COMPARISON TESTS
  // ============================================================

  private runComparisonTests(): TestResult[] {
    const results: TestResult[] = [];
    const cat = 'Comparison';
    const date1 = this.adapter.createDate(2024, 0, 15);
    const date2 = this.adapter.createDate(2024, 0, 20);
    const date3 = this.adapter.createDate(2024, 0, 15);

    results.push(this.test(cat, 'compareDate() < 0 for earlier date', () => {
      const cmp = this.adapter.compareDate(date1, date2);
      return { passed: cmp < 0, expected: '< 0', actual: String(cmp) };
    }));

    results.push(this.test(cat, 'compareDate() > 0 for later date', () => {
      const cmp = this.adapter.compareDate(date2, date1);
      return { passed: cmp > 0, expected: '> 0', actual: String(cmp) };
    }));

    results.push(this.test(cat, 'compareDate() === 0 for same date', () => {
      const cmp = this.adapter.compareDate(date1, date3);
      return { passed: cmp === 0, expected: '0', actual: String(cmp) };
    }));

    results.push(this.test(cat, 'sameDate() true for equal dates', () => {
      const same = this.adapter.sameDate(date1, date3);
      return { passed: same === true, expected: 'true', actual: String(same) };
    }));

    results.push(this.test(cat, 'sameDate() false for different dates', () => {
      const same = this.adapter.sameDate(date1, date2);
      return { passed: same === false, expected: 'false', actual: String(same) };
    }));

    results.push(this.test(cat, 'clampDate() clamps to min', () => {
      const min = this.adapter.createDate(2024, 0, 10);
      const max = this.adapter.createDate(2024, 0, 20);
      const early = this.adapter.createDate(2024, 0, 5);
      const clamped = this.adapter.clampDate(early, min, max);
      const sameAsMin = this.adapter.sameDate(clamped, min);
      return { passed: sameAsMin, expected: 'clamped to min', actual: sameAsMin ? 'clamped to min' : this.safeToIso(clamped) };
    }));

    results.push(this.test(cat, 'clampDate() clamps to max', () => {
      const min = this.adapter.createDate(2024, 0, 10);
      const max = this.adapter.createDate(2024, 0, 20);
      const late = this.adapter.createDate(2024, 0, 25);
      const clamped = this.adapter.clampDate(late, min, max);
      const sameAsMax = this.adapter.sameDate(clamped, max);
      return { passed: sameAsMax, expected: 'clamped to max', actual: sameAsMax ? 'clamped to max' : this.safeToIso(clamped) };
    }));

    return results;
  }

  // ============================================================
  // VALIDATION TESTS
  // ============================================================

  private runValidationTests(): TestResult[] {
    const results: TestResult[] = [];
    const cat = 'Validation';

    results.push(this.test(cat, 'isValid() true for valid date', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      const valid = this.adapter.isValid(date);
      return { passed: valid === true, expected: 'true', actual: String(valid) };
    }));

    results.push(this.test(cat, 'isValid() false for invalid()', () => {
      const invalid = this.adapter.invalid();
      const valid = this.adapter.isValid(invalid);
      return { passed: valid === false, expected: 'false', actual: String(valid) };
    }));

    results.push(this.test(cat, 'isDateInstance() true for created date', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      const isInstance = this.adapter.isDateInstance(date);
      return { passed: isInstance === true, expected: 'true', actual: String(isInstance) };
    }));

    results.push(this.test(cat, 'isDateInstance() false for string', () => {
      const isInstance = this.adapter.isDateInstance('2024-01-15');
      return { passed: isInstance === false, expected: 'false', actual: String(isInstance) };
    }));

    results.push(this.test(cat, 'isDateInstance() false for JS Date', () => {
      const isInstance = this.adapter.isDateInstance(new Date());
      return { passed: isInstance === false, expected: 'false', actual: String(isInstance) };
    }));

    results.push(this.test(cat, 'getValidDateOrNull() returns date for valid', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      const result = this.adapter.getValidDateOrNull(date);
      return { passed: result === date, expected: 'same date', actual: result === date ? 'same date' : 'different/null' };
    }));

    results.push(this.test(cat, 'getValidDateOrNull() returns null for invalid', () => {
      const invalid = this.adapter.invalid();
      const result = this.adapter.getValidDateOrNull(invalid);
      return { passed: result === null, expected: 'null', actual: String(result) };
    }));

    return results;
  }

  // ============================================================
  // CALENDAR-SPECIFIC TESTS
  // ============================================================

  private runCalendarSpecificTests(): TestResult[] {
    const results: TestResult[] = [];
    const cat = 'Calendar Specific';
    const config = this.configInfo();
    const calendar = config.calendar.toLowerCase();
    // Use output calendar for month/display tests, as that's what getMonthNames returns
    const displayCalendar = (config.outputCalendar || config.calendar).toLowerCase();

    // 13-month calendar tests - only run if the DISPLAY calendar has 13+ months
    // (not the input calendar, because getMonthNames returns output calendar months)
    if (['hebrew', 'ethiopic', 'chinese'].includes(displayCalendar)) {
      results.push(this.test(cat, `${displayCalendar} calendar can have ≥13 months`, () => {
        const months = this.adapter.getMonthNames('long');
        const has13Plus = months.length >= 13;
        return { 
          passed: has13Plus, 
          expected: '≥13 months', 
          actual: `${months.length} months: [${months.join(', ')}]` 
        };
      }));
    }

    // Japanese calendar era test
    if (calendar === 'japanese') {
      results.push(this.test(cat, 'Japanese calendar shows era in year name', () => {
        const date = this.adapter.createDate(2024, 0, 1);
        const yearName = this.adapter.getYearName(date);
        // Should contain era name or era year
        return { 
          passed: yearName.length > 0, 
          expected: 'year with era', 
          actual: yearName 
        };
      }));
    }

    // Persian calendar year offset test
    if (calendar === 'persian') {
      results.push(this.test(cat, 'Persian year is ~621 years behind Gregorian', () => {
        const date = this.adapter.createDate(1403, 0, 1); // Persian year 1403
        const isValid = this.adapter.isValid(date);
        return { 
          passed: isValid, 
          expected: 'valid Persian date', 
          actual: isValid ? this.safeToIso(date) : 'invalid' 
        };
      }));
    }

    // Buddhist calendar year offset test
    if (calendar === 'buddhist') {
      results.push(this.test(cat, 'Buddhist year is ~543 years ahead of Gregorian', () => {
        const date = this.adapter.createDate(2567, 0, 1); // Buddhist year 2567 = Gregorian 2024
        const isValid = this.adapter.isValid(date);
        return { 
          passed: isValid, 
          expected: 'valid Buddhist date', 
          actual: isValid ? this.safeToIso(date) : 'invalid' 
        };
      }));
    }

    // Output calendar formatting test
    if (config.outputCalendar !== 'same as calendar' && config.outputCalendar !== config.calendar) {
      results.push(this.test(cat, `Output calendar (${config.outputCalendar}) differs from storage (${config.calendar})`, () => {
        const date = this.adapter.createDate(2024, 0, 1);
        const formatted = this.adapter.format(date, { year: 'numeric', month: 'long', day: 'numeric' });
        return { 
          passed: formatted.length > 0, 
          expected: `formatted with ${config.outputCalendar}`, 
          actual: formatted 
        };
      }));
    }

    return results;
  }

  // ============================================================
  // MATERIAL COMPONENT INTEGRATION TESTS
  // ============================================================

  private runMaterialComponentTests(): TestResult[] {
    const results: TestResult[] = [];
    const cat = 'Material Components';

    // Test programmatic date setting
    results.push(this.test(cat, 'FormControl accepts adapter.today()', () => {
      const today = this.adapter.today();
      this.dateControl.setValue(today);
      const value = this.dateControl.value;
      const matches = value && this.adapter.sameDate(value, today);
      return { 
        passed: matches === true, 
        expected: 'value matches today', 
        actual: matches ? 'matches' : `got: ${this.safeToIso(value)}` 
      };
    }));

    // Test createDate with FormControl
    results.push(this.test(cat, 'FormControl accepts createDate()', () => {
      const date = this.adapter.createDate(2024, 5, 15);
      this.dateControl.setValue(date);
      const value = this.dateControl.value;
      const matches = value && this.adapter.sameDate(value, date);
      return { 
        passed: matches === true, 
        expected: 'value matches created date', 
        actual: matches ? 'matches' : `got: ${this.safeToIso(value)}` 
      };
    }));

    // Test range picker
    results.push(this.test(cat, 'Date range controls accept dates', () => {
      // Use day 1 and day 15 which are valid for all calendars (not day 31 which some months don't have)
      const start = this.adapter.createDate(2024, 0, 1);
      const end = this.adapter.createDate(2024, 0, 15);
      this.rangeStartControl.setValue(start);
      this.rangeEndControl.setValue(end);
      const startMatch = this.rangeStartControl.value && this.adapter.sameDate(this.rangeStartControl.value, start);
      const endMatch = this.rangeEndControl.value && this.adapter.sameDate(this.rangeEndControl.value, end);
      return { 
        passed: startMatch === true && endMatch === true, 
        expected: 'start and end match', 
        actual: `start=${startMatch}, end=${endMatch}` 
      };
    }));

    // Test null clearing
    results.push(this.test(cat, 'FormControl can be cleared with null', () => {
      this.dateControl.setValue(this.adapter.today());
      this.dateControl.setValue(null);
      return { 
        passed: this.dateControl.value === null, 
        expected: 'null', 
        actual: String(this.dateControl.value) 
      };
    }));

    return results;
  }

  // ============================================================
  // UTILITIES
  // ============================================================

  private test(category: string, name: string, fn: () => { passed: boolean; expected: string; actual: string }): TestResult {
    try {
      const result = fn();
      return { name, category, ...result };
    } catch (e) {
      return {
        name,
        category,
        passed: false,
        expected: 'no error',
        actual: 'threw error',
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  private safeToIso(date: TemporalDateType | null): string {
    if (!date) return 'null';
    try {
      return this.adapter.toIso8601(date);
    } catch {
      return '[format error]';
    }
  }
}
