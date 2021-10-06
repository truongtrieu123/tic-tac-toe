import React, {useState,useEffect} from 'react';
import Board from './board';
import HistoryList from './history';
import '../index.css';
 
const  Game = () => {
    const [boardSize, setBoardSize] = useState(3);
    const [isAscendingOrder, setIsAscendingOrder] = useState(true);
    const [history, setHistory] = useState([
        {
          squares: Array(9).fill(null),
          index:-1
        }
      ]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    
    useEffect(() => {
      const arraySize = boardSize*boardSize;
      setHistory([
        {
          squares: Array(arraySize).fill(null),
          index:-1
        }
      ]);
      setStepNumber(0);
      setXIsNext(true);
      setIsAscendingOrder(true);
      console.log(boardSize);
    }, [boardSize]);

    const handleClick = (i) => {
      const curHistory = history.slice(0, stepNumber + 1);
      const current = curHistory[curHistory.length-1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] =xIsNext ? "X" : "O";
      setHistory((history)=>
        history.concat([
          {
            squares: squares,
            index:i
          }
        ]),
      );
      setStepNumber(curHistory.length);
      setXIsNext(!xIsNext);
    }
  
    const jumpTo= (step) =>{
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }
  
    const handleOrderSlider=(event)=>
    {
      setIsAscendingOrder(event.target.checked);
    }
    
    const playAgain = () => 
    {
      setHistory([
        {
          squares: Array(9).fill(null),
          index:-1
        }
      ]);
      setStepNumber(0);
      setXIsNext(true);
      setIsAscendingOrder(true);
    }

    const changeBoardSize = (event) =>
    {
      event.preventDefault();
      const newSize=parseInt(event.target.newSize.value);
      if(!isNaN(newSize))
        setBoardSize(newSize);
    }

    const currentSquares = history[stepNumber];
    const winner = calculateWinner(currentSquares.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }

    let result='';
    if(isDraw(currentSquares.squares)){
      result='Draw!!';
    }

    return (
    <div className="game">
        <div className="game-board">
            <Board 
                squares={currentSquares.squares}
                onClick={handleClick}
                key={'grame-board '+stepNumber}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{result}</div>
          <br/>
          <form onSubmit = {(event) =>changeBoardSize(event)}>
            <input type = 'text' 
                  name = 'newSize'
                  defaultValue='3'
                  placeholder='Type your board size here...' 
                  required/>
            <br/><br/>
            <button>Render new board</button>
          </form>
          <br/>
          <button onClick = {playAgain}>Play again</button>
          <br/><br/>

          <HistoryList history={history}                         
                      stepNumber={stepNumber} 
                      isAscendingOrder={isAscendingOrder} 
                      onClick={jumpTo} 
                      sliderButtonClick={handleOrderSlider}/>
        </div>
        
    </div>
    
    );
}

export default Game;
  


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


function isDraw(squares)
{
  return !squares.includes(null);
}