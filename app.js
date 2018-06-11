/*
  ======================================
  Tic Tac Toe game for Free Code Camp
  - Choose X or O
  - X will always go first.
  ======================================
  ======================================
*/
const squares = document.querySelectorAll('.square');
const choices = document.querySelectorAll('#choose-x, #choose-o');
const modal = document.getElementById('modal');
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const edges = [1, 3, 5, 7];
const corners = [0, 2, 6, 8];
const center = 4;
let humanMark = '';
let computerMark = '';
let gameOver = false;
let humanTurn = false;


// Max and Min are inclusive
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkForWin(player) {
  function comboCheck(comboItem) {
    return squares[comboItem].innerHTML === player;
  }

  function highlightWinningRow(arr) {
    arr.forEach((el, index) => {
      squares[el].style.background = '#041F37';
    });
  }

  for (let i = 0; i < winningCombos.length; i++) {
    if (winningCombos[i].every(comboCheck)) {
      console.log(`Player ${player} is the winner!`);
      highlightWinningRow(winningCombos[i]);
      return true;
    }
  }
}

function countMoves() {
  let moves = 0;
  squares.forEach(element => {
    if (element.innerHTML !== '')
      moves += 1;
  });
  return moves;
}

function addScore(selector) {
  document.querySelector(selector).innerText++;
}

function removeHover() {
  squares.forEach(element => {
    if (element.innerHTML !== '' || gameOver === true) {
      element.classList.remove('sq-hov');
    }
  });
}

function displayGameOverMessage(message) {
  modal.style.display = 'block';
  choices.forEach(el => el.style.display = 'none');
  document.getElementById('game-over-message').style.display = 'block';
  document.getElementById('game-over-message').innerHTML = message;
  setTimeout(resetGame, 2000);
}

function resetGame() {
  squares.forEach(element => {
    element.innerHTML = '';
    element.classList.add('sq-hov');
    element.style.background = '';
  });
  humanMark = '';
  computerMark = '';
  gameOver = false;
  modal.style.display = 'block';
  choices.forEach(el => el.style.display = '');
  document.getElementById('game-over-message').style.display = '';
}

function humanMove(event) {
  if (gameOver === false && event.target.innerHTML === '' && humanTurn === true) {
    event.target.innerHTML = humanMark;
    removeHover();

    if (checkForWin(humanMark)) {
      console.log('Congradulations!');
      gameOver = true;
      addScore('#h-score');
      setTimeout(displayGameOverMessage, 1000, 'You Win!');
    } else if (countMoves() === 9) {
      console.log('Round draw.');
      gameOver = true;
      addScore('#d-score');
      setTimeout(displayGameOverMessage, 1000, 'Round Draw');
    } else {
      // computerMove();
      humanTurn = false;
      setTimeout(computerMove, 700);
    }
  }
}

function computerMove() {
  const currentMove = countMoves();
  const randomCorner = corners[Math.floor(Math.random() * corners.length)];
  let lastMark = '';

  function checkForMark(mark) {
    if (squares[mark].innerHTML !== '')
      lastMark = mark;
    return squares[mark].innerHTML !== '';
  }

  function responseToEdgeOpening(edge) {
    const responseType = randomInt(0, 2);

    function edgeOpposite() {
      if (edge === 1) return 7;
      if (edge === 3) return 5;
      if (edge === 5) return 3;
      if (edge === 7) return 1;
    }

    function cornerByEdge() {
      const cornerChoice = randomInt(0, 1);
      if (edge === 1) return cornerChoice ? 0 : 2;
      if (edge === 3) return cornerChoice ? 0 : 6;
      if (edge === 5) return cornerChoice ? 2 : 8;
      if (edge === 7) return cornerChoice ? 6 : 8;
    }

    switch (responseType) {
      case 0:
        console.log('center');
        squares[center].innerHTML = computerMark;
        break;
      case 1:
        console.log('A corner next to edge mark');
        squares[cornerByEdge()].innerHTML = computerMark;
        break;
      case 2:
        console.log('Opposite edge');
        squares[edgeOpposite()].innerHTML = computerMark;
        break;
      default:
        console.error('Something went wrong!');
        break;
    }
  }

  /** Wiki Strategy List made into functions then called in order **/
  function makeMove() {

    function winOrBlock(player) {
      let mark = player === 'computer' ? computerMark : humanMark;
      let marksCount = 0;
      let emptySquare = '';

      function checkForTwo(comboItem) {
        if (squares[comboItem].innerHTML === mark) {
          marksCount += 1;
        }
        if (squares[comboItem].innerHTML === '') {
          emptySquare = comboItem;
        }
      }

      for (let i = 0; i < winningCombos.length; i++) {
        marksCount = 0;
        emptySquare = '';
        winningCombos[i].forEach(checkForTwo);

        if (marksCount === 2 && emptySquare !== '') {
          squares[emptySquare].innerHTML = computerMark;
          return true;
        } else {
          console.log('Cannot win or block');
        }
      }
    }

    function fork(player) {
      let mark = player === 'computer' ? computerMark : humanMark;
      let toCompare = [];
      let intersect = [];
      let move = [];

      function multiArrIntersection(arr) {
        let dupes = [];
        let results = arr.reduce((a, b) => {
          return a.concat(b.filter(element => {
            return a.indexOf(element) === -1 ? true : dupes.push(element);
          }));
        });
        return dupes;
      }

      function whatToCompare(combo) {
        let blankCount = 0;
        let computerMarkCount = 0;

        combo.forEach(item => {
          if (squares[item].innerHTML === '') blankCount++;
          if (squares[item].innerHTML === mark) computerMarkCount++;
        });

        if (blankCount === 2 && computerMarkCount === 1) toCompare.push(combo);
      }
      winningCombos.forEach(whatToCompare);
      console.log(toCompare);

      if (toCompare.length > 0) {
        intersect = multiArrIntersection(toCompare);

        move = intersect.filter(element => {
          return squares[element].innerHTML === '';
        });

        console.log(move);

        if (move.length === 1) {
          squares[move[0]].innerHTML = computerMark;
          console.log('made or blocked fork');
          return true;
        } else if (move.join('') === '08' || move.join('') === '62') {
          if (edges.every(el => squares[el].innerHTML === '')) {
            squares[edges[randomInt(0, 3)]].innerHTML = computerMark;
            console.log('fork denied');
            return true;
          }
        }
      }
    }

    function center() {
      if (squares[4].innerHTML === '') {
        squares[4].innerHTML = computerMark;
        return true;
      } else console.log('could not mark center');
    }

    function oppositeCorner() {
      if (squares[0].innerHTML === computerMark && squares[8].innerHTML === '') {
        squares[8].innerHTML = computerMark;
        return true;
      } else if (squares[2].innerHTML === computerMark && squares[6].innerHTML === '') {
        squares[6].innerHTML = computerMark;
        return true;
      } else if (squares[6].innerHTML === computerMark && squares[2].innerHTML === '') {
        squares[2].innerHTML = computerMark;
        return true;
      } else if (squares[8].innerHTML === computerMark && squares[0].innerHTML === '') {
        squares[0].innerHTML = computerMark;
        return true;
      } else console.log('could not mark corner');
    }

    function emptyCorner() {
      const empty = corners.filter(el => squares[el].innerHTML === '');
      const move = randomInt(0, empty.length - 1);

      if (empty.length > 0) {
        squares[empty[move]].innerHTML = computerMark;
        return true;
      }
    }

    function emptyEdge() {
      const empty = edges.filter(el => squares[el].innerHTML === '');
      const move = randomInt(0, empty.length - 1);

      if (empty.length > 0) {
        squares[empty[move]].innerHTML = computerMark;
        return true;
      }
    }

    // Control flow for the strategy list from wikipedia
    if (winOrBlock('computer')) {
      console.log('win success!');

    } else if (winOrBlock('human')) {
      console.log('block success');

    } else if (fork('computer')) {
      console.log('fork success');

    } else if (fork('human')) {
      console.log('fork block success');

    } else if (center()) {
      console.log('marked center');

    } else if (oppositeCorner()) {
      console.log('marked opposite corner');

    } else if (emptyCorner()) {
      console.log('marked empty corner');

    } else if (emptyEdge()) {
      console.log('marked empty edge');
    }
  }

  // Logic for first two board moves then calls the makeMove()
  // that runs the wiki strategy list
  if (currentMove === 0) {
    let random = Math.floor(Math.random() * 9);
    squares[random].innerHTML = computerMark;
    console.log(random);
  } else if (currentMove === 1 && edges.some(checkForMark)) {
    responseToEdgeOpening(lastMark);
  } else {
    makeMove();
    if (checkForWin(computerMark)) {
      console.log('computer wins!');
      gameOver = true;
      addScore('#c-score');
      setTimeout(displayGameOverMessage, 1000, 'Computer Wins');
    } else if (countMoves() === 9) {
      console.log('Round Draw');
      gameOver = true;
      addScore('#d-score');
      setTimeout(displayGameOverMessage, 1000, 'Round Draw');
    }
  }
  removeHover();
  humanTurn = true;
}

// Player move on click
Array.from(squares, element => {
  element.addEventListener('click', humanMove);
});

// Listen for player choice and assign X and O
Array.from(choices, element => {
  element.addEventListener('click', () => {
    humanMark = element.innerHTML;
    computerMark = humanMark === 'X' ? 'O' : 'X';
    modal.style.display = 'none';
    console.log(`You: ${humanMark}`);
    console.log(`Computer: ${computerMark}`);

    if (computerMark === 'X')
      setTimeout(computerMove, 500);
    // computerMove();
  });
});