import 'temporal-polyfill/global';

// Test months in year for different calendars

console.log('=== Testing monthsInYear for different calendars ===\n');

// Japanese calendar
const date2017Japanese = Temporal.PlainDate.from({
  year: 2017,
  month: 1,
  day: 1,
  calendar: 'japanese'
});
console.log('Japanese calendar monthsInYear (2017):', date2017Japanese.monthsInYear);

// 2025
const date2025Japanese = Temporal.PlainDate.from({
  year: 2025,
  month: 1, 
  day: 1,
  calendar: 'japanese'
});
console.log('Japanese calendar monthsInYear (2025):', date2025Japanese.monthsInYear);

// ISO
const date2017ISO = Temporal.PlainDate.from('2017-01-01');
console.log('ISO calendar monthsInYear (2017):', date2017ISO.monthsInYear);

// Hebrew (has 13 months in leap years)
try {
  const dateHebrew = Temporal.PlainDate.from({
    year: 5777,  // Hebrew year
    month: 1,
    day: 1,
    calendar: 'hebrew'
  });
  console.log('Hebrew calendar monthsInYear:', dateHebrew.monthsInYear);
} catch (e) {
  console.log('Hebrew error:', e.message);
}

// Test month names
console.log('\n=== Testing month name formatting ===\n');

function getMonthNames(style, calendar) {
  const monthsInYear = Temporal.PlainDate.from({
    year: 2017,
    month: 1, 
    day: 1,
    calendar: calendar
  }).monthsInYear;
  
  console.log(`Calendar: ${calendar}, monthsInYear: ${monthsInYear}`);
  
  const names = [];
  for (let i = 0; i < monthsInYear; i++) {
    const date = Temporal.PlainDate.from({
      year: 2017,
      month: i + 1,
      day: 1,
      calendar: calendar
    });
    const name = date.toLocaleString('en-US', { month: style, calendar: calendar });
    names.push(name);
  }
  return names;
}

console.log('ISO months (short):');
console.log(getMonthNames('short', 'iso8601'));

console.log('\nJapanese months (short):');
console.log(getMonthNames('short', 'japanese'));

// Test the year view specific issue
console.log('\n=== Testing Year View Issue ===\n');

// Simulate what year-view.ts does
function simulateYearView(activeDate, monthsInYear) {
  console.log('Active date:', activeDate.toString());
  console.log('monthsInYear from date:', activeDate.monthsInYear);
  console.log('monthsInYear parameter:', monthsInYear);
  
  // Creates cells from 0 to monthsInYear - 1
  for (let i = 0; i < Math.min(monthsInYear, 3); i++) {
    console.log(`  Creating cell for month index ${i}`);
  }
  console.log(`  ... and ${monthsInYear - 3} more`);
}

const activeJapanese = Temporal.PlainDate.from({
  year: 2025,
  month: 1,
  day: 20,
  calendar: 'japanese'
});
simulateYearView(activeJapanese, activeJapanese.monthsInYear);

console.log('\n=== All tests complete ===');
