import React from 'react';

class Tiles extends React.Component {

constructor(props) {
    super(props);
}
remove = () =>{
	this.props.delete(this.props.index, this.props.city[this.props.index]);
}
weather = () =>{
	this.props.weather(this.props.city[this.props.index]);
}
render() {
 	return (

	 <div className = "col-4_sm-6_xs-12">
	 	<div className = "til">
	   		<button className = "display-button" onClick={this.weather}><h2>{this.props.city[this.props.index]}</h2></button>
	   		<button className = "remove-button" onClick={this.remove}>+</button>
	   	</div>
	 </div>
  );

  }
}
export default Tiles;


 