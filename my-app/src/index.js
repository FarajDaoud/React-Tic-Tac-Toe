import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Functional component
function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

//Child to Game. Renders game board with properties passed from the Game component. 
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard() {
    let count = 0;
    let rows = [];
    for(let i=0; i < 3; i++){
      let boxes = [];
      for(let j=0; j < 3; j++){
        boxes.push(this.renderSquare(count));
        count++;
      }
      rows.push(<div className='board-row'>{boxes}</div>);
    }
    return rows;
  }

  render() {
    return ( 
      <div>
        {this.createBoard()}
      </div> 
    );
      
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //array of game states
      history: [
        {
          squares: Array(9).fill(null),
          moveLoc: null
        }
      ],
      stepNumber: 0,
      //determines which players turn it is.
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //Return the most resent game state. 
    const current = history[history.length - 1];
    //Make a copy of the current squares array. 
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) { //if there is a winner or if the current square is not null, do nothing. 
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveLoc: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
                    const desc = move ? 'Go to move #' + move + ' ' + gridLocation(history[move].moveLoc) : 'Go to game start';
                    let selectedMove = history[move].moveLoc === current.moveLoc ? 'selectedMove' : '';
                    return (
                      <li key={move} className={selectedMove}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                      </li>
                    );
    });

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById("root")
);

//Returns 'X' or 'O' if a winner is found else 'null';
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function gridLocation(i) {
  const grid = [
    '(1,1)',
    '(1,2)',
    '(1,3)',
    '(2,1)',
    '(2,2)',
    '(2,3)',
    '(3,1)',
    '(3,2)',
    '(3,3)'
  ];
  return grid[i];      
}