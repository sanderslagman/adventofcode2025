//-----------------------------------------------------------------------------------------------//
//-- Product ID pattern repetition (Advent of code day 2)                                      --//
//-- Part 1: Find invalid product IDs that are made of digit sequences repeated twice          --//
//-- Part 2: Find invalid product IDs that are made of digit sequences repeated at least twice --//
//-- Fritzo (Sander Slagman)                                                                   --//
//-----------------------------------------------------------------------------------------------//

const fs = require("node:fs");
/**
 * Check if a number is an invalid ID (pattern repeated exactly twice) - PART 1
 * @param num - The number to check
 * @returns true if the number is invalid (pattern repeated exactly twice)
 */
function isInvalidId(num: number): boolean {
  const str = num.toString();
  const len = str.length;

  // Must have even length to be a repeated pattern
  if (len % 2 !== 0) {
    return false;
  }

  const half = len / 2;
  const firstHalf = str.substring(0, half);
  const secondHalf = str.substring(half);

  // Check if first half equals second half
  return firstHalf === secondHalf;
}

/**
 * Check if a number is an invalid ID (pattern repeated at least twice) - PART 2
 * @param num - The number to check
 * @returns true if the number is invalid (pattern repeated at least twice)
 */
function isInvalidIdRepetition(num: number): boolean {
  const str = num.toString();
  const len = str.length;

  // Try all possible pattern lengths from 1 to len/2
  for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
    // Check if the string length is divisible by pattern length
    if (len % patternLen === 0) {
      const pattern = str.substring(0, patternLen);
      const repetitions = len / patternLen;

      // Must be repeated at least twice
      if (repetitions >= 2) {
        // Check if the entire string is made of this pattern repeated
        const expectedString = pattern.repeat(repetitions);
        if (expectedString === str) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Parse a range string like "11-22" into start and end numbers
 * @param range - Range string in format "start-end"
 * @returns Object with start and end numbers
 */
function parseRange(range: string): { start: number; end: number } {
  const [start, end] = range.split("-").map(Number);
  return { start, end };
}

/**
 * Find all invalid IDs within a given range - PART 1
 * @param start - Start of the range (inclusive)
 * @param end - End of the range (inclusive)
 * @returns Array of invalid IDs in the range
 */
function findInvalidIdsInRange(start: number, end: number): number[] {
  const invalidIds: number[] = [];

  for (let i = start; i <= end; i++) {
    if (isInvalidId(i)) {
      invalidIds.push(i);
    }
  }

  return invalidIds;
}

/**
 * Find all invalid IDs within a given range - PART 2
 * @param start - Start of the range (inclusive)
 * @param end - End of the range (inclusive)
 * @returns Array of invalid IDs in the range
 */
function findInvalidIdsInRangeRepetition(start: number, end: number): number[] {
  const invalidIds: number[] = [];

  for (let i = start; i <= end; i++) {
    if (isInvalidIdRepetition(i)) {
      invalidIds.push(i);
    }
  }

  return invalidIds;
}

/**
 * Solve the gift shop problem - PART 1
 * @param input - Comma-separated string of ranges
 * @returns Sum of all invalid IDs found in all ranges
 */
function solvePattern(input: string): number {
  // Remove whitespace and split by commas
  const ranges = input
    .trim()
    .split(",")
    .filter((range) => range.length > 0);

  let totalSum = 0;
  const allInvalidIds: number[] = [];

  console.log(
    "PART 1: Analyzing ranges for invalid product IDs (pattern repeated twice)...\n"
  );

  for (const range of ranges) {
    const { start, end } = parseRange(range.trim());
    const invalidIds = findInvalidIdsInRange(start, end);

    if (invalidIds.length > 0) {
      allInvalidIds.push(...invalidIds);
      totalSum += invalidIds.reduce((sum, id) => sum + id, 0);
    } else {
    }
  }

  console.log(`\nAll invalid IDs found: ${allInvalidIds.join(", ")}`);
  console.log(`Total sum of invalid IDs: ${totalSum}`);

  return totalSum;
}

/**
 * Solve the gift shop problem - PART 2
 * @param input - Comma-separated string of ranges
 * @returns Sum of all invalid IDs found in all ranges
 */
function solvePatternMultiple(input: string): number {
  // Remove whitespace and split by commas
  const ranges = input
    .trim()
    .split(",")
    .filter((range) => range.length > 0);

  let totalSum = 0;
  const allInvalidIds: number[] = [];

  console.log(
    "PART 2: Analyzing ranges for invalid product IDs (pattern repeated at least twice)...\n"
  );

  for (const range of ranges) {
    const { start, end } = parseRange(range.trim());
    const invalidIds = findInvalidIdsInRangeRepetition(start, end);

    if (invalidIds.length > 0) {
      allInvalidIds.push(...invalidIds);
      totalSum += invalidIds.reduce((sum, id) => sum + id, 0);
    } else {
    }
  }

  console.log(`\nAll invalid IDs found: ${allInvalidIds.join(", ")}`);
  console.log(`Total sum of invalid IDs: ${totalSum}`);

  return totalSum;
}

/**
 * Read puzzle input from a file and solve both parts
 */
function solvePuzzle(): void {
  try {
    const input = fs.readFileSync("input.txt", "utf-8");
    console.log("=== Solving with input.txt ===\n");

    console.log("--- PART 1 ---");
    const result1 = solvePattern(input);
    console.log(`\nPart 1 answer: ${result1}\n`);

    console.log("--- PART 2 ---");
    const result2 = solvePatternMultiple(input);
    console.log(`\nPart 2 answer: ${result2}`);
  } catch (error) {
    console.log(
      "Error: input.txt file not found. Please create input.txt with your puzzle input."
    );
  }
}

// Main execution
solvePuzzle();
