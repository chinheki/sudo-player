import React, { Component } from 'react';
import SudoRowGroup from './SudoRowGroup'
import './SudoBoard.css'
import {calcSudoNums} from '../utils/SudoUtils';
import {getAFromXy,getBFromXy} from '../utils/IdUtils';

 export default class SudoBoard extends Component {
  constructor(props) {
    super(props);
    this.state={
      resultToUpdate:{},
      updateTime:0
    }
    this.initNumsGroups=[
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ];

    this.initNumsXy=[
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
    ];

    // this.initNumsGroups=[
    //   [0,9,0,4,0,0,0,0,8],
    //   [0,3,7,0,0,0,0,1,0],
    //   [0,0,0,0,0,0,9,0,0],
    //   [0,0,0,6,0,4,5,0,0],
    //   [4,0,0,0,8,0,0,0,1],
    //   [0,0,6,1,0,3,0,0,0],
    //   [0,0,1,0,0,0,0,0,0],
    //   [0,4,0,0,0,0,5,6,0],
    //   [6,0,0,0,0,2,0,3,0],
    // ];

    // this.initNumsXy=[
    //   [0,9,0,0,3,7,0,0,0],
    //   [4,0,0,0,0,0,0,0,0],
    //   [0,0,8,0,1,0,9,0,0],
    //   [0,0,0,4,0,0,0,0,6],
    //   [6,0,4,0,8,0,1,0,3],
    //   [5,0,0,0,0,1,0,0,0],
    //   [0,0,1,0,4,0,6,0,0],
    //   [0,0,0,0,0,0,0,0,2],
    //   [0,0,0,5,6,0,0,3,0],
    // ];
}
  
  updateInitNums(x,y,value){
    this.initNumsXy[x][y]=Number(value);
    this.initNumsGroups[getAFromXy(x,y)][getBFromXy(x,y)]=Number(value);
  }

    renderSquare(x,y) {
      return (
        <SudoRowGroup 
          x={x}
          y={y}
          updateInitNums={this.updateInitNums.bind(this)}
          update={this.state.resultToUpdate}
          updateTime={this.state.updateTime}
          
        />
      );
    }

    calcSudo(){
      console.log(this.initNumsGroups)
      console.log(this.initNumsXy)
      var {numsToUpdate,numsXy,numsGroup}=calcSudoNums(this.initNumsXy,this.initNumsGroups)
      if(numsToUpdate===false){
        window.alert("NO ANSWER!!!")
      }else if(Object.keys(numsToUpdate).length>0){
        this.setState({resultToUpdate:numsToUpdate,updateTime:Date.now()})
      }
      this.initNumsGroups=numsGroup
      this.initNumsXy=numsXy
    }

    render() {
      return (
        <div  className="board-div">
          <div  className="board">
           <div className="board-row">
              {this.renderSquare(0,0)}
              {this.renderSquare(0,1)}
              {this.renderSquare(0,2)}
            </div>
            <div className="board-row">
              {this.renderSquare(1,0)}
              {this.renderSquare(1,1)}
              {this.renderSquare(1,2)}
            </div>
            <div className="board-row">
              {this.renderSquare(2,0)}
              {this.renderSquare(2,1)}
              {this.renderSquare(2,2)}
            </div>
          </div>
          <div>
            <button
              className="calc-btn"
              onClick={this.calcSudo.bind(this)}
            >
              CALC
            </button>
          </div>
        </div>
      );
    }
  }
  
