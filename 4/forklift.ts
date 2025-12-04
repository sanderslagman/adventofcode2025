/**
 * Advent of Code 2025 - Day 4: Forklift Paper Roll Optimization
 *
 * Help optimize forklift work by finding which paper rolls can be accessed.
 * A paper roll (@) is accessible if it has fewer than 4 adjacent paper rolls.
 *
 * Fritzo (Sander Slagman)
 */

const fs = require("node:fs");

/**
 * Represents a position on the grid with x,y coordinates
 */
interface Position {
  x: number;
  y: number;
}

/**
 * Parse the input grid from a string into a 2D array
 * @param input - String representation of the grid
 * @returns 2D array representing the grid
 */
function parseGrid(input: string): string[][] {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(""));
}

/**
 * Get all 8 adjacent positions (including diagonals) for a given position
 * @param pos - The position to get neighbors for
 * @returns Array of 8 adjacent positions
 */
function getAdjacentPositions(pos: Position): Position[] {
  const directions = [
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 }, // Top row
    { x: 0, y: -1 },
    { x: 0, y: 1 }, // Middle row (excluding center)
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 }, // Bottom row
  ];

  return directions.map((dir) => ({
    x: pos.x + dir.x,
    y: pos.y + dir.y,
  }));
}

/**
 * Check if a position is within the grid bounds
 * @param pos - Position to check
 * @param grid - The grid to check bounds against
 * @returns true if position is within bounds
 */
function isValidPosition(pos: Position, grid: string[][]): boolean {
  return (
    pos.x >= 0 && pos.x < grid.length && pos.y >= 0 && pos.y < grid[0].length
  );
}

/**
 * Count how many adjacent positions contain paper rolls (@)
 * @param pos - Position to check around
 * @param grid - The grid containing paper rolls
 * @returns Number of adjacent paper rolls (0-8)
 */
function countAdjacentPaperRolls(pos: Position, grid: string[][]): number {
  const adjacentPositions = getAdjacentPositions(pos);
  let count = 0;

  for (const adjPos of adjacentPositions) {
    if (isValidPosition(adjPos, grid) && grid[adjPos.x][adjPos.y] === "@") {
      count++;
    }
  }

  return count;
}

/**
 * Find all paper rolls that can be accessed by forklifts
 * @param grid - The grid containing paper rolls
 * @returns Array of positions that are accessible
 */
function findAccessiblePaperRolls(grid: string[][]): Position[] {
  const accessibleRolls: Position[] = [];

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === "@") {
        const adjacentCount = countAdjacentPaperRolls({ x, y }, grid);

        // A roll is accessible if it has fewer than 4 adjacent paper rolls
        if (adjacentCount < 4) {
          accessibleRolls.push({ x, y });
        }
      }
    }
  }

  return accessibleRolls;
}

/**
 * Remove accessible paper rolls from the grid and return the count removed
 * @param grid - The grid to modify (passed by reference)
 * @returns Number of rolls removed in this iteration
 */
function removeAccessibleRolls(grid: string[][]): number {
  const accessibleRolls = findAccessiblePaperRolls(grid);

  // Remove all accessible rolls by replacing them with '.'
  for (const pos of accessibleRolls) {
    grid[pos.x][pos.y] = ".";
  }

  return accessibleRolls.length;
}

/**
 * Recursively remove all possible paper rolls until no more can be accessed
 * @param grid - The grid containing paper rolls (will be modified)
 * @param iteration - Current iteration number for logging
 * @returns Total number of rolls removed across all iterations
 */
function removeAllAccessibleRolls(
  grid: string[][],
  iteration: number = 1
): number {
  const removedThisRound = removeAccessibleRolls(grid);

  if (removedThisRound === 0) {
    // No more rolls can be removed
    console.log(
      `\nStopped after ${
        iteration - 1
      } iterations. No more rolls are accessible.`
    );
    return 0;
  }

  console.log(`Iteration ${iteration}: Removed ${removedThisRound} rolls`);

  // Recursively continue removing until no more can be removed
  return removedThisRound + removeAllAccessibleRolls(grid, iteration + 1);
}

/**
 * Create a visual representation of the grid showing accessible rolls
 * @param grid - Original grid
 * @param accessibleRolls - Array of accessible roll positions
 * @returns String representation with accessible rolls marked as 'x'
 */
function visualizeAccessibleRolls(
  grid: string[][],
  accessibleRolls: Position[]
): string {
  // Create a copy of the grid
  const visualGrid = grid.map((row) => [...row]);

  // Mark accessible rolls with 'x'
  for (const pos of accessibleRolls) {
    visualGrid[pos.x][pos.y] = "x";
  }

  return visualGrid.map((row) => row.join("")).join("\n");
}

/**
 * Solve the forklift optimization problem - Part 1
 * @param input - String representation of the paper roll grid
 * @returns Number of accessible paper rolls
 */
function solvePart1(input: string): number {
  const grid = parseGrid(input);
  const accessibleRolls = findAccessiblePaperRolls(grid);
  return accessibleRolls.length;
}

/**
 * Solve the forklift optimization problem - Part 2 (Recursive removal)
 * @param input - String representation of the paper roll grid
 * @returns Total number of paper rolls that can be removed
 */
function solvePart2(input: string): number {
  const grid = parseGrid(input);
  const totalRemoved = removeAllAccessibleRolls(grid);
  return totalRemoved;
}


function main(): void {
  try {
    const input = fs.readFileSync("input.txt", "utf-8");

    console.log("=== PART 1: Initial accessible rolls ===");
    const part1Result = solvePart1(input);
    console.log(`\nPart 1 answer: ${part1Result}`);

    console.log("\n" + "=".repeat(60) + "\n");

    console.log("=== PART 2: Total removable rolls ===");
    const part2Result = solvePart2(input);
    console.log(`\nPart 2 answer: ${part2Result}`);
  } catch (error) {
    console.log(
      "Error: input.txt file not found. Please create input.txt with your puzzle input."
    );
  }
}


main();
