import React, { Component, setState, Fragment } from 'react'
import ReactMapGL, {Marker} from 'react-map-gl';
import Tooltip from "react-simple-tooltip"
import './custom-marker.scss'

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20;

class CustomMarker extends Component {

    constructor(props) {
      super(props);
      this.handleMouseHover = this.handleMouseHover.bind(this);
      this.state = {
        isHovering: false,
      };
    }

    handleMouseHover() {
      console.log("event!");
      //this.setState(this.toggleHoverState);
    }

    _onMapHover = e =>{
      console.log("hover###");
      console.log(e);
    }

    toggleHoverState(state) {
      return {
        isHovering: !state.isHovering,
      };
    }
    
    render() {        
      //const {onMouseEnter, onMouseLeave} = this.props;

      return (
        <Fragment>
          <div className='custom-marker'>
            <Marker 
            latitude={parseFloat(this.props.latitude)}
            longitude={parseFloat(this.props.longitude)}>
              {this.state.isHovering && (
                <div className='custom-marker-popup'>
                  hi this is the popup
                </div>
              )}
              <svg
                height={SIZE}
                viewBox="0 0 24 24"
                style={{
                  cursor: (this.props.isBusStop == 'true' ? 'pointer' : ''),
                  fill: (this.props.isBusStop == 'true' ? 'blue' : '#d00') ,
                  stroke: 'none',
                  transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
                }}
                onMouseEnter={() => {
                  if (this.props.isBusStop){
                    this.props.onMouseEnter({lon: this.props.longitude, lat: this.props.latitude, passengerCount: this.props.passengerCount})}
                  }
                }
                onMouseLeave={() => {
                  if (this.props.isBusStop){
                    this.props.onMouseLeave()}
                  }
                } 
              >
                <path d={ICON} />
              </svg>
            </Marker>
          </div>
        </Fragment>
      );
    }
}

export default CustomMarker