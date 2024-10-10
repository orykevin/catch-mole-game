import { Dispatch, SetStateAction } from "react";
import { debounce } from "./utils";

export type GameState = {
  isRunning: boolean;
  clicked: number;
  score: number;
  mole: number | null;
  holes: number;
  moleVisible: boolean;
};

class GameEngine {
  private isRunning: boolean;
  private clicked: number;
  private score: number;
  private mole: number | null;
  private holesCount: number;
  private holes: number;
  private setGameState: Dispatch<SetStateAction<GameState>>;
  private moleVisible: boolean;

  constructor(holesCount: number, setGameState: Dispatch<SetStateAction<GameState>>) {
    this.isRunning = false;
    this.clicked = 0;
    this.score = 0;
    this.mole = null;
    this.holesCount = holesCount;
    this.holes = holesCount;
    this.setGameState = setGameState; // Store the setGameState function
    this.moleVisible = true;
    this.debounceClick = debounce(this.debounceClick.bind(this), 800);
  }

  start() {
    this.isRunning = true;
    this.updateState(); // Call this to sync the initial state
    this.gameLoop();
  }

  stop() {
    this.isRunning = false;
    this.updateState(); // Sync the final state when the game stops
  }

  finish() {
    this.isRunning = false;
    this.moleVisible = false;
    this.updateState();
  }

  reset() {
    this.holes = this.holesCount;
    this.moleVisible = true;
    this.isRunning = true;
    this.clicked = 0;
    this.score = 0;
    this.updateState();
    this.gameLoop();
  }

  hideMole() {
    this.moleVisible = false;
    this.updateState();
  }

  showMole() {
    this.moleVisible = true;
    this.updateState();
  }

  setDifficulty(difficulty: number) {
    this.holes = difficulty;
  }

  private gameLoop() {
    if (!this.isRunning) return;

    this.moveMole();
    this.updateState(); // Update React state whenever something changes

    setTimeout(() => {
      this.gameLoop(); // Continue game loop after delay
    }, Math.random() * 200 + 200); // Random delay between 200ms and 400ms
  }

  private debounceClick() {
    this.moleVisible = true;
    this.updateState();
  }

  clickHole(index: number) {
    this.clicked += 1; // Always increment the click counter

    if (!this.moleVisible) {
      // Mole is not visible, no scoring, just update the state
      this.debounceClick();
      this.updateState();
      return;
    }else{
      // if mole is visible and the right hole is clicked
      if(index === this.mole){
        this.score += 1;
      }else{
        // if mole is visible and the wrong hole is clicked
        this.moleVisible = false;
        this.debounceClick();
      }
    }

    this.updateState(); // Update the state after clicking the hole
  }

  private moveMole() {
    this.mole = Math.floor(Math.random() * this.holes); // Mole appears in a random hole
  }

  private updateState() {
    // Call setGameState to trigger re-render with the new state
    this.setGameState({
      isRunning: this.isRunning,
      score: this.score,
      mole: this.mole,
      holes: this.holes,
      clicked: this.clicked,
      moleVisible: this.moleVisible,
    });
  }
}

export default GameEngine;
