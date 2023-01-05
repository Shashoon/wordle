const appDisplay = document.querySelector('.app-container')
const tiles = document.querySelector(".tiles-container");
const keyboard = document.querySelector(".keyboard-container");
const messageDisplay = document.querySelector(".message-container");

let wordle;

const getWordle = () => {
  fetch("http://localhost:8000/word")
    .then((response) => response.json())
    .then((json) => {
      wordle = json.toUpperCase();
    })
    .catch((err) => console.log(err));
};

getWordle();

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "<<",
];

const tilesRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let curentRow = 0;
let currentCube = 0;
let isGameOver = false;
let isShowModal = false;

tilesRows.forEach((row, rowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "cubeRow-" + rowIndex);

  tilesRows.forEach((_cube, cubeIndex) => {
    if (cubeIndex < 5) {
      const cubeElement = document.createElement("div");

      cubeElement.setAttribute(
        "id",
        "cubeRow-" + rowIndex + "-cube-" + cubeIndex
      );

      cubeElement.classList.add("cube");
      rowElement.append(cubeElement);
    }
  });

  tiles.append(rowElement);
});

const help = document.getElementById("question").addEventListener("click", () => {
    const modal = document.getElementById('modal');

    /*if (modal.style.display === 'none') {
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none'
    }*/

    modal.classList.toggle('hideModal')
    
});


const handleClick = (letter) => {
  if (!isGameOver) {
    if (letter === "<<") {
      deleteLetter();
      return;
    }

    if (letter === "ENTER") {
      checkRow();
      return;
    }

    addLetter(letter);
  }
};

keys.forEach((curr) => {
  const button = document.createElement("button");
  button.textContent = curr;
  button.setAttribute("id", curr);
  button.addEventListener("click", () => handleClick(curr));
  keyboard.append(button);
});

const addLetter = (letter) => {
  if (curentRow < 6 && currentCube < 5) {
    const cube = document.getElementById(
      "cubeRow-" + curentRow + "-cube-" + currentCube
    );

    cube.textContent = letter;
    tilesRows[curentRow][currentCube] = letter;
    cube.setAttribute("data", letter);
    currentCube++;
  }
};

const deleteLetter = () => {
  if (currentCube > 0) {
    currentCube--;
    const cube = document.getElementById(
      "cubeRow-" + curentRow + "-cube-" + currentCube
    );

    cube.textContent = "";
    tilesRows[curentRow][currentCube] = "";
    cube.setAttribute("data", "");
  }
};

const checkRow = () => {
  const guess = tilesRows[curentRow].join("");

  if (currentCube > 4) {
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.valid == false) {
          showMessage("Word not in list");
          return;
        } else {
          flipCube();
          if (wordle == guess) {
            showMessage("Amazing!");
            isGameOver = true;
            return;
          } else {
            if (curentRow >= 5) {
              isGameOver = true;
              showMessage("Game Over");
              return;
            }
            if (curentRow < 5) {
              curentRow++;
              currentCube = 0;
            }
          }
        }
      });
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement("p");

  messageElement.textContent = message;

  messageDisplay.append(messageElement);

  setTimeout(() => messageDisplay.removeChild(messageElement), 2600);
};

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);

  key.classList.add(color);
};

const flipCube = () => {
  const rowCubes = document.querySelector("#cubeRow-" + curentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowCubes.forEach((cube) => {
    guess.push({
      letter: cube.getAttribute("data"),
      color: "grey-cube",
    });
  });

  guess.forEach((curr, index) => {
    if (curr.letter == wordle[index]) {
      curr.color = "green-cube";
      checkWordle = checkWordle.replace(curr.letter, "");
    }
  });

  guess.forEach((curr, index) => {
    if (checkWordle.includes(curr.letter)) {
      curr.color = "yellow-cube";
      checkWordle = checkWordle.replace(curr.letter, "");
    }
  });

  rowCubes.forEach((curr, index) => {
    setTimeout(() => {
      curr.classList.add("flip");
      curr.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};
