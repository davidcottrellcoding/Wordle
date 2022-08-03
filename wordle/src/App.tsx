import React, { RefObject, useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./app/store";
import { changeAnswer } from "./features/answerSlice";
import { addGuess, clearGuess, GuessPayload } from "./features/guessesSlice";

// const API_URL =
//   "https://random-words5.p.rapidapi.com/getMultipleRandom?count=5&wordLength=5";

function App() {
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const appRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  //Typically would hold both these in local state but wanted to show react-redux experience
  const answer = useSelector((state: RootState) => {
    return state.answer.value;
  });

  const submittedGuesses = useSelector(
    (state: RootState) => state.submittedGuesses.value
  );

  const previousGuessCorrect = () => {
    if (currentGuessIndex === -1) {
      return submittedGuesses[5] === answer;
    } else {
      return submittedGuesses[currentGuessIndex - 1] === answer;
    }
  };
  // const options = {
  //   method: "GET",
  //   headers: {
  //     "X-RapidAPI-Key": "49a2599b55mshc26eedbb1196419p19d2e7jsne31d99271c3d",
  //     "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
  //   },
  // };

  // const getWordFromApi = async () => {
  //   const apiResponse = await fetch(API_URL, options);
  //   const apiJson = await apiResponse.json();

  //   dispatch(changeAnswer(apiJson[Math.floor(Math.random() * apiJson.length)]));
  // };

  // useEffect(() => {
  //   getWordFromApi();
  // }, []);

  useEffect(() => {
    dispatch(changeAnswer("david"));
  }, []);

  useEffect(() => {
    const currentGuessIndex = submittedGuesses.findIndex(
      (guess) => guess === null
    );

    const checkGameEnd = () => {
      if (submittedGuesses[currentGuessIndex - 1] === answer) {
        setIsGameOver(true);
      } else if (currentGuessIndex === -1) {
        setIsGameOver(true);
      }
    };

    checkGameEnd();

    //Keep the browser in focus to allow button presses after any keyboard event
    if (appRef && appRef.current) {
      appRef.current.focus();
    }

    setCurrentGuessIndex(currentGuessIndex);
  }, [answer, submittedGuesses]);

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentGuessPayload: GuessPayload = {
      guess: currentGuess.toLowerCase(),
      number: currentGuessIndex,
    };

    if (isGameOver) {
      if (event.code === "Enter") {
        userResetGame();
      }
      return;
    }

    if (event.code === "Enter" && currentGuess.length === 5) {
      dispatch(addGuess(currentGuessPayload));
      setCurrentGuess("");
    } else if (event.code === "Backspace" && currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + event.key);
    } else {
      return;
    }
  };

  const userResetGame = () => {
    dispatch(clearGuess());
    setCurrentGuess("");
    setIsGameOver(false);
    // getWordFromApi();
  };

  const GameOver = () => {
    if (!isGameOver) return null;

    if (previousGuessCorrect()) {
      return (
        <div>
          <div> You Won!</div>
          <div> Press Enter or click below to play!</div>
        </div>
      );
    }
    return (
      <div>
        <div> You LOSE! The word was {answer}</div>
        <div> Press Enter or click below to try again!</div>
      </div>
    );
  };

  const Lines = () => {
    const lines = submittedGuesses.map((guess, index) => (
      <Line userGuess={guess} lineIndex={index} />
    ));

    return <div>{lines}</div>;
  };

  const Line = ({
    userGuess,
    lineIndex,
  }: {
    userGuess: string;
    lineIndex: number;
  }) => {
    const letterBoxCharacters = [];
    const isCurrentGuess = lineIndex === currentGuessIndex;

    // If it is the current guess push the current guess letters on, otherwise put the submitted values into box
    if (isCurrentGuess) {
      for (let i = 0; i < currentGuess.length; i++) {
        letterBoxCharacters.push(currentGuess[i]);
      }
    } else if (userGuess) {
      for (let i = 0; i < userGuess.length; i++) {
        letterBoxCharacters.push(userGuess[i]);
      }
    }

    //Fill rest of slots with empty string to make sure all boxes
    while (letterBoxCharacters.length < 5) {
      letterBoxCharacters.push("");
    }

    return (
      <div className={"WordleLine"}>
        {letterBoxCharacters.map((character, index) => (
          <LetterBox
            currentChar={character}
            isCurrentGuess={isCurrentGuess}
            index={index}
          />
        ))}
      </div>
    );
  };

  const LetterBox = ({
    currentChar,
    index,
    isCurrentGuess,
  }: {
    currentChar: string;
    index: number;
    isCurrentGuess: boolean;
  }) => {
    let letterBoxClassName = "WordleLetterBox";
    if (currentChar === answer[index]) {
      letterBoxClassName += " correct";
    } else if (answer.includes(currentChar) && currentChar !== "") {
      letterBoxClassName += " misplaced";
    } else if (!isCurrentGuess) {
      letterBoxClassName += " nonexistent";
    }
    return (
      <div className={isCurrentGuess ? "WordleLetterBox" : letterBoxClassName}>
        {currentChar}
      </div>
    );
  };

  return (
    <div
      className="App"
      tabIndex={-1}
      onKeyDown={onKeyDownHandler}
      ref={appRef}
    >
      <div className={"WordleTitle"}>Wordle</div>
      <div className={"WordleGrid"}>
        <Lines />
      </div>
      <div className={"WordleEndGame"}>
        {isGameOver ? (
          <div>
            <GameOver />
            <button onClick={() => userResetGame()}> Play again</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
