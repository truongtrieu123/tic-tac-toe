import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.isHighlight?{fontWeight:'bold',color:'red'}:{}}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isHighlight) {
    return (
      <Square isHighlight={isHighlight} key={'square '+i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoard=()=>{
    const stepsCausedWin=calculateStepsCausedWin(this.props.squares);
    let detail=[];
    for(var i =0;i<3;i++)
    {
      let row=[];
      for(var j=0;j<3;j++)
      {
        const isHighlight=(stepsCausedWin.includes(3*i+j))? true: false;
        row.push(this.renderSquare(3*i+j,isHighlight));
      }
      detail.push(<div className="board-row">{row}</div>);
    }
    return detail;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}
class HistoryList extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state={};
  }

  handleCurrentMoveClick=(move)=>
  {
    this.props.onClick(move);
  }

  handleSliderButtonClick=(event)=>
  {
    this.props.sliderButtonClick(event);
  }

  render()
  {
    const history = this.props.history;
    const stepNumber=this.props.stepNumber;
    const isAscendingOrder=this.props.isAscendingOrder;
    const moves = history.map((step, move) => {
      const [row,col]=findLocation(step.index);
      const desc = move ?
        'Go to move #' + move +'('+row+','+col+')':
        'Go to game start';
      return (
        <li key={move}>
          <button style={stepNumber===move?{fontWeight:'bold'}:{}} onClick={()=> this.handleCurrentMoveClick(move)}>{desc}</button>
        </li>
      );
    });
    const orderedMoves= !isAscendingOrder?moves.reverse():moves;

    return(
      <div>
        <label className="switch">
          <input type="checkbox" name="orderSlider" onClick={event=>this.handleSliderButtonClick(event)} checked={this.props.isAscendingOrder}/>
          <span className="slider"></span>
        </label>
        <label><br/>Order (Ascending by default)</label>
        <ol reversed={!isAscendingOrder}>{orderedMoves}</ol>
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAscendingOrder: true,
      history: [
        {
          squares: Array(9).fill(null),
          index:-1
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
    
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          index:i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo= (step) =>{
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });   
  }

  handleOrderSlider=(event)=>
  {
    this.setState({isAscendingOrder: event.target.checked});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const stepNumber=this.state.stepNumber;
    const isAscendingOrder=this.state.isAscendingOrder;
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let result='';
    if(isDraw(current.squares)){
      result='Draw!!';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board key={'grame-board '+stepNumber}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{result}</div>
          <HistoryList history={history} 
                      isAscendingOrder={isAscendingOrder} 
                      stepNumber={stepNumber} 
                      onClick={this.jumpTo} 
                      sliderButtonClick={this.handleOrderSlider}/>
        </div>
        
      </div>
      
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function findLocation(index)
{
  const location=[[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]];

  if(index===-1||isNaN(index))
    return [-1,-1];
  return location[index];
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateStepsCausedWin(squares)
{
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return [];
}

function isDraw(squares)
{
  return !squares.includes(null);
}