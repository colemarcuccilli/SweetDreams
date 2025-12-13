
import { calculateOvertimeHours, isAfterHours } from './lib/booking-config';

console.log('--- Testing Overtime Calculation ---');

// Test Cases
const cases = [
    { start: 17, duration: 3, expected: 0, desc: "5 PM - 8 PM (No Overtime)" },
    { start: 20, duration: 2, expected: 1, desc: "8 PM - 10 PM (1h Overtime: 21-22)" },
    { start: 21, duration: 2, expected: 2, desc: "9 PM - 11 PM (2h Overtime: 21-23)" },
    { start: 12, duration: 3, expected: 0, desc: "12 PM - 3 PM (No Overtime)" },
    { start: 18, duration: 6, expected: 3, desc: "6 PM - 12 AM (3h Overtime: 21-24)" }
];

let failed = false;

cases.forEach(c => {
    const result = calculateOvertimeHours(c.start, c.duration);
    const status = result === c.expected ? 'PASS' : 'FAIL';
    console.log(`${status}: ${c.desc} | Start: ${c.start}, Duration: ${c.duration} -> Expected: ${c.expected}, Got: ${result}`);
    if (result !== c.expected) failed = true;
});

if (failed) {
    console.error('FAILED: Some pricing tests failed.');
    process.exit(1);
} else {
    console.log('SUCCESS: All pricing tests passed.');
}
