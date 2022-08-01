import React, { useEffect, useState } from "react";
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
  const [currentGuessNumber, setCurrentGuessNumber] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const dispatch = useDispatch();
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
    dispatch(changeAnswer("magic"));
    checkGameEnd(currentGuessNumber);
  }, [currentGuessNumber]);

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentGuessPayload: GuessPayload = {
      guess: currentGuess,
      number: currentGuessNumber,
    };

    if (isGameOver) {
      return;
    }

    if (event.code === "Enter" && currentGuess.length === 5) {
      dispatch(addGuess(currentGuessPayload));
      setCurrentGuessNumber(currentGuessNumber + 1);
      setCurrentGuess("");
    } else if (event.code === "Backspace" && currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + event.key);
    } else {
      return;
    }
  };

  const checkGameEnd = (currentGuessNumber: number) => {
    if (guesses[currentGuessNumber - 1] === answer) {
      setIsGameOver(true);
    } else if (currentGuessNumber === 6) {
      setIsGameOver(true);
    }
  };

  const answer = useSelector((state: RootState) => {
    return state.answer.value;
  });

  const guesses = useSelector((state: RootState) => state.guesses.value);

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
    const isFinished = !isCurrentGuess;

    if (!isFinished) {
      return <div className={"WordleLetterBox"}>{currentChar}</div>;
    }
    if (currentChar === answer[index]) {
      return <div className={"WordleLetterBox correct"}>{currentChar}</div>;
    } else if (answer.includes(currentChar) && currentChar !== "") {
      return <div className={"WordleLetterBox misplaced"}>{currentChar}</div>;
    } else {
      return <div className={"WordleLetterBox nonexistent"}>{currentChar}</div>;
    }
  };

  const gameOver = () => {
    if ((isGameOver && currentGuessNumber < 6) || guesses[5] === answer) {
      return <div> YOU WON!</div>;
    } else if (isGameOver && currentGuessNumber === 6) {
      return <div> You LOSE! The word was {answer}</div>;
    }
  };

  const resetGame = () => {
    dispatch(clearGuess());
    setCurrentGuess("");
    setCurrentGuessNumber(0);
    setIsGameOver(false);
    // getWordFromApi();
  };

  return (
    <div className="App" tabIndex={0} onKeyDown={onKeyDownHandler}>
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
