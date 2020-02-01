import React, { Component } from 'react'
import logo from '../assets/blaise-logo.png';

class CustomHeader extends Component { 
    render() {
        return(
            <header>
                <img src={logo} alt="logo" />
                <h2>Bus Passenger Path Finder</h2>
                <h3>Alessandro Kreslin</h3>
            </header>
        )
    }
}

export default CustomHeader