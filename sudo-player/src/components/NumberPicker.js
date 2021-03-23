import React, { Component } from 'react';
import NumberSquare from './NumberSquare'
import './NumberPicker.css'

 export default class NumberPicker extends Component {
    renderSquare(i) {
      return (
        <NumberSquare
          value={i}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div className="picker-board">
          <div className="picker-row">
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            {this.renderSquare(3)}
          </div>
          <div className="picker-row">
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            {this.renderSquare(6)}
          </div>
          <div className="picker-row">
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            {this.renderSquare(9)}
          </div>
        </div>
      );
    }
  }
  
