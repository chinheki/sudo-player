import React, { Component } from 'react';
import SudoCell from './SudoCell'
import './SudoRowGroup.css'
  
 export default class SudoRowGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:"",
      isOpenPicker:false,
      x:props.x,
      y:props.y
    };
  }
    renderSquare(x,y) {
      return (
        <SudoCell 
        x={this.props.x*3+x}
        y={this.props.y*3+y}
        updateInitNums={this.props.updateInitNums}
        update={this.props.update}
        updateTime={this.props.updateTime}
        />
      );
    }
  
    render() {
      return (
        <div className="row-group">
          <div className="row">
            {this.renderSquare(0,0)}
            {this.renderSquare(0,1)}
            {this.renderSquare(0,2)}
          </div>
          <div className="row">
            {this.renderSquare(1,0)}
            {this.renderSquare(1,1)}
            {this.renderSquare(1,2)}
          </div>
          <div className="row">
            {this.renderSquare(2,0)}
            {this.renderSquare(2,1)}
            {this.renderSquare(2,2)}
          </div>
        </div>
      );
    }
  }
  
