//----------------------------------------------//
//-- Battery Joltage (Advent of code day 3)   --//
//-- Fritzo (Sander Slagman)                  --//
//----------------------------------------------//

const fs = require("node:fs");

/**
 * Find the maximum joltage that can be produced from a bank of batteries
 * by selecting exactly two batteries.
 * Optimized: O(n) - single pass to find best pair maintaining order
 * @param bank - String of digits representing battery joltage ratings
 * @returns Maximum joltage possible from this bank
 */
function findMaxJoltage(bank: string): number {
  let maxJoltage = 0;

  // For maximum 2-digit number, we want the largest first digit
  // followed by the largest available second digit after it
  for (let i = 0; i < bank.length - 1; i++) {
    const firstDigit = bank[i];
    
    // Find the largest digit after position i
    let maxSecondDigit = bank[i + 1];
    for (let j = i + 2; j < bank.length; j++) {
      if (bank[j] > maxSecondDigit) {
        maxSecondDigit = bank[j];
      }
    }
    
    const joltage = parseInt(firstDigit + maxSecondDigit);
    maxJoltage = Math.max(maxJoltage, joltage);
  }

  return maxJoltage;
}

/**
 * Find the maximum joltage by selecting exactly 12 batteries from a bank.
 * We want the largest digits in the leftmost positions.
 * @param bank - String of digits representing battery joltage ratings
 * @returns Maximum joltage possible from selecting 12 batteries
 */
function findMaxJoltage12(bank: string): bigint {
  const batteryCount = 12;

  // Pick the largest available digit that still leaves enough batteries
  // for the remaining positions
  let result = "";
  let startIndex = 0;

  for (let pos = 0; pos < batteryCount; pos++) {
    // How many more batteries do we need after this one?
    const remaining = batteryCount - pos - 1;

    // We need to ensure we can pick 'remaining' batteries after current position
    const searchLimit = bank.length - remaining;

    // Find the largest digit in the valid range
    let maxDigit = "0";
    let maxIndex = startIndex;

    for (let i = startIndex; i < searchLimit; i++) {
      if (bank[i] > maxDigit) {
        maxDigit = bank[i];
        maxIndex = i;
      }
    }

    result += maxDigit;
    startIndex = maxIndex + 1;
  }

  return BigInt(result);
}

/**
 * Calculate the total output joltage from all battery banks
 * @param banks - Array of battery bank strings
 * @returns Total maximum joltage across all banks
 */
function calculateTotalJoltage(banks: string[]): number {
  let total = 0;

  for (const bank of banks) {
    const maxJoltage = findMaxJoltage(bank);
    total += maxJoltage;
  }

  return total;
}

/**
 * Calculate the total output joltage from all battery banks (Part 2)
 * @param banks - Array of battery bank strings
 * @returns Total maximum joltage across all banks using 12 batteries each
 */
function calculateTotalJoltage12(banks: string[]): bigint {
  let total = BigInt(0);

  for (const bank of banks) {
    const maxJoltage = findMaxJoltage12(bank);
    total += maxJoltage;
  }

  return total;
}

function run() {
  const startTime = performance.now();
  
  try {
    const input = fs.readFileSync("input.txt", "utf-8");
    const banks = input
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    console.log(`Loaded ${banks.length} battery banks\n`);

    console.log("=== PART 1 ===");
    const part1Start = performance.now();
    const totalJoltage = calculateTotalJoltage(banks);
    const part1Time = performance.now() - part1Start;
    console.log(`\nTotal output joltage (Part 1): ${totalJoltage}`);
    console.log(`⏱️  Part 1 execution time: ${part1Time.toFixed(3)}ms\n`);

    console.log("=== PART 2 ===");
    const part2Start = performance.now();
    const totalJoltage12 = calculateTotalJoltage12(banks);
    const part2Time = performance.now() - part2Start;
    console.log(`\nTotal output joltage (Part 2): ${totalJoltage12}`);
    console.log(`⏱️  Part 2 execution time: ${part2Time.toFixed(3)}ms\n`);
    
    const totalTime = performance.now() - startTime;
    console.log(`⏱️  Total execution time: ${totalTime.toFixed(3)}ms`);
  } catch (error) {
    console.error("Error reading input.txt:", error);
  }
}

run();
