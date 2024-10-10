import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import {
  EASY_SCORE,
  HARD_LEVEL,
  MEDIUM_LEVEL,
  MEDIUM_SCORE,
} from "./functions/constants";

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<App />);
  });

  it("renders the initial state correctly", () => {
    expect(screen.getByText("Catch the mole!")).toBeInTheDocument();
    expect(screen.getByText("Start Game")).toBeInTheDocument();
    expect(screen.getByText("Mode : Normal")).toBeInTheDocument();
  });

  it("changes mode when mode button is clicked", () => {
    const modeButton = screen.getByText("Mode : Normal");
    fireEvent.click(modeButton);
    expect(screen.getByText("Mode : Level up")).toBeInTheDocument();
  });

  it("starts the game when Start Game button is clicked", () => {
    const startButton = screen.getByText("Start Game");
    console.log(startButton);
    fireEvent.click(startButton);
    expect(screen.getByText("Game is running")).toBeInTheDocument();
    expect(screen.getByText("Score: 0")).toBeInTheDocument();
  });

  it("Start again when game is finished", () => {
    const startButton = screen.getByText("Start Game");
    fireEvent.click(startButton);
    const molePosition = screen.getByTestId("mole");
    fireEvent.click(molePosition);
    expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
    const startAgainButton = screen.getByText("Start Again");
    fireEvent.click(startAgainButton);
    expect(screen.getByText("Game is running")).toBeInTheDocument();
    expect(screen.getByText("Score: 0")).toBeInTheDocument();
  });

  it("successfully play levelup mode", async () => {
    const modeButton = screen.getByText("Mode : Normal");
    fireEvent.click(modeButton);
    expect(screen.getByText("Mode : Level up")).toBeInTheDocument();
    const startButton = screen.getByText("Start Game");
    fireEvent.click(startButton);
    const molePosition = screen.getByTestId("mole");
    fireEvent.click(molePosition);
    expect(screen.getByText(`Score: ${EASY_SCORE}`)).toMatchSnapshot();
    fireEvent.click(molePosition);
    expect(screen.getAllByTestId("hole")).toHaveLength(MEDIUM_LEVEL);
    expect(screen.getByText(`Score: ${MEDIUM_SCORE}`)).toBeInTheDocument();
    fireEvent.click(molePosition);
    expect(screen.getAllByTestId("hole")).toHaveLength(HARD_LEVEL);
    expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
  });

  it("shows score records when Records button is clicked", () => {
    const recordsButton = screen.getByText("🏆 Records");
    fireEvent.click(recordsButton);
    expect(screen.getByText("Score Records")).toBeInTheDocument();
  });
});
