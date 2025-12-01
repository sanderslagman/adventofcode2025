//----------------------------------------------//
//-- Cracking The Safe (Advent of code day 1) --//
//-- Fritzo (Sander Slagman)                  --//
//----------------------------------------------//

const readline = require("node:readline");
const fs = require("node:fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Safe {
  private nums: number;
  private start: number;
  private checkValue: number;
  private landedCounter: number = 0;
  private passedCounter: number = 0;

  constructor(nums: number = 100, start: number = 50, checkValue: number = 0) {
    this.nums = nums;
    this.start = start;
    this.checkValue = checkValue;
  }

  rotateKnob(steps: string[]): string {
    const numbers = this.extractNumbersfromSteps(steps);
    let currentPosition = this.start;

    for (const num of numbers) {
      const previousPosition = currentPosition;
      this.passedCounter += this.countPassThroughs(previousPosition, num);
      
      currentPosition = (currentPosition + num) % this.nums;
      if (currentPosition < 0) {
        currentPosition += this.nums;
      }

      if (currentPosition === this.checkValue) {
        this.landedCounter++;
      }
    }
    
    return `Landed at check value (${this.checkValue}) ${this.landedCounter} times.\nPassed through check value ${this.passedCounter} times.`;
  }

  countPassThroughs(from: number, steps: number): number {
    if (steps === 0) return 0;
    
    const absSteps = Math.abs(steps);
    const fullRotations = Math.floor(absSteps / this.nums);
    const remainder = absSteps % this.nums;
    
    let count = fullRotations; // Each full rotation passes checkValue once
    
    // Check if the partial rotation passes through checkValue
    if (steps > 0) {
      // Moving right/forward
      const to = (from + remainder) % this.nums;
      if (from < to) {
        // No wrap: check if checkValue is in range
        if (this.checkValue > from && this.checkValue <= to) {
          count++;
        }
      } else if (remainder > 0) {
        // Wrapped: check if checkValue is after from OR at/before to
        if (this.checkValue > from || this.checkValue <= to) {
          count++;
        }
      }
    } else {
      // Moving left/backward
      const to = ((from - remainder) % this.nums + this.nums) % this.nums;
      if (from > to) {
        // No wrap: check if checkValue is in range
        if (this.checkValue < from && this.checkValue >= to) {
          count++;
        }
      } else if (remainder > 0) {
        // Wrapped: check if checkValue is before from OR at/after to
        if (this.checkValue < from || this.checkValue >= to) {
          count++;
        }
      }
    }
    
    return count;
  }

  extractNumbersfromSteps(steps: string[]): number[] {
    return steps.map((step) => {
      const direction = step[0];
      const value = parseInt(step.slice(1));
      return direction === "R" ? value : -value;
    });
  }
}

async function run() {
  let numsOnKnob = 100;
  let startPosition = 50;
  let checkValue = 0;
  let steps: string[] = [];
  
  try {
    const fileContent = fs.readFileSync("combination.txt", "utf-8");
    steps = fileContent
      .split("\n")
      .map((step: string) => step.trim())
      .filter((s: string) => s.length > 0);
    console.log(`Loaded ${steps.length} steps from file`);
  } catch (error) {
    console.error("Error reading combination.txt:", error);
    rl.close();
    return;
  }
  
  await new Promise<void>((resolve) => {
    rl.question(
      "Enter the amount of numbers on the knob (default 100): ",
      (answer: string) => {
        numsOnKnob = answer ? parseInt(answer) : 100;
        resolve();
      }
    );
  });
  
  await new Promise<void>((resolve) => {
    rl.question(
      "Enter the starting position (default 50): ",
      (answer: string) => {
        startPosition = answer ? parseInt(answer) : 50;
        resolve();
      }
    );
  });
  
  await new Promise<void>((resolve) => {
    rl.question(
      "Enter the value to check for (default 0): ",
      (answer: string) => {
        checkValue = answer ? parseInt(answer) : 0;
        resolve();
      }
    );
  });
  
  rl.close();
  
  const safe = new Safe(numsOnKnob, startPosition, checkValue);
  const result = safe.rotateKnob(steps);
  console.log(result);
}
run();

