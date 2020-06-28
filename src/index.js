import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* class Square extends React.Component {

  render() {
    return (
      <button className="square" 
	      onClick={()=>this.props.onClick()} >
        {this.props.value}
      </button>
    );
  }
} */

const Square = props => (
  <button className={"square"+(props.highlight?' highlight':'')} onClick={props.onClick}>
    {props.value}
  </button>
)

const calculateWinner = squares => {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player:squares[a],position:[a,b,c]};
    }
  }
  return {player: null,position: null};
}

class Board extends React.Component {

  renderSquare(i,winnerSquares) {
    console.log("Board -> renderSquare -> winnerSquares", winnerSquares)
    return (
      <Square 
        highlight={winnerSquares.includes(i)}
        key={"square " + i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    //row
    let rows = [];
    rows = Array(3).fill(null).map((val,index) => {
      // col
      let squares = []; 
      let squareIndex = index*3;
      squares = Array(3).fill(null).map(value => {
        return this.renderSquare(squareIndex++,this.props.winnerSquares);
      });
      return (
        <div
          key={'row-'+index} 
          className="board-row"
        >
          {squares}
        </div>
      )
    });

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // const squares = this.state.squares.slice(); // ES5
    const squares = [...current.squares]; //ES6
    if ( calculateWinner(squares).player || squares[i] ) {
      return ;
    }
    squares[i] = this.state.xIsNext ? 'X':'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        position: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ===0,
    });
  }
  switchSort(){
    this.setState({
      ascending: !this.state.ascending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).player;
    const winnerPosition =calculateWinner(current.squares).position;
    const moves = history.map((move, step) => {
      let position;
      if (step!==0) {
        position = ' Position: '+
        'ln '+ (Math.floor(move.position/3)+1) + 
        ', col '+ (move.position%3+1) + ' Player: '+ move.squares[move.position];
      }
      const desc = (step ? 
        'Go to move #' + step :
        'Go to game start') + position;

      let clickHistory = '';
      let stepNumber = this.state.stepNumber;
      if ( stepNumber === step ) {
        clickHistory ='click-history';
      }
      return (
        <li key={step}>
          <button className={clickHistory} onClick={() => this.jumpTo(step)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: '+ winner;
    } else {
      status = 'Next: '+ (this.state.xIsNext?'X':'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winnerSquares={winnerPosition? winnerPosition:[]}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.switchSort()}>
            Sort direction: {this.state.ascending? '↓':'↑'}
          </button>
          <ol>{this.state.ascending? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

