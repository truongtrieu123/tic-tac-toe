import React, {useState,useEffect} from 'react';
import Board from './board';
import HistoryList from './history';
import '../index.css';
 
const  Game = () => {
    const [boardSize, setBoardSize] = useState(5);
    const [isAscendingOrder, setIsAscendingOrder] = useState(true);
    const [history, setHistory] = useState([
        {
          squares: Array(9).fill(null),
          index:-1
        }
      ]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [error, setError] = useState('');

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
    }, [boardSize]);

    const handleClick = (i) => {
      const curHistory = history.slice(0, stepNumber + 1);
      const current = curHistory[curHistory.length-1];
      const squares = current.squares.slice();
      if (calculateWinner(squares,boardSize) || squares[i]) {
        return;
      }
      squares[i] =xIsNext ? "X" : "O";
      setHistory(
        curHistory.concat([
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
      if(!isNaN(newSize)){
        if(newSize<5){
          setError("Giá trị nhập >= 5");
        }
        else if(newSize>20){
          setError("Giá trị nhập <= 20");
        }
        else {
          setBoardSize(newSize);
          setError("");
        }
        
      }
        
    }

    const currentSquares = history[stepNumber];
    const tmp = calculateWinner(currentSquares.squares,boardSize);
    
    let status;
    if (tmp) {
      status = "Winner: " + tmp.winner;
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
                boardSize={boardSize}
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
                  defaultValue='5'
                  placeholder='Type your board size here...' 
                  required/>
            <br/>
            <label style={{color:'red'}}>{error}</label>
            <br/><br/>
            <button>Render new board</button>
          </form>
          <br/>
          <button onClick = {playAgain}>Play again</button>
          <br/><br/>

          <HistoryList history={history}                         
                      stepNumber={stepNumber} 
                      isAscendingOrder={isAscendingOrder} 
                      boardSize={boardSize}
                      onClick={jumpTo} 
                      sliderButtonClick={handleOrderSlider}/>
        </div>
        
    </div>
    
    );
}

export default Game;
  
function isDraw(squares)
{
  return !squares.includes(null);
}

export const  calculateWinner  = (squares, boardSize) => {
  const twoDimensionArray = [];
  for (let i=0;i<boardSize;i++)
  {
    twoDimensionArray.push([]);
    for(let j=0;j<boardSize;j++)
    {
      twoDimensionArray[i].push(squares[boardSize*i+j]);
    }
  }
  const result = summary(twoDimensionArray,boardSize);
  console.log(result);
  return result;
}

function summary(a,boardSize)
{
  let checked=null;
  checked=checkRow(a,boardSize);
  if (checked.IsWin) return checked;
  checked=checkColumn(a,boardSize);  
  if (checked.IsWin) return checked;
  checked=checkAuxiliaryDiagonalLine(a,boardSize); 
  if (checked.IsWin) return checked;
  checked=checkMainDiagonalLine(a,boardSize);
  if (checked.IsWin) return checked;
  checked=checkMainLowerDiagonalLine(a,boardSize);
  if (checked.IsWin) return checked;
  checked=checkMainUpperDiagonalLine(a,boardSize);
  if (checked.IsWin) return checked;
  checked=checkAuxiliaryUpperDiagonalLine(a,boardSize);
  if (checked.IsWin) return checked;
  checked=checkAuxiliaryLowerDiagonalLine(a,boardSize);
  if (checked.IsWin) return checked;
  return null;
}

function checkRow(a,boardSize)
{
  let countO=0,countX=0;
  let pathX=[], pathO=[];
	for(let i=0;i < boardSize;i++)
	{
		countO=0;
		countX=0;
		for(let j=0;j < boardSize;j++)
		{	
			if(a[i][j]==='O'){
				countO++;
				pathO.push([i,j]);
			}
				
			else
			{	
				if(a[i][j]==='X')
				{
					if(countO>=5&&a[i][j-(countO+1)]!=='X')
					  countO=5;
					else{
            countO=0;
            pathO=[];
          }
				}
				if(a[i][j]===null)
					{if(countO>=5)
					  countO=5;
					else{
            countO=0;
            pathO=[];
          }}
			}
				
			if(a[i][j]==='X') {
        countX++;
        pathX.push([i,j]);
      }
			else
			{	if(a[i][j]==='O')
				{
					if(countX>=5&&a[i][j-(countX+1)]!=='O')
						countX=5;
					else{
            countX=0;
            pathX=[];
          }
				}
				if(a[i][j]===null)
					{if(countX>=5)
					  countX=5;
					else{
            countX=0;
            pathX=[];
          }}
      }
		}
		if(countO>=5)
		{
			return({IsWin:true, winner:'0',pathO:pathO,pathX:pathX});
		}
		if(countX>=5)
		{
      return({IsWin:true, winner:'X',pathO:pathO,pathX:pathX});
		}
	}
  return({IsWin:false, winner:null,pathO:[],pathX:[]});
}

function checkColumn(a,boardSize)
{
  let countO=0,countX=0;
  let pathO=[], pathX=[];
	for(let j=0;j< boardSize;j++)
	{
		countO=0;
		countX=0;
		for(let i=0;i< boardSize;i++)
			
		{
			if(a[i][j]==='O'){
        countO++;
        pathO.push([i,j]);
      }
			else
			{
				if(a[i][j]==='X')
				{
					if(countO>=5&&a[i-(countO+1)][j]!=='X')
						countO=5;
					else{
            countO=0;
            pathO=[];
          }
				}
				if(a[i][j]===null)
					{if(countO>=5)
					  countO=5;
					else{
            countO=0;
            pathO=[];
          }}
			}

			if(a[i][j]==='X'){
        countX++;
        pathX.push([i,j]);
      }
			else
			{
				if(a[i][j]==='O')
				{
					if(countX>=5&&a[i-countX+1][j]!=='O')
						countX=5;
					else{
            countX=0;
            pathX=[];
          }
				}
				if(a[i][j]===null)
					{if(countX>=5)
					  countX=5;
          else{
            countX=0;
            pathX=[];
          }}
			}
		}
		if(countO>=5)
		{
			return({IsWin:true, winner:'0',pathX:pathX, pathO:pathO});
		}
		if(countX>=5)
		{
      return({IsWin:true, winner:'X',pathX:pathX, pathO:pathO});
		}
	}
  return({IsWin:false, winner:null,pathO:[],pathX:[]});

}

function checkMainUpperDiagonalLine(a,boardSize)
{
  let countO=0,countX=0;
  let pathO=[], pathX=[];
	for(let j=1;j< boardSize;j++)
	{
		countO=0;
		countX=0;
		
		let k=j;
		let i=0;
		while(k< boardSize)
		{
			if(a[i][k]==='O'){
        countO++;
        pathO.push([i,k]);
      }
			else
			{
				if(a[i][k]==='X')
				{
					if(countO>=5&&a[i-countO+1][k-countO+1]!=='X')
						countO=5;
					else{
            countO=0;
            pathO=[];
          }
				}
				if(a[i][k]===null)
					{if(countO>=5)
					  countO=5;
					else{
            countO=0;
            pathO=[];
          }}
			}
			if(a[i][k]==='X'){
        countX++;
        pathX.push([i,k]);
      }
				else
				{
					if(a[i][k]==='O')
					{
						if(countX>=5&&a[i-countX+1][k-countX+1]!=='O')
							countX=5;
						else{
              countX=0;
              pathX=[];
            }
					}
					if(a[i][k]===null)
						{if(countX>=5)
						countX=5;
					else{
            countX=0;
            pathX=[];
          }}
				}
					k++;
					i++;
		}
    if(countO>=5)
		{
			return({IsWin:true, winner:'0',pathO:pathO,pathX:pathX});
		}
		if(countX>=5)
		{
      return({IsWin:true, winner:'X',pathO:pathO,pathX:pathX});
		}
	}
  return({IsWin:false, winner:null,pathO:[],pathX:[]});
}

function checkAuxiliaryLowerDiagonalLine(a,boardSize)
{
  let countO=0,countX=0;
	let j=0,k=0;
  let pathO=[], pathX=[];
	for(let i=1;i< boardSize;i++)
	{
		countO=0;
		countX=0;
		
		k=i;
		j=boardSize-1;
		while(k< boardSize)
		{
			
			if(a[k][j]==='O')
			{	
        countO++;
        pathO.push([k,j]);
			}
			else
			{
				if(a[k][j]==='X')
				{
					if(countO>=5&&a[k-countO+1][j+countO+1]!=='X')
						countO=5;
					else{
            countO=0;
            pathO=[];
          }
				}
				if(a[k][j]===null)
					{if(countO>=5)
					  countO=5;
					else{
            countO=0;
            pathO=[];
          }}
			}
			if(a[k][j]==='X'){
        countX++;
        pathX.push([k,j]);
      }
				else
				{
					if(a[k][j]==='O')
					{
						if(countX>=5&&a[k-countX+1][j+countX+1]==='O')
							countX=5;
						else{
              countX=0;
              pathX=[];
            }
					}
					if(a[k][j]===null)
						{if(countX>=5)
							countX=5;
						else{
              countX=0;
              pathX=[];
            }}
				}
					k++;
					j--;
				
		}
		if(countO>=5)
		{
			return({IsWin:true, winner:'0',pathO:pathO,pathX:pathX});
		}
		if(countX>=5)
		{
      return({IsWin:true, winner:'X',pathO:pathO,pathX:pathX});
		}
	}
  return({IsWin:false, winner:null,pathO:[],pathX:[]});
}

function checkMainLowerDiagonalLine(a,boardSize)
{
  let countO=0,countX=0;
	let j=0,k=0;
  let pathO=[], pathX=[];
  for(let i=1;i< boardSize;i++)
	{
		countO=0;
		countX=0;
		
		k=i;
		j=0;
		while(k< boardSize)
		{
			if(a[k][j]==='O'){
        countO++;
        pathO.push([k,j]);
      }
			else
			{
				if(a[k][j]==='X')
				{	if(countO>=5&&a[k-countO+1][j-countO+1]!=='X')
						countO=5;
					else{
            countO=0;
            pathO=[];
          }
				}
				if(a[k][j]===null)
					{if(countO>=5)
					countO=5;
				else{
          countO=0;
          pathO=[];
        }}
			}
			if(a[k][j]==='X'){
        countX++;
        pathX.push([k,j]);
      }
				else
				{
					if(a[k][j]==='O')
						if(countX>=5&&a[k-countX+1][j-countX+1]!=='O')
							countX=5;
						else{
              countX=0;
              pathX=[];
            }
					if(a[k][j]===null)
						{if(countX>=5)
							countX=5;
						else{
              countX=0;
              pathX=[];
            }}
				}
					k++;
					j++;
		}
		if(countO>=5)
		{
			return({IsWin:true, winner:'0',pathO:pathO,pathX:pathX});
		}
		if(countX>=5)
		{
      return({IsWin:true, winner:'X',pathO:pathO,pathX:pathX});
		}
	}
  return({IsWin:false, winner:null,pathO:[],pathX:[]});
}

function checkAuxiliaryUpperDiagonalLine(a,boardSize)
{
  let countO=0,countX=0;
	let i=0,k=0;
  let pathO=[], pathX=[];
  for(let j=1;j< boardSize;j++)
	{
		countO=0;
		countX=0;
		
		k=j;
		i=0;
		while(k>0)
		{
			if(a[i][k]==='O'){
        countO++;
        pathO.push([i,k]);
      }
			else
			{
				if(a[i][k]==='X')
				{
					if(countO>=5&&a[i-countO+1][k+countO+1]!=='X')
						countO=5;
					else{
            countO=0;
            pathO=[];
          }
				}
				if(a[i][k]===null)
				{	if(countO>=5)
					  countO=5;
          else{
            countO=0;
            pathO=[];
          }}
			}
			if(a[i][k]==='X'){
				countX++;
				pathX.push([i,k]);
			  }
				else
				{
					if(a[i][k]==='O')
					{
						if(countX>=5&&a[i-countX+1][k+countX+1]!=='O')
							countX=5;
						else{
              countX=0;
              pathX=[];
            }
					}
					if(a[i][k]===null )
						{if(countX>=5)
              countX=5;
            else{
              countX=0;
              pathX=[];
            }}
				}
					k--;
					i++;
		}
		if(countO>=5)
		{
			return({IsWin:true, winner:'0',pathO:pathO,pathX:pathX});
		}
		if(countX>=5)
		{
      return({IsWin:true, winner:'X',pathO:pathO,pathX:pathX});
		}
	}
  return({IsWin:false, winner:null,pathO:[],pathX:[]});
}
 
function checkMainDiagonalLine(a,boardSize)
{
  let countO=0,countX=0;
  let pathO=[], pathX=[];
  for(let i=0;i< boardSize;i++)
	{
		countO=0;
		countX=0;
		if(a[i][i]==='X'){
      countX++;
      pathX.push([i,i]);
    }
		else
		{
			if(a[i][i]==='O')
			{
				if(countX>=5&&a[i-countX+1][i-countX+1]!=='O')
					countX=5;
				else{
          countX=0;
          pathX=[];
        }
			}
			if(a[i][i]===null)
				{if(countX>=5)
				countX=5;
        else{
          countX=0;
          pathX=[];
        }}
		}
		if(a[i][i]==='O'){
      countO++;
      pathO.push([i,i]);
    }
		else
		{
			if(a[i][i]==='X')
			{
				if(countO>=5&&a[i-countO+1][i-countO+1]!=='X')
					countO=5;
				else{
          countO=0;
          pathO=[];
        }
			}
			if(a[i][i]===null)
				{if(countO>=5)
				countO=5;
        else{
          countO=0;
          pathO=[];
        }}
		}
	}
  if(countO>=5)
		{
			return({IsWin:true, winner:'0',pathO:pathO,pathX:pathX});
		}
		if(countX>=5)
		{
      return({IsWin:true, winner:'X',pathO:pathO,pathX:pathX});
		}
    return({IsWin:false, winner:null,pathO:[],pathX:[]});
  }



function checkAuxiliaryDiagonalLine(a,boardSize)
{
  let countO=0,countX=0;
  let pathO=[], pathX=[];
  for(let i=0;i< boardSize;i++)
	{
		countX=0;
		countO=0;
		for(let j=0;j< boardSize;j++)
		{
			if(i+j===boardSize-1)
			{
				if(a[i][j]==='O'){
          countO++;
          pathO.push([i,j]);
        }
				else
				{
					if(a[i][j]==='X')
					{
						if(countO>=5&&a[i-countO+1][j+countO+1]!=='X')
							countO=5;
						else{
              countO=0;
              pathO=[];
            }
					}
					if(a[i][j]===null)
					{if(countO>=5)
						countO=5;
					else{
            countO=0;
            pathO=[];
          }}
				}
					if(a[i][j]==='X'){
            countX++;
            pathX.push([i,j]);
          }
					else
					{
						if(a[i][j]==='O')
						{
							if(countX>=5&&a[i-countX+1][j+countX+1]!=='O')
								countX=5;
							else{
                countX=0;
                pathX=[];
              }
						}
						if(a[i][j]===null)
							{if(countX>=5)
							  countX=5;
              else{
                countX=0;
                pathX=[];
              }}
					}
			}
		}
		if(countO>=5)
		{
			return({IsWin:true, winner:'0',pathO:pathO,pathX:pathX});
		}
		if(countX>=5)
		{
      return({IsWin:true, winner:'X',pathO:pathO,pathX:pathX});
		}
	}
  return({IsWin:false, winner:null,pathO:[],pathX:[]});
}

