import React, { Component } from 'react';

import ReactMapGL, {Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.scss';
import CustomHeader from './Components/CustomHeader';
import CustomMarker from './Components/CustomMarker';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import passengerData from './data/passengers';
import busStopData from './data/stops';
import { getDistanceFromLatLonInKm } from './lib/distance.js';
import { MAP_BOX_TOKEN } from './lib/environment.js';

//load .json data
const passengers = passengerData;
const stops = busStopData;

class App extends Component {
  state = {
    showPopup: false,
    popupLat: null,
    popupLon: null,
    popupPassengers: null,
    viewport: {
      longitude: -73.57292185446231,
      latitude: 45.512201377997826,
      zoom: 15,
      bearing: 0,
      pitch: 0
    }
  };

  getClosestBusCoordinate(passenger) {
    let closestDistance = null;
    let closestBusStop = null;    
    stops.forEach(stop => {
      const distance = getDistanceFromLatLonInKm(passenger.lat, passenger.lon, stop.lat, stop.lon);
      if(!closestDistance || distance < closestDistance) {
        closestDistance = distance;
        closestBusStop = stop;
      }
    });    
    return closestBusStop;
  }

  _onViewportChange = viewport => {
    this.setState({viewport});
  }

  _onMarkerHover = e => {
    this.setState({showPopup: true, popupLat: e.lat, popupLon: e.lon, popupPassengers: e.passengerCount});
  };

  _onMarkerLeave = e => {
    this.setState({showPopup: false, popupLat: null, popupLon: null, popupPassengers: 0});
  }
  
  render() {
    const {viewport, showPopup, popupLat, popupLon, popupPassengers} = this.state;
    let layers = [];

    //refreshes passenger count
    stops.map(s => s['passengerCount'] = 0);
    
    return (
      <div className="App">
        <CustomHeader />
        <ReactMapGL 
          {...viewport}
          className='mapbox-map' 
          mapboxApiAccessToken={MAP_BOX_TOKEN} 
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
          
          {/* set passenger markers */}
          {passengers.map((passenger, i) =>{
            const closestBusStop = this.getClosestBusCoordinate(passenger);
            //pasengerCount logic
            const index = stops.indexOf(closestBusStop);
            if (stops[index]['passengerCount']) {
              stops[index]['passengerCount'] += 1
            }else {
              stops[index]['passengerCount'] = 1
            }
            //line logic
            const data = [{
                sourcePosition: [passenger.lon, passenger.lat], 
                targetPosition: [closestBusStop.lon, closestBusStop.lat]
            }];
            layers.push(new LineLayer({id: 'line-layer-' + i, data, getWidth: 4}));
            return(<CustomMarker key={i} longitude={passenger.lon} latitude={passenger.lat} isBusStop={false}/>);
          })}

          {/* set stops markers */}
          {stops.map((stop, i) =>{
            const stopTemp = stops.filter(s => s.lat === stop.lat && s.lon === stop.lon)[0]
            return(
              <CustomMarker 
              key={i} 
              passengerCount={stopTemp['passengerCount'] ? stopTemp['passengerCount'] : 0} 
              onMouseEnter={this._onMarkerHover} onMouseLeave={this._onMarkerLeave} 
              longitude={stop.lon} 
              latitude={stop.lat} 
              isBusStop={true}/>);
          })}

          {/* adds lines to map */}
          <DeckGL viewState={viewport} layers={layers} />
        </ReactMapGL>
      </div>
    );
  }
}

export default App;
