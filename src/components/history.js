

const  HistoryList = ({history, stepNumber, isAscendingOrder, onClick, sliderButtonClick})=>
{
    const handleCurrentMoveClick=(move)=>
    {
        onClick(move);
    }

    const handleSliderButtonClick=(event)=>
    {
        sliderButtonClick(event);
    }

    const moves = history.map((step, move) => {
        const [row,col]=findLocation(step.index);
        const desc = move ?
        'Go to move #' + move +'('+row+','+col+')':
        'Go to game start';
        return (
        <li key={move}>
            <button style={stepNumber===move?{fontWeight:'bold'}:{}} onClick={()=> handleCurrentMoveClick(move)}>{desc}</button>
        </li>
        );
    });
    const orderedMoves= !isAscendingOrder?moves.reverse():moves;

    return(
        <div>
        <label className="switch">
            <input type="checkbox" name="orderSlider" onClick={(event)=>handleSliderButtonClick(event)} checked={isAscendingOrder}/>
            <span className="slider"></span>
        </label>
        <label><br/>Order (Ascending by default)</label>
        <ol reversed={!isAscendingOrder}>{orderedMoves}</ol>
        </div>
    );
}


const findLocation = (index) =>{
  const location=[[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]];

  if(index===-1||isNaN(index))
    return [-1,-1];
  return location[index];
}

export default HistoryList;