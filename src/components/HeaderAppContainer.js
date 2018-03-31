import React from 'react';
import fetch from 'isomorphic-fetch';
import HeaderAppComponent from './HeaderAppComponent';
import Tiles from './Tiles';

class HeaderAppContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    	value: '',
    	infoStatus: '',
    	items: [],
    	searchCity: '',
    	city:'',
    	infoItem: undefined,
    	weather: {
		 	city: '',
		 	min_temp: undefined,
		 	max_temp: undefined,
		 	weather_icon: [],
			weather_desc: [],
			temps: [],
			air: [],
			humidity: [],
			time: [],
			date: [],
      	 }
      }
  }

weatherdate(d)
{
  const date = new Date();

  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  const daysInMonth = new Date(date.getYear(), date.getMonth()+1, 0).getDate();
  let day = date.getDate() + d;
  let monthIndex = date.getMonth();
  if(day > daysInMonth)
  {
  	if(d != 0 || d != 1){
  		day = --d;
  		monthIndex++;
  	}
  }

  if(date.getDate() == day)
  	return 'Today';
  else
   return day + ' ' + monthNames[monthIndex];
  
}

_getWeather = (city) => {

	const key = 'c495a1dfed0261b2d4d4404ee7215a84';
	const fet_url = 'http://api.openweathermap.org/data/2.5/forecast?q='+ city +  '&cnt=5&lang=pl&appid=' + key;

 	this.setState({
        infoStatus: 'Loading'
    });

	city = city.charAt(0).toUpperCase() + city.slice(1);
 	this.checkItem(city);


	fetch(fet_url)
    .then(resp =>{
    	if(resp.ok)
    	   return resp.json()
		else
		   return Promise.reject(resp)
		})
    .then(data => {

	  	let weather = {
			city: data.city.name,
			min_temp: data.list[0].main.temp_min,
			max_temp : data.list[0].main.temp_max,
		 	weather_icon : [],
			temps : [],
			air : [],
			wind : [],
			humidity : [],
			time: [],
			date: []	}

		for(let i = 0; i < 5; i++)
		{
			weather.temps[i] = data.list[i].main.temp.toPrecision(3) - 273;
			weather.air[i] = data.list[i].main.pressure.toPrecision(4);
			weather.humidity[i] = data.list[i].main.humidity;
			weather.weather_icon[i] = 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png';
			weather.wind[i] = data.list[i].wind.speed;
			weather.time[i] = data.list[i].dt;
			weather.date[i] = this.weatherdate(i); 
		}

		this.setState({
	 		weather: weather,
	 		infoStatus: 'Loaded'
	    });
	
	    
	    })
	    .catch(error =>{
	    	if(error.status === 404)
	    	{
		    	this.setState({
		    		infoStatus: "Error404"
		    	})			
	    	}
	    	else if(error.status === 429)
	    	{
	    		this.setState({
	    			infoStatus: "Overload"
	    		})
	    	}
	    	else{
		    	this.setState({
		    		infoStatus: "Error"
		    		})
	    	}
	    })
}

componentDidMount() {

	if(localStorage.getItem("WeatherItems") != null)
	{
		const localItems = JSON.parse(localStorage.getItem('WeatherItems'));

			this.setState({
				infoStatus: "localStorage",
				items: localItems,
			})
	}else{

		this.setState({
		infoStatus: "first-open",
		})
	}
}
handleSubmit = (event) => {
   event.preventDefault();
   let inputCity = event.target.search.value;
   this._getWeather(inputCity);
 }
handleCityChange = (event) =>{
	this.setState({searchCity: event.target.value});
}
checkItem = (city) =>{
	let arr = this.state.items;
	console.log(arr);
	if(arr.indexOf(city) == -1)
	{
		this.setState({
			infoItem: true
		});
	}
	else{
		this.setState({
			infoItem: false
		});
	}
}
addItemCity = (city) =>{

	if(city != '')
	{
		let arr = this.state.items;
		arr.push(city);
		localStorage.setItem('WeatherItems', JSON.stringify(arr));
		this.setState({items: arr});
		this.checkItem(city);
	}

}
removeItemCity = (i) =>{
	let arr = this.state.items;
	arr.splice(i, 1);
	localStorage.setItem('WeatherItems', JSON.stringify(arr));
	this.setState({items:arr});

	let city = this.state.searchCity;
	city = city.charAt(0).toUpperCase() + city.slice(1);

	this.checkItem(city);
}

renderItems = (item,i) =>{
	return(
			<Tiles key = {'key_' + i} index = {i} city={this.state.items} delete = {this.removeItemCity} weather = {this._getWeather}>
			</Tiles>	
		);	
}

render() {
  	let data;
  	const { infoStatus } = this.state;

  	if(infoStatus == 'Overload'){
  		data = <p> API is overload, sorry mate :( </p>;
  	}else if(infoStatus == 'Error404'){
  		data = <p> We have not the city in our base :c </p>;
  	}else if(infoStatus == 'Error'){
  		data = <p> Error, please try later :) </p>;
  	}else if(infoStatus == 'Loading'){
  		data =   <div className="circles">
				    <div className="circle"></div>
				    <div className="circle"></div>
				    <div className="circle"></div>
				  </div>;
  	}else if(infoStatus == 'Loaded'){
  		data = <HeaderAppComponent weather = {this.state.weather} addTil = {this.addItemCity} infoItem = {this.state.infoItem} />;
  	}else if(infoStatus == 'first-open'){
  		data = <p> Welcome on my page, use form for search weather in your town </p>;
  	}else if(infoStatus == 'localStorage'){
  		data = <p> Hi again, use your tiles or search a weather manually</p>;
  	}
	
    return (
    <div className = 'container'>	
	    <div className="HeaderAppContainer">
	     <div className="weatherQuery">
	          <form onSubmit={this.handleSubmit} >
	            <input 
	              type="text" 
	              name="search"
	              placeholder="Search a city..."
	              value = {this.state.searchCity}
	              onChange = {this.handleCityChange}
	            />
	   
	          </form>
	        </div>	        
	    </div>
	    <div className = "weather-results">
	    	{data}
	    </div>
	    <div className = "weather-tils">
	    	<div className = "grid-noGutter" id="items">
	    		{this.state.items.map(this.renderItems) }
	    	</div>
	    </div>
	    <footer>
	    	<div className = "grid-center" >
	    		<p>Copyright - Dawid Malec</p>
	    	</div>

	    </footer>
    </div>
    );
  }
}

export default HeaderAppContainer;
