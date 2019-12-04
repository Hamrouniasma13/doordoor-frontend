import React, { Component } from "react";
import socketIOClient from "socket.io-client";
const fetch = require("isomorphic-fetch");

const { compose, withProps, withHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} = require("react-google-maps");
const {
  MarkerClusterer
} = require("react-google-maps/lib/components/addons/MarkerClusterer");
const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAVrb7_MGrPSjPD4oaop5yh2pYK6HHHYIQ&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `900px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withHandlers({
    onMarkerClustererClick: () => markerClusterer => {
      const clickedMarkers = markerClusterer.getMarkers();
    }
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={7} defaultCenter={{ lat: 52.47528, lng: 13.46038 }}>
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      
      {props.marks.map((marker, index) => (
        //update google map markers on marks change..
        <Marker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
));
export default class MapComponent extends React.PureComponent {
  componentWillMount() {
    this.setState({ markers: [] });
  }
  componentDidMount() {
    const endpoint = "http://localhost:5002";
    const socket = socketIOClient(endpoint);
    socket.on("connected-event", data => {
      console.log(data);
    });
  
    // listen to incoming data { id, lat, lng, at } to clientt
    socket.on("vehicle-update", data => {
      this.addMarker(data);
    });
  }

  addMarker(marker) {
    let modif = false;
    // updqte vehicle marker if exist
    for (let index = 0; index < this.state.markers.length; index++) {
      const element = this.state.markers[index];
      if (element.id == marker.id) {
        element.lat = marker.lat;
        element.lng = marker.lng;
        element.at = marker.at;

        //update list of markers
        this.setState({ markers: [...this.state.markers] });
        modif = true;
      }
    }

    // add to list if vehicle not exist 
    if (!modif) {
      this.setState({ markers: [...this.state.markers, marker] });
    }
  }

  handleExist(arr) {
    this.setState({ markers: arr });
  }

  handleClick = () => {
    this.setState({ markers: [] });
  };
  render() {
    return (
      <div>
        <MapWithAMarkerClusterer marks={this.state.markers} />
        <button onClick={this.handleClick}>Reset</button>
      </div>
    );
  }
}
