import React, { Component } from 'react';
import NumberPicker from './NumberPicker'
import './SudoCell.css'


export default class SudoCell extends Component {
  
    constructor(props) {
      super(props);
    this.state = {
        value:"",
        isOpenPicker:false,
        x:props.x,
        y:props.y,
        init:false
      };
      this.top=0
      this.left=0
    }
  
    handleClick(i) {
      if(i!==""){
        this.setState({value:i,isOpenPicker:false,init:true})
        this.props.updateInitNums(this.state.x,this.state.y,i)
      }else{
        this.setState({value:i,isOpenPicker:false,init:false})
        this.props.updateInitNums(this.state.x,this.state.y,0)
      }
    }
    
    calcToUpdate(i) {
      this.setState({value:i})
    }

    shouldComponentUpdate(nextprops){
      if(nextprops.update !== this.props.update){
        Object.keys(nextprops.update).forEach(key=>{
          var {x,y,value}=nextprops.update[key]
          if(x===this.state.x && y===this.state.y){
            this.calcToUpdate(value)
          }
        })
      return false
    }
      return true
    }
    closePicker() {
        this.setState({isOpenPicker:false})
    }
    openPicker() {
      this.setState({isOpenPicker:true})
    }
    componentDidMount(){
      var div=document.getElementById("number-picker-board"+this.state.x+this.state.y)
      this.top=div.offsetTop+56
      this.left=div.offsetLeft+36
    }
    render() {
      return (
        <div 
        className="sudo-cell-div"
          id={"number-picker-board"+this.state.x+this.state.y}
          // onBlur={this.closePicker.bind(this)}
          >
          <div 
          className="number-picker-close" 
          style={this.state.isOpenPicker?{visibility: "visible",left:this.left}:{visibility: "hidden",left:this.left}}>
            <button
              className="close-button"
              onClick={(i)=>this.handleClick("")}
            >
              x
            </button>
          </div>
          <div 
          className="number-picker-board" 
          style={this.state.isOpenPicker?{visibility: "visible",top:this.top}:{visibility: "hidden",top:this.top}}>
            <NumberPicker
              onClick={(i) => this.handleClick(i)}
          />
          </div>
          <div>
            <input
            className="sudo-cell" 
            onFocus={this.openPicker.bind(this)}
            onChange={(e)=>this.handleClick(e.target.value)}
            value={this.state.value}
            style={this.state.init?{color:"green"}:{color:"black"}}
             />
          </div>
        </div>
      );
    }
  }
  
 