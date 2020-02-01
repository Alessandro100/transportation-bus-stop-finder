import React, { Component, setState, Fragment } from 'react'
import './custom-marker.scss'
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';


class DistanceLine extends Component {

    render() {
        console.log("hi from distance plus")
        const data = [{
            sourcePosition: [this.props.passengerLocation.lon, this.props.passengerLocation.lat], 
            targetPosition: [this.props.busStopLocation.lon, this.props.busStopLocation.lat]
        }];
        const layers = [
            new LineLayer({id: 'line-layer', data})
        ];
    
        return (
            <DeckGL viewState={this.props.viewState} layers={layers} />
        )
    }
}

export default DistanceLine