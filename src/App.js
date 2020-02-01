import React, { Component, setState, Fragment } from 'react';
import logo from './assets/blaise-logo.png';
import ReactMapGL, {Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.scss';
import CustomMarker from './Components/CustomMarker';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import passengerData from './data/passengers';
import busStopData from './data/stops';


const passengers = passengerData;
const stops = busStopData;

class App extends Component {

  state = {
    viewport: {
      longitude: -73.577664,
      latitude: 45.512024,
      zoom: 15,
      bearing: 0,
      pitch: 0
    }
  };

  getClosestBusCoordinate(passenger) {
    var closestDistance = null;
    var closestBusStop = null;
    stops.forEach(stop => {
      var distance = this.getDistanceFromLatLonInKm(passenger.lat, passenger.lon, stop.lat, stop.lon);
      if(!closestDistance || distance < closestDistance) {
        closestDistance = distance;
        closestBusStop = stop;
      }
    });
    closestBusStop['passengerCount'] += 1
    return closestBusStop;
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  _onViewportChange = viewport => this.setState({viewport});
  
  render() {
    const {viewport} = this.state;

    var layers = [];

    var token = 'pk.eyJ1IjoiYWxlc3NhbmRybzEwMCIsImEiOiJjazYybjIwajcwZzN6M2txb2JjdzF5NTlpIn0.SUvFKrKzPxRE7MxsFqdKPA'
    
    return (
      <div className="App">
        <header>
          <img src={logo} alt="logo" />
          <h2>Bus Passenger Path Finder</h2>
          <h3>Alessandro Kreslin</h3>
        </header>
        <ReactMapGL 
          {...viewport}
          className='mapbox-map' 
          mapboxApiAccessToken={token} 
          width="100%"
          height="100%"
          onViewportChange={this._onViewportChange}
        >
          {stops.map((stop, i) =>{
            stop['passengerCount'] = 0
            return(<CustomMarker key={i} longitude={stop.lon} latitude={stop.lat} isBusStop='true'/>);
          })}

          {passengers.map((passenger, i) =>{
            var closestBusStop = this.getClosestBusCoordinate(passenger);
            const data = [{
                sourcePosition: [passenger.lon, passenger.lat], 
                targetPosition: [closestBusStop.lon, closestBusStop.lat]
            }];
            layers.push(new LineLayer({id: 'line-layer-' + i, data, getWidth: 4}));
            return(<CustomMarker key={i} longitude={passenger.lon} latitude={passenger.lat} />);
          })}
          <DeckGL viewState={viewport} layers={layers} />
        </ReactMapGL>
      </div>
    );
  }
}

export default App;
