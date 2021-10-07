import Square from './square';
import {calculateWinner} from './game';

const Board =({squares, boardSize, onClick}) => {

  const tmp=calculateWinner(squares,boardSize);
  let stepsCausedWin=null,steps=[];
  if(tmp!==null)
    if(tmp.winner==='0')
      stepsCausedWin = tmp.pathO;
    else if(tmp.winner==='X')
      stepsCausedWin = tmp.pathX;
  
  if(stepsCausedWin!==null)
    for(let i=0;i<5;i++){
      const [h,k]=stepsCausedWin[i];
      steps[i]=h*boardSize+k;
    }
  
  let detail=[];
  for(var i =0;i<boardSize;i++)
  {
    let row=[];
    for(var j=0;j<boardSize;j++)
    {
      const value= boardSize*i+j;
      const isHighlight=(steps.includes(value))? true: false;
      row.push((RenderSquare(squares, value ,isHighlight, onClick)));
    }
    detail.push(<div className="board-row">{row}</div>);
  }
  return (
    <div>
      {detail}
    </div>
  );
}

const RenderSquare = (squares, index, isHighlight,onClick) => {
  return (
    <Square isHighlight={isHighlight}
      value={squares[index]}
      onClick={() => onClick(index)}
      key={'square '+ index}
    />
  );
}


export default Board;