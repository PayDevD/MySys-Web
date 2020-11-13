import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { apikey } from '../mapkey';
class MapComponent extends React.Component {
    state = {
        userPosition: {
            lat: 0,
            lng: 0
        },
        
        plantations: []
    };

    componentDidMount = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(this.state.userPosition);
                this.setState({userPosition : {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }})
            })
        }
    }


    render() {
        return (
            <Map 
            google={this.props.google} 
            onClick={this.onEventChecker}
            initialCenter={{ lat:37.5, lng: 127}}
            zoom={14}>
            <Marker position={{ lat:37.5, lng: 127}} />
            <div>
                <h1>test</h1>
            </div>
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: apikey
})(MapComponent);