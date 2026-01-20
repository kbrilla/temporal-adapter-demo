import { Component, inject, signal } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';
import { TemporalDateType } from '@angular/material-temporal-adapter';

interface EdgeCaseTest {
  name: string;
  description: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

/**
 * Edge case tests for the Temporal adapter.
 * Tests boundary conditions and special scenarios.
 */
@Component({
  selector: 'app-edge-cases-test',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    JsonPipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Edge Cases Test Suite</mat-card-title>
        <mat-card-subtitle>
          Tests boundary conditions and special scenarios
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="primary" (click)="runTests()">
          Run Edge Case Tests
        </button>

        @if (tests().length > 0) {
          <div class="summary">
            {{ passedCount() }}/{{ tests().length }} passed
            <mat-icon [style.color]="allPassed() ? 'green' : 'red'">
              {{ allPassed() ? 'check_circle' : 'error' }}
            </mat-icon>
          </div>

          <mat-accordion>
            @for (test of tests(); track test.name) {
              <mat-expansion-panel [class.passed]="test.passed" [class.failed]="!test.passed">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon [style.color]="test.passed ? 'green' : 'red'">
                      {{ test.passed ? 'check' : 'close' }}
                    </mat-icon>
                    {{ test.name }}
                  </mat-panel-title>
                </mat-expansion-panel-header>
                <div class="test-content">
                  <p><strong>Description:</strong> {{ test.description }}</p>
                  <p><strong>Input:</strong> <code>{{ test.input }}</code></p>
                  <p><strong>Expected:</strong> <code>{{ test.expected }}</code></p>
                  <p><strong>Actual:</strong> <code>{{ test.actual }}</code></p>
                </div>
              </mat-expansion-panel>
            }
          </mat-accordion>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      max-width: 800px;
      margin: 20px auto;
    }
    .summary {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 16px 0;
      font-size: 18px;
      font-weight: 500;
    }
    mat-expansion-panel.passed {
      border-left: 4px solid green;
    }
    mat-expansion-panel.failed {
      border-left: 4px solid red;
    }
    mat-panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .test-content {
      padding: 8px 16px;
    }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
  `],
})
export class EdgeCasesTestComponent {
  private adapter = inject(DateAdapter<TemporalDateType>);
  
  tests = signal<EdgeCaseTest[]>([]);
  
  passedCount = () => this.tests().filter(t => t.passed).length;
  allPassed = () => this.tests().every(t => t.passed);

  runTests() {
    const results: EdgeCaseTest[] = [
      // Leap year tests
      this.testLeapYear2024(),
      this.testLeapYear2100(),
      this.testFeb29ToMarch(),
      
      // Month boundary tests
      this.testJan31PlusOneMonth(),
      this.testMar31MinusOneMonth(),
      this.testDecemberPlusOneMonth(),
      
      // Year boundary tests
      this.testYearBoundary(),
      this.testNegativeYears(),
      
      // Day of week tests
      this.testDayOfWeekRange(),
      this.testKnownDayOfWeek(),
      
      // Comparison edge cases
      this.testSameDateComparison(),
      this.testYearOnlyDifference(),
      
      // Invalid date handling
      this.testInvalidDate(),
      this.testNullHandling(),
      
      // Month name tests
      this.testAllMonthNames(),
      this.testMonthNamesShort(),
      
      // Large date arithmetic
      this.testAdd365Days(),
      this.testSubtractLargeValue(),
    ];
    
    this.tests.set(results);
  }

  private testLeapYear2024(): EdgeCaseTest {
    const feb2024 = this.adapter.createDate(2024, 1, 1);
    const days = this.adapter.getNumDaysInMonth(feb2024);
    return {
      name: 'Leap Year 2024',
      description: '2024 is a leap year, February should have 29 days',
      input: 'getNumDaysInMonth(2024-02-01)',
      expected: '29',
      actual: String(days),
      passed: days === 29
    };
  }

  private testLeapYear2100(): EdgeCaseTest {
    const feb2100 = this.adapter.createDate(2100, 1, 1);
    const days = this.adapter.getNumDaysInMonth(feb2100);
    return {
      name: 'Non-Leap Century Year 2100',
      description: '2100 is NOT a leap year (divisible by 100 but not 400)',
      input: 'getNumDaysInMonth(2100-02-01)',
      expected: '28',
      actual: String(days),
      passed: days === 28
    };
  }

  private testFeb29ToMarch(): EdgeCaseTest {
    const feb29 = this.adapter.createDate(2024, 1, 29);
    const nextDay = this.adapter.addCalendarDays(feb29, 1);
    const isMarc1 = this.adapter.getMonth(nextDay) === 2 && 
                    this.adapter.getDate(nextDay) === 1;
    return {
      name: 'Feb 29 + 1 day',
      description: 'Adding 1 day to Feb 29 should give March 1',
      input: 'addCalendarDays(2024-02-29, 1)',
      expected: 'March 1',
      actual: this.adapter.toIso8601(nextDay),
      passed: isMarc1
    };
  }

  private testJan31PlusOneMonth(): EdgeCaseTest {
    const jan31 = this.adapter.createDate(2024, 0, 31);
    const nextMonth = this.adapter.addCalendarMonths(jan31, 1);
    // Should clamp to Feb 29 (2024 is leap year)
    const isFeb29 = this.adapter.getMonth(nextMonth) === 1 && 
                    this.adapter.getDate(nextMonth) === 29;
    return {
      name: 'Jan 31 + 1 month (overflow)',
      description: 'Adding 1 month to Jan 31 should clamp to Feb 29 in leap year',
      input: 'addCalendarMonths(2024-01-31, 1)',
      expected: 'Feb 29',
      actual: this.adapter.toIso8601(nextMonth),
      passed: isFeb29
    };
  }

  private testMar31MinusOneMonth(): EdgeCaseTest {
    const mar31 = this.adapter.createDate(2024, 2, 31);
    const prevMonth = this.adapter.addCalendarMonths(mar31, -1);
    // Should clamp to Feb 29 (2024 is leap year)
    const isFeb29 = this.adapter.getMonth(prevMonth) === 1 && 
                    this.adapter.getDate(prevMonth) === 29;
    return {
      name: 'Mar 31 - 1 month (overflow)',
      description: 'Subtracting 1 month from Mar 31 should clamp to Feb 29',
      input: 'addCalendarMonths(2024-03-31, -1)',
      expected: 'Feb 29',
      actual: this.adapter.toIso8601(prevMonth),
      passed: isFeb29
    };
  }

  private testDecemberPlusOneMonth(): EdgeCaseTest {
    const dec = this.adapter.createDate(2024, 11, 15);
    const nextMonth = this.adapter.addCalendarMonths(dec, 1);
    const isJan2025 = this.adapter.getYear(nextMonth) === 2025 && 
                      this.adapter.getMonth(nextMonth) === 0;
    return {
      name: 'Dec + 1 month (year wrap)',
      description: 'Adding 1 month to December should give January next year',
      input: 'addCalendarMonths(2024-12-15, 1)',
      expected: 'Jan 2025',
      actual: this.adapter.toIso8601(nextMonth),
      passed: isJan2025
    };
  }

  private testYearBoundary(): EdgeCaseTest {
    const dec31 = this.adapter.createDate(2024, 11, 31);
    const jan1 = this.adapter.addCalendarDays(dec31, 1);
    const isJan1_2025 = this.adapter.getYear(jan1) === 2025 && 
                        this.adapter.getMonth(jan1) === 0 &&
                        this.adapter.getDate(jan1) === 1;
    return {
      name: 'Year boundary crossing',
      description: 'Dec 31 + 1 day should give Jan 1 next year',
      input: 'addCalendarDays(2024-12-31, 1)',
      expected: '2025-01-01',
      actual: this.adapter.toIso8601(jan1),
      passed: isJan1_2025
    };
  }

  private testNegativeYears(): EdgeCaseTest {
    // This tests if the adapter handles years before 1 CE
    try {
      const ancient = this.adapter.createDate(-1, 0, 1);
      const year = this.adapter.getYear(ancient);
      return {
        name: 'Negative year (BCE)',
        description: 'Creating a date with year -1 (2 BCE)',
        input: 'createDate(-1, 0, 1)',
        expected: 'year === -1',
        actual: `year === ${year}`,
        passed: year === -1
      };
    } catch (e) {
      return {
        name: 'Negative year (BCE)',
        description: 'Creating a date with year -1 (2 BCE)',
        input: 'createDate(-1, 0, 1)',
        expected: 'date created or error',
        actual: `Error: ${e}`,
        passed: true // Either behavior is acceptable
      };
    }
  }

  private testDayOfWeekRange(): EdgeCaseTest {
    const dows: number[] = [];
    for (let i = 0; i < 7; i++) {
      const date = this.adapter.addCalendarDays(this.adapter.today(), i);
      dows.push(this.adapter.getDayOfWeek(date));
    }
    const allValid = dows.every(d => d >= 0 && d <= 6);
    const allUnique = new Set(dows).size === 7;
    return {
      name: 'Day of week range',
      description: '7 consecutive days should have DOW 0-6',
      input: 'getDayOfWeek() for 7 days',
      expected: '0-6, all unique',
      actual: dows.join(', '),
      passed: allValid && allUnique
    };
  }

  private testKnownDayOfWeek(): EdgeCaseTest {
    // Jan 1, 2024 was a Monday
    const jan1_2024 = this.adapter.createDate(2024, 0, 1);
    const dow = this.adapter.getDayOfWeek(jan1_2024);
    return {
      name: 'Known day of week',
      description: 'Jan 1, 2024 was a Monday (day 1)',
      input: 'getDayOfWeek(2024-01-01)',
      expected: '1 (Monday)',
      actual: String(dow),
      passed: dow === 1
    };
  }

  private testSameDateComparison(): EdgeCaseTest {
    const date1 = this.adapter.createDate(2024, 5, 15);
    const date2 = this.adapter.createDate(2024, 5, 15);
    const compare = this.adapter.compareDate(date1, date2);
    const same = this.adapter.sameDate(date1, date2);
    return {
      name: 'Same date comparison',
      description: 'Two identical dates should compare equal',
      input: 'compareDate(date, samDate)',
      expected: '0, sameDate=true',
      actual: `${compare}, sameDate=${same}`,
      passed: compare === 0 && same === true
    };
  }

  private testYearOnlyDifference(): EdgeCaseTest {
    const date1 = this.adapter.createDate(2023, 5, 15);
    const date2 = this.adapter.createDate(2024, 5, 15);
    const compare = this.adapter.compareDate(date1, date2);
    return {
      name: 'Year-only difference',
      description: 'Same month/day but different year should compare correctly',
      input: 'compareDate(2023-06-15, 2024-06-15)',
      expected: '< 0',
      actual: String(compare),
      passed: compare < 0
    };
  }

  private testInvalidDate(): EdgeCaseTest {
    const invalid = this.adapter.invalid();
    const isValid = this.adapter.isValid(invalid);
    return {
      name: 'Invalid date handling',
      description: 'invalid() should return a date that fails isValid()',
      input: 'isValid(invalid())',
      expected: 'false',
      actual: String(isValid),
      passed: isValid === false
    };
  }

  private testNullHandling(): EdgeCaseTest {
    const parsed = this.adapter.parse(null, null);
    return {
      name: 'Null parsing',
      description: 'parse(null) should return null',
      input: 'parse(null, null)',
      expected: 'null',
      actual: String(parsed),
      passed: parsed === null
    };
  }

  private testAllMonthNames(): EdgeCaseTest {
    const names = this.adapter.getMonthNames('long');
    return {
      name: 'All month names',
      description: 'Should return 12 month names',
      input: 'getMonthNames("long").length',
      expected: '12',
      actual: String(names.length),
      passed: names.length === 12
    };
  }

  private testMonthNamesShort(): EdgeCaseTest {
    const shortNames = this.adapter.getMonthNames('short');
    const allShort = shortNames.every(n => n.length <= 4);
    return {
      name: 'Short month names',
      description: 'Short month names should be 4 chars or less',
      input: 'getMonthNames("short")',
      expected: 'all <= 4 chars',
      actual: shortNames.join(', '),
      passed: allShort
    };
  }

  private testAdd365Days(): EdgeCaseTest {
    const start = this.adapter.createDate(2023, 0, 1);
    const end = this.adapter.addCalendarDays(start, 365);
    const isJan1_2024 = this.adapter.getYear(end) === 2024 && 
                        this.adapter.getMonth(end) === 0 &&
                        this.adapter.getDate(end) === 1;
    return {
      name: 'Add 365 days (non-leap)',
      description: 'Jan 1, 2023 + 365 days = Jan 1, 2024',
      input: 'addCalendarDays(2023-01-01, 365)',
      expected: '2024-01-01',
      actual: this.adapter.toIso8601(end),
      passed: isJan1_2024
    };
  }

  private testSubtractLargeValue(): EdgeCaseTest {
    const start = this.adapter.createDate(2024, 0, 1);
    const end = this.adapter.addCalendarDays(start, -1000);
    const isValid = this.adapter.isValid(end);
    const year = this.adapter.getYear(end);
    return {
      name: 'Subtract 1000 days',
      description: 'Large subtraction should still be valid',
      input: 'addCalendarDays(2024-01-01, -1000)',
      expected: 'valid date around 2021',
      actual: `${this.adapter.toIso8601(end)} (valid: ${isValid})`,
      passed: isValid && year >= 2020 && year <= 2022
    };
  }
}
