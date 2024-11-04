import { useState, useEffect } from "react";
import Line from "./Line";
import useConnection from "./Internethook";

function App() {
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [words, setWords] = useState();
  const [play, setPlay] = useState(false);
  const [gameover, setGameOver] = useState(false);
  const online = useConnection();

  console.log(online);

  const checkWordValidity = async (word) => {
    if (word.length !== 5) {
      console.error("Word must be 5 letters long");
      return;
    }

    try {
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${word}&max=1`
      );
      const data = await response.json();

      if (data.length > 0 && data[0].word === word) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching word validity:", error);
    }
  };

  useEffect(() => {
    const fetchWords = async (length) => {
      try {
        const response = await fetch(
          `https://api.datamuse.com/words?sp=${"?".repeat(length)}&max=10`
        );
        const data = await response.json();

        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setWords(data[randomIndex].word);
        } else {
          console.log("No words found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchWords(5);
  }, []);

  useEffect(() => {
    const handleType = async (event) => {
      const { key } = event;

      if (key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length < 5 && !/^[a-zA-Z]$/.test(key)) {
        return;
      }

      if (currentGuess.length >= 5 && key !== "Enter") {
        return;
      }

      if (key === "Enter" && currentGuess.length == 5) {
        const valodOrnot = await checkWordValidity(currentGuess);
        if (!valodOrnot) {
          alert("Wrong word");
          return;
        }

        const firstEmptyIndex = guesses.findIndex((g) => g === "");
        guesses[firstEmptyIndex] = currentGuess;

        let won = true;
        for (let i = 0; i < 5; i++) {
          const id = i + "" + firstEmptyIndex;
          const guessedWord = guesses[firstEmptyIndex];

          if (guessedWord[i] === words[i]) {
            document.getElementById(id)?.classList.add("bg-green-300");
          } else if (words.includes(guessedWord[i])) {
            document.getElementById(id)?.classList.add("bg-yellow-300");
            won = false;
          } else {
            document.getElementById(id)?.classList.add("bg-gray-200");
            won = false;
          }
        }

        for (let i = 0; i < 5; i++) {
          document
            .getElementById(i + "" + firstEmptyIndex)
            .classList.add("border-2", "border-blue-300");
        }

        if (won) {
          window.alert("you won");
        } else if (firstEmptyIndex == 5 && !won) {
          setGameOver(true);
          window.alert("You Lost");
        }

        setCurrentGuess("");
        return;
      }

      setCurrentGuess(currentGuess + key);
    };

    window.addEventListener("keydown", handleType);

    return () => {
      window.removeEventListener("keydown", handleType);
    };
  }, [currentGuess]);

  return (
    <div className="flex flex-col justify-center align-middle items-center rounded-lg m-5 p-5">
      {online ? (
        <h1 className="absolute top-5 left-5 text-green-500 text-lg font-semibold text-start">
          Online
        </h1>
      ) : (
        <h1 className="absolute top-5 left-5 text-red-500 text-lg font-semibold text-start">
          Offline
        </h1>
      )}
      <div className="flex flex-col justify-centert gap-10 max-w-lg shadow-sm p-3 rounded-lg">
        <div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-5 transform transition-transform duration-300 hover:scale-110">
            AlphaGuess
          </h1>

          {gameover ? (
            <h1 className="text-2xl font-semibold m-5 text-center text-green-600">Correct Word : {words}</h1>
          ) : null}

          {guesses.map((guess, index) => {
            const firstEmptyIndex = guesses.findIndex((g) => g === "");
            return (
              <Line
                index={index}
                key={index}
                guess={index === firstEmptyIndex ? currentGuess : guess}
              />
            );
          })}
        </div>
        <div className="flex justify-center">
          <button
            className="border border-black rounded-lg p-2 font-medium"
            onClick={() => {
              location.reload();
            }}
          >
            New Game
          </button>
        </div>
      </div>

      {/* Button to trigger play */}
      <button
        className="absolute top-0 right-5 mt-5 bg-blue-200 border border-red-400 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transform transition-all duration-300 hover:scale-105"
        onClick={() => {
          setPlay(!play);
        }}
      >
        {play ? "❓" : "❔"}
      </button>

      {/* Notification Div */}
      {play && (
        <div className="absolute m-5 top-20 bg-green-500 text-white p-4 rounded-lg shadow-lg animate-slide-up transition-opacity duration-500 ease-in-out opacity-100">
          <div className="bg-white shadow-lg p-4 rounded-lg text-center max-w-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">
              How to Play
            </h2>
            <p className="text-gray-700 text-lg">
              Guess the 5-letter word in 6 tries! After each guess, the tiles
              will change color to give you clues:
            </p>
            <ul className="mt-3 text-left space-y-2">
              <li className="text-yellow-500">
                <strong>Yellow:</strong> The letter is in the word, but in the
                wrong spot.
              </li>
              <li className="text-green-500">
                <strong>Green:</strong> The letter is in the correct spot.
              </li>
              <li className="text-gray-500">
                <strong>Gray:</strong> The letter is not in the word at all.
              </li>
            </ul>
            <p className="mt-4 text-gray-600">
              Use your keyboard to enter letters and hit "Enter" to submit your
              guess.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
