import '../index';

const Square = ({value,onClick,isHighlight}) => {
    return (
      <button className="square" onClick={onClick} style={isHighlight?{fontWeight:'bold',color:'red'}:{}}>
        {value}
      </button>
    );
}

export default Square;
