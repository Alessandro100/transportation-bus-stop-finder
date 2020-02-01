import React, { Component } from 'react';
import logo from './assets/blaise-logo.png';
import ReactMapGL, {Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.scss';
import CustomMarker from './Components/CustomMarker';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import passengerData from './data/passengers';
import busStopData from './data/stops';
import { getDistanceFromLatLonInKm } from './lib/distance.js';


const passengers = passengerData;
const stops = busStopData;

class App extends Component {

  state = {
    showPopup: false,
    popupLat: null,
    popupLon: null,
    popupPassengers: null,
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
      var distance = getDistanceFromLatLonInKm(passenger.lat, passenger.lon, stop.lat, stop.lon);
      if(!closestDistance || distance < closestDistance) {
        closestDistance = distance;
        closestBusStop = stop;
      }
    });    
    return closestBusStop;
  }


  _onViewportChange = viewport => this.setState({viewport});

  _onMarkerHover = e => {
    console.log("hi")
    console.log(e);
    this.setState({showPopup: true, popupLat: e.lat, popupLon: e.lon, popupPassengers: e.passengerCount});
  };

  _onMarkerLeave = e => {
    console.log("bye")
    this.setState({showPopup: false, popupLat: null, popupLon: null});
  }
  
  render() {
    const {viewport, showPopup, popupLat, popupLon, popupPassengers} = this.state;
    var layers = [];
    var token = 'pk.eyJ1IjoiYWxlc3NhbmRybzEwMCIsImEiOiJjazYybjIwajcwZzN6M2txb2JjdzF5NTlpIn0.SUvFKrKzPxRE7MxsFqdKPA'

    stops.map(s => s['passengerCount'] = 0);
    
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
           {showPopup && <Popup
              latitude={popupLat}
              longitude={popupLon}
              closeButton={false}
              anchor="bottom"
              offsetTop={-20} >
              <div>Number of Passengers: {popupPassengers}</div>
            </Popup>}
          
          {passengers.map((passenger, i) =>{
            var closestBusStop = this.getClosestBusCoordinate(passenger);
            var index = stops.indexOf(closestBusStop);
            if (stops[index]['passengerCount']) {
              stops[index]['passengerCount'] += 1
            }else {
              stops[index]['passengerCount'] = 1
            }
            const data = [{
                sourcePosition: [passenger.lon, passenger.lat], 
                targetPosition: [closestBusStop.lon, closestBusStop.lat]
            }];
            layers.push(new LineLayer({id: 'line-layer-' + i, data, getWidth: 4}));
            return(<CustomMarker key={i} longitude={passenger.lon} latitude={passenger.lat} />);
          })}

          {stops.map((stop, i) =>{
            var stopTemp = stops.filter(s => s.lat == stop.lat && s.lon == stop.lon)[0]
            return(
            <CustomMarker 
            key={i} 
            passengerCount={stopTemp['passengerCount'] ? stopTemp['passengerCount'] : 0} 
            onMouseEnter={this._onMarkerHover} onMouseLeave={this._onMarkerLeave} 
            longitude={stop.lon} 
            latitude={stop.lat} 
            isBusStop='true'/>);
          })}
          <DeckGL viewState={viewport} layers={layers} />
        </ReactMapGL>
      </div>
    );
  }
}

export default App;
