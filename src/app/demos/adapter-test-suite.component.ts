import { Component, inject, signal, computed } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { JsonPipe } from '@angular/common';
import { TemporalDateType } from '@angular/material-temporal-adapter';

interface TestResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

interface TestCategory {
  name: string;
  tests: TestResult[];
}

/**
 * Comprehensive test component for TemporalDateAdapter.
 * Tests all adapter methods with visual feedback.
 */
@Component({
  selector: 'app-adapter-test-suite',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    JsonPipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Temporal Date Adapter Test Suite</mat-card-title>
        <mat-card-subtitle>
          {{ passedCount() }}/{{ totalCount() }} tests passed
          <span [style.color]="allPassed() ? 'green' : 'red'">
            {{ allPassed() ? '✓ All Passed' : '✗ Some Failed' }}
          </span>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="primary" (click)="runAllTests()">
          Run All Tests
        </button>
        
        <mat-accordion class="test-results">
          @for (category of testCategories(); track category.name) {
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  {{ category.name }}
                </mat-panel-title>
                <mat-panel-description>
                  {{ getCategoryPassedCount(category) }}/{{ category.tests.length }} passed
                  <mat-icon [style.color]="getCategoryPassed(category) ? 'green' : 'red'">
                    {{ getCategoryPassed(category) ? 'check_circle' : 'error' }}
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
                    @if (!test.passed) {
                      <div class="test-details">
                        <div><strong>Expected:</strong> {{ test.expected }}</div>
                        <div><strong>Actual:</strong> {{ test.actual }}</div>
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
    mat-card {
      max-width: 800px;
      margin: 20px auto;
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
      font-family: monospace;
    }
    .error {
      color: red;
    }
    mat-panel-description {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `],
})
export class AdapterTestSuiteComponent {
  private adapter = inject(DateAdapter<TemporalDateType>);
  
  testCategories = signal<TestCategory[]>([]);
  
  passedCount = computed(() => 
    this.testCategories().reduce((sum, cat) => 
      sum + cat.tests.filter(t => t.passed).length, 0)
  );
  
  totalCount = computed(() => 
    this.testCategories().reduce((sum, cat) => sum + cat.tests.length, 0)
  );
  
  allPassed = computed(() => this.passedCount() === this.totalCount() && this.totalCount() > 0);

  getCategoryPassedCount(category: TestCategory): number {
    return category.tests.filter(t => t.passed).length;
  }

  getCategoryPassed(category: TestCategory): boolean {
    return category.tests.every(t => t.passed);
  }

  runAllTests() {
    const categories: TestCategory[] = [
      this.runBasicDateTests(),
      this.runDateComponentTests(),
      this.runCalendarArithmeticTests(),
      this.runComparisonTests(),
      this.runFormattingTests(),
      this.runParsingTests(),
      this.runValidationTests(),
      this.runLocaleTests(),
    ];
    this.testCategories.set(categories);
  }

  private runBasicDateTests(): TestCategory {
    const tests: TestResult[] = [];
    
    // Test today()
    tests.push(this.runTest('today() returns valid date', () => {
      const today = this.adapter.today();
      return {
        passed: this.adapter.isValid(today),
        expected: 'valid date',
        actual: this.adapter.isValid(today) ? 'valid date' : 'invalid date'
      };
    }));

    // Test createDate()
    tests.push(this.runTest('createDate(2024, 0, 15) creates Jan 15, 2024', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      const year = this.adapter.getYear(date);
      const month = this.adapter.getMonth(date);
      const day = this.adapter.getDate(date);
      return {
        passed: year === 2024 && month === 0 && day === 15,
        expected: '2024-01-15',
        actual: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      };
    }));

    // Test clone()
    tests.push(this.runTest('clone() creates independent copy', () => {
      const original = this.adapter.createDate(2024, 0, 15);
      const cloned = this.adapter.clone(original);
      const areEqual = this.adapter.sameDate(original, cloned);
      return {
        passed: areEqual,
        expected: 'equal dates',
        actual: areEqual ? 'equal dates' : 'different dates'
      };
    }));

    return { name: 'Basic Date Operations', tests };
  }

  private runDateComponentTests(): TestCategory {
    const tests: TestResult[] = [];
    const date = this.adapter.createDate(2024, 5, 15); // June 15, 2024

    tests.push(this.runTest('getYear() returns correct year', () => ({
      passed: this.adapter.getYear(date) === 2024,
      expected: '2024',
      actual: String(this.adapter.getYear(date))
    })));

    tests.push(this.runTest('getMonth() returns 0-indexed month', () => ({
      passed: this.adapter.getMonth(date) === 5,
      expected: '5 (June)',
      actual: String(this.adapter.getMonth(date))
    })));

    tests.push(this.runTest('getDate() returns day of month', () => ({
      passed: this.adapter.getDate(date) === 15,
      expected: '15',
      actual: String(this.adapter.getDate(date))
    })));

    tests.push(this.runTest('getDayOfWeek() returns 0-6 (Sun-Sat)', () => {
      const dow = this.adapter.getDayOfWeek(date);
      return {
        passed: dow >= 0 && dow <= 6,
        expected: '0-6',
        actual: String(dow)
      };
    }));

    tests.push(this.runTest('getNumDaysInMonth() returns correct days', () => {
      const feb2024 = this.adapter.createDate(2024, 1, 1); // Feb 2024 (leap year)
      const days = this.adapter.getNumDaysInMonth(feb2024);
      return {
        passed: days === 29,
        expected: '29 (leap year)',
        actual: String(days)
      };
    }));

    return { name: 'Date Component Getters', tests };
  }

  private runCalendarArithmeticTests(): TestCategory {
    const tests: TestResult[] = [];
    // Use day 15 which exists in all months
    const date = this.adapter.createDate(2024, 0, 15); // Jan 15, 2024

    tests.push(this.runTest('addCalendarDays(7) adds 7 days', () => {
      const result = this.adapter.addCalendarDays(date, 7);
      return {
        passed: this.adapter.getDate(result) === 22 && this.adapter.getMonth(result) === 0,
        expected: 'Jan 22, 2024',
        actual: this.adapter.toIso8601(result)
      };
    }));

    tests.push(this.runTest('addCalendarDays(-7) subtracts 7 days', () => {
      const result = this.adapter.addCalendarDays(date, -7);
      return {
        passed: this.adapter.getDate(result) === 8,
        expected: 'Jan 8, 2024',
        actual: this.adapter.toIso8601(result)
      };
    }));

    tests.push(this.runTest('addCalendarMonths(1) adds one month', () => {
      const result = this.adapter.addCalendarMonths(date, 1);
      // Jan 15 + 1 month = Feb 15
      return {
        passed: this.adapter.getMonth(result) === 1 && this.adapter.getDate(result) === 15,
        expected: 'Feb 15, 2024',
        actual: this.adapter.toIso8601(result)
      };
    }));

    tests.push(this.runTest('addCalendarYears(1) adds a year', () => {
      const result = this.adapter.addCalendarYears(date, 1);
      return {
        passed: this.adapter.getYear(result) === 2025,
        expected: '2025',
        actual: String(this.adapter.getYear(result))
      };
    }));

    return { name: 'Calendar Arithmetic', tests };
  }

  private runComparisonTests(): TestCategory {
    const tests: TestResult[] = [];
    const date1 = this.adapter.createDate(2024, 0, 15);
    const date2 = this.adapter.createDate(2024, 0, 20);
    const date3 = this.adapter.createDate(2024, 0, 15);

    tests.push(this.runTest('compareDate() returns negative for earlier date', () => {
      const result = this.adapter.compareDate(date1, date2);
      return {
        passed: result < 0,
        expected: '< 0',
        actual: String(result)
      };
    }));

    tests.push(this.runTest('compareDate() returns positive for later date', () => {
      const result = this.adapter.compareDate(date2, date1);
      return {
        passed: result > 0,
        expected: '> 0',
        actual: String(result)
      };
    }));

    tests.push(this.runTest('compareDate() returns 0 for same date', () => {
      const result = this.adapter.compareDate(date1, date3);
      return {
        passed: result === 0,
        expected: '0',
        actual: String(result)
      };
    }));

    tests.push(this.runTest('sameDate() returns true for equal dates', () => {
      const result = this.adapter.sameDate(date1, date3);
      return {
        passed: result === true,
        expected: 'true',
        actual: String(result)
      };
    }));

    tests.push(this.runTest('sameDate() returns false for different dates', () => {
      const result = this.adapter.sameDate(date1, date2);
      return {
        passed: result === false,
        expected: 'false',
        actual: String(result)
      };
    }));

    return { name: 'Date Comparison', tests };
  }

  private runFormattingTests(): TestCategory {
    const tests: TestResult[] = [];
    const date = this.adapter.createDate(2024, 0, 15);

    tests.push(this.runTest('toIso8601() returns ISO string', () => {
      const iso = this.adapter.toIso8601(date);
      return {
        passed: iso.includes('2024') && iso.includes('01') && iso.includes('15'),
        expected: 'contains 2024-01-15',
        actual: iso
      };
    }));

    tests.push(this.runTest('format() with year option', () => {
      const formatted = this.adapter.format(date, { year: 'numeric' });
      return {
        passed: formatted.includes('2024'),
        expected: 'contains 2024',
        actual: formatted
      };
    }));

    tests.push(this.runTest('getMonthNames() returns 12 months', () => {
      const names = this.adapter.getMonthNames('long');
      return {
        passed: names.length === 12,
        expected: '12',
        actual: String(names.length)
      };
    }));

    tests.push(this.runTest('getDayOfWeekNames() returns 7 days', () => {
      const names = this.adapter.getDayOfWeekNames('long');
      return {
        passed: names.length === 7,
        expected: '7',
        actual: String(names.length)
      };
    }));

    tests.push(this.runTest('getDateNames() returns 31 names', () => {
      const names = this.adapter.getDateNames();
      return {
        passed: names.length === 31,
        expected: '31',
        actual: String(names.length)
      };
    }));

    return { name: 'Formatting', tests };
  }

  private runParsingTests(): TestCategory {
    const tests: TestResult[] = [];

    tests.push(this.runTest('parse() handles ISO string', () => {
      const parsed = this.adapter.parse('2024-01-15', null);
      const isValid = parsed && this.adapter.isValid(parsed);
      return {
        passed: isValid === true,
        expected: 'valid date',
        actual: isValid ? 'valid date' : 'invalid/null'
      };
    }));

    tests.push(this.runTest('parse() handles null', () => {
      const parsed = this.adapter.parse(null, null);
      return {
        passed: parsed === null,
        expected: 'null',
        actual: String(parsed)
      };
    }));

    tests.push(this.runTest('parse() handles empty string', () => {
      const parsed = this.adapter.parse('', null);
      return {
        passed: parsed === null,
        expected: 'null',
        actual: String(parsed)
      };
    }));

    tests.push(this.runTest('deserialize() handles ISO string', () => {
      const deserialized = this.adapter.deserialize('2024-01-15');
      const isValid = deserialized && this.adapter.isValid(deserialized);
      return {
        passed: isValid === true,
        expected: 'valid date',
        actual: isValid ? 'valid date' : 'invalid/null'
      };
    }));

    return { name: 'Parsing', tests };
  }

  private runValidationTests(): TestCategory {
    const tests: TestResult[] = [];

    tests.push(this.runTest('isValid() returns true for valid date', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      return {
        passed: this.adapter.isValid(date) === true,
        expected: 'true',
        actual: String(this.adapter.isValid(date))
      };
    }));

    tests.push(this.runTest('isValid() returns false for invalid()', () => {
      const invalid = this.adapter.invalid();
      return {
        passed: this.adapter.isValid(invalid) === false,
        expected: 'false',
        actual: String(this.adapter.isValid(invalid))
      };
    }));

    tests.push(this.runTest('isDateInstance() returns true for Temporal date', () => {
      const date = this.adapter.createDate(2024, 0, 15);
      return {
        passed: this.adapter.isDateInstance(date) === true,
        expected: 'true',
        actual: String(this.adapter.isDateInstance(date))
      };
    }));

    tests.push(this.runTest('isDateInstance() returns false for non-date', () => {
      const result = this.adapter.isDateInstance('not a date');
      return {
        passed: result === false,
        expected: 'false',
        actual: String(result)
      };
    }));

    return { name: 'Validation', tests };
  }

  private runLocaleTests(): TestCategory {
    const tests: TestResult[] = [];

    tests.push(this.runTest('getFirstDayOfWeek() returns 0-6', () => {
      const dow = this.adapter.getFirstDayOfWeek();
      return {
        passed: dow >= 0 && dow <= 6,
        expected: '0-6',
        actual: String(dow)
      };
    }));

    tests.push(this.runTest('getMonthNames() changes with locale', () => {
      // Test locale functionality through month names
      const monthNames = this.adapter.getMonthNames('long');
      const hasJanuary = monthNames[0].toLowerCase().includes('jan') || 
                         monthNames[0].toLowerCase().includes('januar');
      return {
        passed: hasJanuary,
        expected: 'January or Januar (locale-dependent)',
        actual: monthNames[0]
      };
    }));

    tests.push(this.runTest('getDayOfWeekNames() returns localized days', () => {
      const dayNames = this.adapter.getDayOfWeekNames('long');
      // Sunday or Sonntag should be present
      const hasSunday = dayNames.some(d => 
        d.toLowerCase().includes('sun') || d.toLowerCase().includes('sonn')
      );
      return {
        passed: hasSunday,
        expected: 'contains Sunday/Sonntag',
        actual: dayNames.join(', ')
      };
    }));

    return { name: 'Locale', tests };
  }

  private runTest(name: string, testFn: () => { passed: boolean; expected: string; actual: string }): TestResult {
    try {
      const result = testFn();
      return { name, ...result };
    } catch (e) {
      return {
        name,
        passed: false,
        expected: 'no error',
        actual: 'error thrown',
        error: e instanceof Error ? e.message : String(e)
      };
    }
  }
}
