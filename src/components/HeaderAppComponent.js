import React from 'react';

const HeaderAppComponent = (props) => {

	const innerList = [];


	for(let i = 0; i < 5; i++)
	{

		innerList[i] =
						<ul className="col" key={props.weather.city + '-list-' + i}>
							<li className="date" key={props.weather.city + '-date-' + i}>
								{props.weather.date[i]}
							</li>
							<li className="icon" key={props.weather.city + '-icon-' + i}>
								<img src={props.weather.weather_icon[i]}></img>
								<span className="temp">{props.weather.temps[i]}  &#xBA;C</span> 
							 </li>
							 <li key={props.weather.city + '-wind-' + i}>
								Wind: {props.weather.wind[i]} m/s
							 </li>
							 <li key={props.weather.city + '-air-' + i}>
							  	Air pressure: {props.weather.air[i]} mb
							 </li>
							 <li key={props.weather.city + '-humidity-' + i}>
							  	Humidity: {props.weather.humidity[i]} %
							 </li>
						</ul>	  
	}

		let button;
		if(props.infoItem == true)
		 button = <button className = 'add-til-button' onClick ={() => props.addTil(props.weather.city)}>+</button>
		else if(props.infoItem == false)
		 button = <button className = 'add-til-button disabled' disabled>+</button>

  return (
  	<div className = "headerApp">
	    <div className="grid-noGutter">
	    	<div className="col-12">
	    		<div className = "wrapper-title">
	      			<h1 className='city-title'>{props.weather.city}</h1>
	      			{button}
	      		</div>
	      	</div>
	     </div>
	      <div className = "grid-5-center_md-2_xs-1 wrapper-weather">
	      		{innerList}
	      </div>
	</div>
  );

}

export default HeaderAppComponent;