import React, { Component } from 'react';
import './App.css';
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'

class App extends Component {

	constructor(){
		super()
		this.state = {
			cityFieldValue: 'Reamstown, PA',
			city: 'Reamstown, PA',
			coord: '40,-83',
			periods: {},
			shortForecast: '80% chance of being in Reamstown',
			detailedForecast: '',
			icon: ''
		}
		this.updateCity()
	}

	updateCityAndFetch = (city) => {
		this.fetchACity(city)
		return (city)
	}
	writeCity = (event) => {
		this.setState({cityFieldValue: event.target.value})
	}

	updateCity = () => {
		this.setState({city: this.updateCityAndFetch(this.state.cityFieldValue)})
	}

	fetchACity(city) {
		// const key = 'rjLXBlVWGsiGJ33H9kpLx4EoTWHqspy2'
		fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=rjLXBlVWGsiGJ33H9kpLx4EoTWHqspy2&location=${city}`).then(res=>res.json())
		.then(data => {
			const lat = data.results[0].locations[0].latLng.lat
			const lng = data.results[0].locations[0].latLng.lng
			const fetchCoord = (`${lat},${lng}`)
			this.setState({coord: fetchCoord})
			this.fetchACoordinate()
		})
	}

	fetchACoordinate () {
		fetch(`https://api.weather.gov/points/${this.state.coord}/forecast`)
		.then(res => res.json())
		.then(data => {
			if(!data.properties){
				this.setState({city: 'Please search only inside the US'})
				this.setState({shortForecast: '75% chance of hellfire and brimstone'})
				this.setState({detailedForecast: 'you done fucked up'})
				return
			}
			this.setState({periods: data.properties.periods})
			this.setState({shortForecast: data.properties.periods[0].shortForecast})
			this.setState({icon: data.properties.periods[0].icon})
			this.setState({detailedForecast: data.properties.periods[0].detailedForecast})
			console.log(this.state.detailedForecast)
		})
		
	}

	render() {

		document.querySelector('body').style.backgroundImage = `url("${this.state.icon}")`
		return (
			<div className="App">
				<Header writeCity={this.writeCity} updateCity={this.updateCity}/>
				<Main city={this.state.city} shortForecast={this.state.shortForecast} detailedForecast={this.state.detailedForecast} />
				<Footer />
			</div>
		)
	}
}

export default App;
