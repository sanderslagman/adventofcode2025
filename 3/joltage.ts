//----------------------------------------------//
//-- Battery Joltage (Advent of code day 3)   --//
//-- Fritzo (Sander Slagman)                  --//
//----------------------------------------------//

const fs = require("node:fs");

/**
 * Find the maximum joltage that can be produced from a bank of batteries
 * by selecting exactly two batteries.
 * @param bank - String of digits representing battery joltage ratings
 * @returns Maximum joltage possible from this bank
 */
function findMaxJoltage(bank: string): number {
  let maxJoltage = 0;

  // Try every combination of two batteries
  for (let i = 0; i < bank.length - 1; i++) {
    for (let j = i + 1; j < bank.length; j++) {
      // Form a two-digit number from batteries at positions i and j
      const joltage = parseInt(bank[i] + bank[j]);
      maxJoltage = Math.max(maxJoltage, joltage);
    }
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
    console.log(
      `Bank: ${bank.substring(0, 20)}... -> Max joltage: ${maxJoltage}`
    );
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
    console.log(
      `Bank: ${bank.substring(0, 20)}... -> Max joltage: ${maxJoltage}`
    );
    total += maxJoltage;
  }

  return total;
}

function run() {
  try {
    const input = fs.readFileSync("input.txt", "utf-8");
    const banks = input
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    console.log(`Loaded ${banks.length} battery banks\n`);

    console.log("=== PART 1 ===");
    const totalJoltage = calculateTotalJoltage(banks);
    console.log(`\nTotal output joltage (Part 1): ${totalJoltage}\n`);

    console.log("=== PART 2 ===");
    const totalJoltage12 = calculateTotalJoltage12(banks);
    console.log(`\nTotal output joltage (Part 2): ${totalJoltage12}`);
  } catch (error) {
    console.error("Error reading input.txt:", error);
  }
}

run();
