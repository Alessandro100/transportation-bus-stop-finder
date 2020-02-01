import React, { Component, useState, Fragment } from 'react';
import logo from './logo.svg';
import ReactMapGL, {Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.scss';
import CustomMarker from './Components/CustomMarker';
import DistanceLine from './Components/DistanceLine';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import passengerData from './data/passengers';
import busStopData from './data/stops';



const viewState = {
  longitude: -73.577664,
  latitude: 45.512024,
  zoom: 15,
};

const passengers = passengerData;
const stops = busStopData;

class App extends Component {

  constructor(props){
    super();

    this.state = {
      passangers: [],
      stops: [],
    }
  }

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
  
  render() {
    var token = 'pk.eyJ1IjoiYWxlc3NhbmRybzEwMCIsImEiOiJjazYybjIwajcwZzN6M2txb2JjdzF5NTlpIn0.SUvFKrKzPxRE7MxsFqdKPA'
    
    return (
      <div className="App">
        <header>
          This is the header
        </header>
        <ReactMapGL 
          className='mapbox-map' 
          mapboxApiAccessToken={token} 
          viewState={viewState}
          width={700}
          height={700}
          viewState={viewState} 
        >
          {stops.map(stop =>{
            stop['passengerCount'] = 0
            return(<CustomMarker longitude={stop.lon} latitude={stop.lat} isBusStop='true'/>);
          })}

          {passengers.map(passenger =>{
            var closestBusStop = this.getClosestBusCoordinate(passenger);
            return(
              <Fragment>
                <CustomMarker longitude={passenger.lon} latitude={passenger.lat} />
                <DistanceLine viewState={viewState} passengerLocation={passenger} busStopLocation={closestBusStop}/>
              </Fragment>
            );
          })}
         
          {/* <CustomMarker longitude='-122.41' latitude='37.78' isBusStop='true'/>
          <CustomMarker longitude='-122.41' latitude='37.79' isBusStop='true'/>
          <DistanceLine viewState={viewState}/> */}
        </ReactMapGL>
        
      </div>
    );
  }
}

export default App;
