import Square from './square';


const Board =({squares, boardSize, onClick}) => {
  const stepsCausedWin=calculateStepsCausedWin(squares);
  let detail=[];
  for(var i =0;i<3;i++)
  {
    let row=[];
    for(var j=0;j<3;j++)
    {
      const value= 3*i+j;
      const isHighlight=(stepsCausedWin.includes(value))? true: false;
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

const  calculateStepsCausedWin = (squares)=>
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

export default Board;