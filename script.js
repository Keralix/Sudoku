// Variable to store the currently selected number
let selectedNumber;
let sudoku;
let difficulty = 1;
// Function to handle selecting a number from the buttons
function selectNumber(number) {
  selectedNumber = number;
  // Remove 'selected' class from all buttons
  const buttons = document.querySelectorAll(".number-button");
  buttons.forEach((button) => {
    button.classList.remove("selected");
    if (
      number === parseInt(button.innerHTML) ||
      (number === 0 && button.innerHTML == "Delete")
    ) {
      button.classList.add("selected");
    }
  });

  // Add 'selected' class to the clicked button
  event.target.classList.add("selected");
}
addEventListener("keydown", (e) => {
  switch (e.key) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      selectNumber(parseInt(e.key));
      break;
    default:
      break;
  }
});
// Add click event listener to all table cells
const cells = document.querySelectorAll("#sudokuGrid td");
const tbRows = document.querySelectorAll("#sudokuGrid tr");
const winContainer = document.getElementById("win-container");
const easyBtn = document.getElementById("easy-difficulty");
const mediumBtn = document.getElementById("normal-difficulty");
const hardBtn = document.getElementById("hard-difficulty");
const tableElement = document.getElementById("game");
const saveBtn = document.getElementById("save-button");
const loadBtn = document.getElementById("load-button");

saveBtn.addEventListener("click", () => {
  localStorage.clear();
  localStorage.setItem("save", sudoku);
  let zadani = createSave();
  localStorage.setItem("zadani", zadani);
  loadBtn.disabled = false;
});
loadBtn.addEventListener("click", () => {
  sudoku = loadSudoku(localStorage.getItem("save").replaceAll(",", ""));
  let zadani = loadZadane(localStorage.getItem("zadani").replaceAll(",", ""));
  console.log(zadani);
  //ispiši spremljeni sudoku
  cells.forEach((cell) => {
    if (sudoku[Number(cell.ariaRowIndex)][Number(cell.ariaColIndex)] != 0) {
      cell.textContent =
        sudoku[Number(cell.ariaRowIndex)][Number(cell.ariaColIndex)];
      if (cell.classList.contains("grezo")) {
        cell.classList.remove("grezo");
      }
      if (zadani.length !== 0)
        if (
          Number(cell.ariaRowIndex) === zadani[0][0] &&
          Number(cell.ariaColIndex) === zadani[0][1]
        ) {
          cell.classList.add("grezo");
          zadani.shift();
        }
    } else {
      if (cell.classList.contains("grezo")) {
        cell.classList.remove("grezo");
      }
      cell.textContent = "";
    }
  });
  checkWholeTable();
  tableElement.style.display = "flex";
});
easyBtn.addEventListener("click", () => {
  cells.forEach((cell) => {
    cell.textContent = "";
  });
  difficulty = 21;
  winContainer.style.display = "none";
  begin();
});
mediumBtn.addEventListener("click", () => {
  cells.forEach((cell) => {
    cell.textContent = "";
  });
  difficulty = 42;
  winContainer.style.display = "none";
  begin();
});
hardBtn.addEventListener("click", () => {
  cells.forEach((cell) => {
    cell.textContent = "";
  });
  difficulty = 52;
  winContainer.style.display = "none";
  begin();
});

const clearSudoku = () => {
  selectedNumber = 1;
  sudoku = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  cells.forEach((cell) => {
    if (cell.classList.contains("grezo")) cell.classList.remove("grezo");
    if (cell.classList.contains("not-safe")) cell.classList.remove("not-safe");
  });
  tableElement.style.display = "flex";
};

const begin = () => {
  clearSudoku();
  start();
  fillRest();
  removeNumbers(difficulty);
  fill();
};

cells.forEach((cell) => {
  cell.addEventListener("click", function () {
    // Insert the selected number into the clicked cell
    if (selectedNumber !== 0) {
      if (!cell.classList.contains("grezo")) {
        this.textContent = selectedNumber;
        if (
          !checkIfSafe(
            Number(cell.ariaRowIndex),
            Number(cell.ariaColIndex),
            selectedNumber
          )
        ) {
          cell.classList.add("not-safe");
        } else {
          cell.classList.remove("not-safe");
        }
        sudoku[Number(cell.ariaRowIndex)][cell.ariaColIndex] = selectedNumber;
      }
      checkWholeTable();
    } else {
      if (!cell.classList.contains("grezo")) {
        this.textContent = "";
        sudoku[Number(cell.ariaRowIndex)][Number(cell.ariaColIndex)] = 0;
        cell.classList.remove("not-safe");
      }
      checkWholeTable();
    }
    winCondition();
  });
});

const fill = () => {
  cells.forEach((cell) => {
    if (sudoku[Number(cell.ariaRowIndex)][Number(cell.ariaColIndex)] != 0) {
      cell.textContent =
        sudoku[Number(cell.ariaRowIndex)][Number(cell.ariaColIndex)];
      cell.classList.add("grezo");
    }
  });
};

const checkIfSafe = (i, j, n) => {
  // Provjera retka i stupca
  for (let x = 0; x < 9; x++) {
    if ((sudoku[i][x] === n && x !== j) || (sudoku[x][j] === n && x !== i)) {
      return false;
    }
  }

  // Provjera 3x3 podmreže
  const startRow = i - (i % 3);
  const startCol = j - (j % 3);
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (
        sudoku[startRow + x][startCol + y] === n &&
        startRow + x != i &&
        startCol + y != j
      )
        return false;
    }
  }

  return true;
};

const checkWholeTable = () => {
  let i, j;
  cells.forEach((cell) => {
    i = parseInt(cell.ariaRowIndex);
    j = parseInt(cell.ariaColIndex);
    if (!checkIfSafe(i, j, sudoku[i][j]) && sudoku[i][j] != 0) {
      cell.classList.add("not-safe");
    } else cell.classList.remove("not-safe");
  });
};

const randomGenerator = () => {
  return Math.floor(Math.random() * 9) + 1;
};
const start = () => {
  let n;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (i < 3 && j < 3) {
        n = randomGenerator();
        if (checkIfSafe(i, j, n)) sudoku[i][j] = n;
        else j--;
      } else if (j < 6 && j >= 3 && i < 6 && i >= 3) {
        n = randomGenerator();
        if (checkIfSafe(i, j, n)) sudoku[i][j] = n;
        else j--;
      } else if (j < 9 && j >= 6 && i < 9 && i >= 6) {
        n = randomGenerator();
        if (checkIfSafe(i, j, n)) sudoku[i][j] = n;
        else j--;
      }
    }
  }
};
const fillRest = () => {
  const solveSudoku = (row, col) => {
    // If we've reached the end of the row, move to the next row
    if (col === 9) {
      row++;
      col = 0;
    }

    // If we've filled all rows, the board is complete
    if (row === 9) {
      return true;
    }

    // Skip cells that are already filled
    if (sudoku[row][col] !== 0) {
      return solveSudoku(row, col + 1);
    }

    // Try filling the cell with numbers 1 to 9
    for (let num = 1; num <= 9; num++) {
      if (checkIfSafe(row, col, num)) {
        sudoku[row][col] = num;

        // Recursively solve the next cell
        if (solveSudoku(row, col + 1)) {
          return true;
        }

        // If it didn't work, reset the cell (backtrack)
        sudoku[row][col] = 0;
      }
    }

    // No valid number found, trigger backtracking
    return false;
  };

  solveSudoku(0, 0);
};
const checkIfUnique = () => {
  let solutions = 0;

  const countSolutions = (row, col) => {
    if (row === 9) {
      solutions++;
      return;
    }

    if (col === 9) {
      countSolutions(row + 1, 0);
      return;
    }

    if (sudoku[row][col] !== 0) {
      countSolutions(row, col + 1);
      return;
    }

    for (let num = 1; num <= 9; num++) {
      if (checkIfSafe(row, col, num)) {
        sudoku[row][col] = num;
        countSolutions(row, col + 1);

        if (solutions > 1) return;

        sudoku[row][col] = 0;
      }
    }
  };

  countSolutions(0, 0);
  return solutions === 1;
};

const removeNumbers = (n) => {
  // Funkcija za duboku kopiju Sudoku mreže
  const deepCopy = (array) => {
    return array.map((row) => [...row]);
  };

  const originalSudoku = deepCopy(sudoku);

  do {
    sudoku = deepCopy(originalSudoku); // Vraćanje originalne mreže
    let count = 0;

    while (count < n) {
      let r, s;

      do {
        r = randomGenerator() - 1;
        s = randomGenerator() - 1;
      } while (sudoku[r][s] === 0);

      sudoku[r][s] = 0; // Ukloni broj
      count++;
    }
  } while (!checkIfUnique());
};

const winCondition = () => {
  let zeroes = 0;
  let notSafes = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] == 0) zeroes++;
    }
  }
  cells.forEach((cell) => {
    if (cell.classList.contains("not-safe")) notSafes++;
  });
  if (zeroes == 0 && notSafes == 0) {
    winContainer.style.display = "flex";
    tableElement.style.display = "none";
  }
};

const createSave = () => {
  let zadani = [];
  cells.forEach((cell) => {
    if (cell.classList.contains("grezo")) {
      zadani.push([cell.ariaRowIndex, cell.ariaColIndex]);
    }
  });
  return zadani;
};
const loadSudoku = (save) => {
  let redak = [];
  let rezultat = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      redak.push(parseInt(save[0]));
      save = save.slice(1);
    }
    rezultat.push(redak);
    redak = [];
  }
  return rezultat;
};
const loadZadane = (save) => {
  let rezultat = [];
  let celija;
  do {
    celija = [];
    celija.push(parseInt(save[0]));
    celija.push(parseInt(save[1]));
    save = save.slice(2);
    rezultat.push(celija);
  } while (save.length > 0);
  return rezultat;
};

if (localStorage.length !== 0) {
  loadBtn.disabled = false;
}
