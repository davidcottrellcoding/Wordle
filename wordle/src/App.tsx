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
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  //Typically would hold both these in local state but wanted to show react-redux experience
  const answer = useSelector((state: RootState) => {
    return state.answer.value;
  });

  const guesses = useSelector((state: RootState) => state.guesses.value);
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
  }, [dispatch]);

  useEffect(() => {
    const checkGameEnd = (currentGuessIndex: number) => {
      if (guesses[currentGuessIndex - 1] === answer) {
        setIsGameOver(true);
      } else if (currentGuessIndex === 6) {
        setIsGameOver(true);
      }
    };

    checkGameEnd(currentGuessIndex);
    if (appRef && appRef.current) {
      appRef.current.focus();
    }
  }, [answer, currentGuessIndex, guesses]);

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentGuessPayload: GuessPayload = {
      guess: currentGuess,
      number: currentGuessIndex,
    };

    if (isGameOver) {
      return;
    }

    if (event.code === "Enter" && currentGuess.length === 5) {
      dispatch(addGuess(currentGuessPayload));
      setCurrentGuessIndex(currentGuessIndex + 1);
      setCurrentGuess("");
    } else if (event.code === "Backspace" && currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + event.key);
    } else {
      return;
    }
  };

  const createLines = () => {
    const lines = guesses.map((guess, index) => (
      <Line guess={guess} lineIndex={index} />
    ));

    return <div>{lines}</div>;
  };

  const Line = ({ guess, lineIndex }: { guess: string; lineIndex: number }) => {
    const letterBoxCharacters = [];
    const isCurrentGuess =
      lineIndex === guesses.findIndex((value) => value == null);
    if (isCurrentGuess) {
      for (let i = 0; i < currentGuess.length; i++) {
        letterBoxCharacters.push(currentGuess[i]);
      }
    } else if (guess) {
      for (let i = 0; i < guess.length; i++) {
        letterBoxCharacters.push(guess[i]);
      }
    }

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
    if (isCurrentGuess) {
      return <div className={letterBoxClassName}>{currentChar}</div>;
    }
    if (currentChar === answer[index]) {
      letterBoxClassName += " correct";
    } else if (answer.includes(currentChar) && currentChar !== "") {
      letterBoxClassName += " misplaced";
    } else {
      letterBoxClassName += " nonexistent";
    }
    return <div className={letterBoxClassName}>{currentChar}</div>;
  };

  const gameOver = () => {
    if ((isGameOver && currentGuessIndex < 6) || guesses[5] === answer) {
      return <div> YOU WON!</div>;
    } else if (isGameOver && currentGuessIndex === 6) {
      return <div> You LOSE! The word was {answer}</div>;
    }
  };

  const resetGame = () => {
    dispatch(clearGuess());
    setCurrentGuess("");
    setCurrentGuessIndex(0);
    setIsGameOver(false);
    // getWordFromApi();
  };

  return (
    <div className="App" tabIndex={0} onKeyDown={onKeyDownHandler} ref={appRef}>
      <div className={"WordleTitle"}>Wordle</div>
      <div className={"WordleGrid"}>{createLines()}</div>
      <div>{gameOver()}</div>
      {isGameOver ? (
        <button onClick={() => resetGame()}> Play again</button>
      ) : null}
    </div>
  );
}

export default App;
