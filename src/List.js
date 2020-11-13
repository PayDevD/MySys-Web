import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { apikey } from './mapkey';
import axios from 'axios';
import Modal from './components/Modal';
import PlantationList from './components/PlantationList';

class List extends React.Component {
    state = {
        web3: null,
        accounts: [],
        contracts: null,
        latitude: null,
        longitude: null,
        plantations: [],
        isModalOpen: false,
        plantationData: ''
    }

    mapStyle = {
        left: '20%',
        height : '35vh',
        width : '110vh',
        position: 'relative'
    }

    topBarStyle = {
        width: '110vh',
        marginTop: '0',
        padding: '12px 5px',
        backgroundColor: '#49c8a2',
        fontSize: '13pt',
        color: 'white',
        border: '1px solid #white',
    };

    listStyle = {
        position: 'absolute',
        top: '35vh',
        left: '20%'
    }

    componentDidMount = async () => {
        this.setState({
            accounts: this.props.location.accounts,
            web3: this.props.location.web3
        })
        this.getLocation();
        await this.loadPlantations();
    }

    getLocation = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState(
                    { 
                        latitude: position.coords.latitude,
                         longitude: position.coords.longitude
                        });
            }, error => {
                console.log(error);
            }, {
                enableHighAccuracy: false,
                maximumAge: 0,
                timeout: Infinity
            });
        } else {
            alert('GPS를 지원하지 않습니다.');
        }
    }

    loadPlantations = async () => {
        await axios.get('http://localhost:4000/api/plantations')
        .then((res) => {
            // console.log(res.data);
            this.setState({
                plantations: res.data
            })
        })
    }

    addMarkers = async (e, aug, geo) => {
        const { plantations } = this.state;
        let stateData = plantations;
        let latLng;
        latLng = { lat: geo.latLng.lat(), lng: geo.latLng.lng()};
        stateData.push(latLng);
        await this.setState({
            plantations: stateData
        })
    }
    
    displayMarkers = () => {
        return this.state.plantations.map((plantation, index) => {
            return <Marker key={index} id={index} position={plantation.position} label={plantation.title} onClick={() => this.removeMarkers(plantation.id)} />
        })
    }

    removeMarkers = (id) => {
        axios.delete('http://localhost:4000/api/plantation/' + id)
        .then(() => {
            this.loadPlantations();
        })
    }

    addPlantation = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let lngLat = { lat: position.coords.latitude, lng: position.coords.longitude }
                axios.post('http://localhost:4000/api/addplantation', {
                    position: lngLat,
                    title: this.state.plantationData
                }).then(() => {
                    this.loadPlantations();
                    this.setState({ isModalOpen : false, plantationData: null })
                })
            }, error => {
                console.log(error);
            }, {
                enableHighAccuracy: false,
                maximumAge: 0,
                timeout: Infinity
            });
        } else {
            alert('GPS를 지원하지 않습니다.');
        }
    }

    openModal = () => {
        this.setState({ isModalOpen : true });
    }

    closeModal = () => {
        this.setState({ isModalOpen : false, plantationData: '' });
    }

    handleData = (e) => {
        this.setState({
            plantationData: e.target.value
        })
    }

    render() {
        if(this.state.latitude == null || this.state.longitude == null) {
            return (
                <p>GPS 센서를 확인한 뒤 다시 시도해주세요</p>
            );
        } else {
            return (
                <div>
                    <div style={this.mapStyle}>
                        <Map 
                        google={this.props.google}
                        initialCenter={{ lat : this.state.latitude, lng: this.state.longitude }}
                        zoom={14}>
                            {this.displayMarkers()}
                        </Map>
                    </div>
                    <div style={this.listStyle}>
                        <p style={this.topBarStyle}>{this.state.accounts[0]}님, 어서오세요</p>
                        <button onClick={this.openModal}>현재 위치로 재배지 추가</button>
                        <Modal isOpen={this.state.isModalOpen} close={this.closeModal} plantationData={this.state.plantationData} handleData={this.handleData} register={this.addPlantation}/>
                        <PlantationList plantations={this.state.plantations} web3={this.state.web3} accounts={this.state.accounts}/>
                    </div>    
                </div>
            )
        }
    }
}


export default GoogleApiWrapper({
    apiKey: apikey
})(List);