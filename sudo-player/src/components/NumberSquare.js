import './SudoCell.css'

export default function NumberSquare(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }