import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { Hole } from "./components/Hole";
import useTimer from "./hooks/useTimer";
import { formatTime } from "./functions/utils";
import GameEngine, { GameState } from "./functions/gameEngine";
import {
  EASY_LEVEL,
  EASY_SCORE,
  HARD_LEVEL,
  HARD_SCORE,
  MEDIUM_LEVEL,
  MEDIUM_SCORE,
} from "./functions/constants";
import { setNewRecord } from "./functions/records";
import { ScoreRecords } from "./components/ScoreRecords";

function App() {
  const [mode, setMode] = useState("normal");
  const modeName = mode === "normal" ? "Normal" : "Level up";
  const [recordTracker, setRecordTracker] = useState<string[] | null>(null); //hold new record values
  const [showScoreRecords, setShowScoreRecords] = useState(false); //show score records
  const [isFinished, setIsFinished] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    isRunning: false,
    score: 0,
    mole: null,
    moleVisible: true,
    holes: EASY_LEVEL, // Number of holes in the game
    clicked: 0,
  }); // initial state of the game

  const timer = useTimer();

  const gameEngine = useMemo(() => {
    return new GameEngine(EASY_LEVEL, setGameState);
  }, []); // running the game with gameEngine

  const startGameHandler = () => {
    setRecordTracker(null); // always reset record tracker on new game
    if (isFinished) {
      gameEngine.reset();
      timer.reset();
      timer.start();
      setIsFinished(false);
    } else {
      gameEngine.start();
      timer.start();
    }
  };

  const clickHoleHandler = (index: number) => {
    gameEngine.clickHole(index); // Call the clickHole method
  };

  const handleFinishGame = () => {
    gameEngine.finish();
    setIsFinished(true);
    timer.stop();
    // set new record to local storage if game is finished
    const recordTrack = setNewRecord({
      mode: modeName,
      clicked: gameState.clicked,
      accuracy: (gameState.score / gameState.clicked) * 100,
      score: gameState.score,
      time: timer.time,
      date: new Date(),
    });
    // show new record if there is a new record
    if (recordTrack) {
      setRecordTracker(recordTrack);
    }
  };

  const handleCloseScoreRecords = useCallback(() => {
    setShowScoreRecords(false);
  }, []); //useCallback to memoize the function when pass to children

  useEffect(() => {
    if (gameState.score >= HARD_SCORE) {
      handleFinishGame();
    } else if (gameState.score >= MEDIUM_SCORE) {
      // continue the level if the score is greater than MEDIUM_SCORE
      gameEngine.setDifficulty(HARD_LEVEL);
    } else if (gameState.score >= EASY_SCORE) {
      if (mode === "normal") {
        //it's finish the game in the first score when normal mode
        gameEngine.finish();
        setIsFinished(true);
        handleFinishGame();
      } else {
        //if not normal mode continue the level if the score is greater than EASY_SCORE
        gameEngine.setDifficulty(MEDIUM_LEVEL);
      }
    }
    //eslint-disable-next-line
  }, [gameState.score, gameState.holes, setIsFinished, gameEngine]);

  return (
    <>
      {!gameState?.isRunning && (
        <div className="header-btn">
          <button
            onClick={() => setMode(mode === "normal" ? "levelup" : "normal")}
          >
            Mode : {modeName}
          </button>
          <button onClick={() => setShowScoreRecords(true)}>🏆 Records</button>
        </div>
      )}

      <div className="container">
        {!gameState.isRunning && <h1 className="title">Catch the mole!</h1>}

        {isFinished && (
          <>
            {!recordTracker ? (
              <p className="congrats">
                Congratulations! you catch the mole in {timer.time} seconds
              </p>
            ) : (
              <p className="congrats">
                Congratulations! New Record for {recordTracker.join(", ")}
              </p>
            )}
          </>
        )}

        {gameState?.isRunning && !isFinished && (
          <p className="timer">
            Time: <span className="time">{formatTime(timer.time)}</span>
          </p>
        )}

        {(gameState?.isRunning || isFinished) && (
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <p>Clicked : {gameState?.clicked} </p>
            <p className="score">Score: {gameState.score}</p>
            <p>
              Accuracy :{" "}
              {gameState.clicked
                ? ((gameState.score / gameState.clicked) * 100).toFixed(2)
                : 0}{" "}
              %
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="hole-container">
          {gameState &&
            [...Array(gameState?.holes)].map((_, index) => (
              <Hole
                isMoleVisible={
                  gameState.mole === index && gameState.moleVisible
                }
                key={index}
                onClick={() => gameState?.isRunning && clickHoleHandler(index)}
              />
            ))}
        </div>

        <button
          disabled={gameState.isRunning}
          className="start-button"
          onClick={() => startGameHandler()}
        >
          {isFinished
            ? "Start Again"
            : gameState.isRunning
            ? "Game is running"
            : "Start Game"}
        </button>
      </div>
      {showScoreRecords && <ScoreRecords onClose={handleCloseScoreRecords} />}
    </>
  );
}

export default App;
