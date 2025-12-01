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
  private safe: number[] = [];
  private checkValue: number;
  private counter: number = 0;

  constructor(
    _nums: number = 100,
    _start: number = 50,
    _checkValue: number = 0
  ) {
    this.nums = _nums;
    this.start = _start;
    this.checkValue = _checkValue;
    this.initSafe();
  }

  initSafe() {
    for (let i = 0; i < this.nums - 1; i++) {
      //Safe numbers -1 to add 0 as number
      this.safe.push(i);
    }
  }

  rotateKnob(steps: string[]) {
    const numbers = this.extractNumbersfromSteps(steps);
    let currentPosition = this.start;

    for (const num of numbers) {
      currentPosition = (currentPosition + num) % this.nums;
      if (currentPosition < 0) {
        currentPosition += this.nums;
      }

      if (currentPosition === this.checkValue) {
        this.counter++;
      }
    }
    return `Landed at check value (${this.checkValue}) ${this.counter} times.`;
  }

  extractNumbersfromSteps(steps: string[]): number[] {
    const numbers: number[] = [];

    for (const step of steps) {
      const direction = step[0];
      const value = parseInt(step.slice(1));

      if (direction === "R") {
        numbers.push(value);
      } else if (direction === "L") {
        numbers.push(-value);
      }
    }

    return numbers;
  }
}

async function run() {
    let numsOnKnob: number = 100;
    let startPosition: number = 50;
    let checkValue: number = 0;
    let steps: string[] = [];
  
  // Read steps from combination.txt
  try {
    const fileContent = fs.readFileSync("combination.txt", "utf-8");
    steps = fileContent.split("\n").map((step: string) => step.trim()).filter((s: string) => s.length > 0);
    console.log("Steps loaded from file:", steps);
  } catch (error) {
    console.error("Error reading combination.txt:", error);
    rl.close();
    return;
  }
  
  await new Promise<void>((resolve) => {
    rl.question(
      "Enter the amount of numbers on the knob (default 100), (0-99 is a 100 numbers.): ",
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
  
  let safe = new Safe(numsOnKnob, startPosition, checkValue);
  const result = safe.rotateKnob(steps);
  console.log(result);
}
run();

