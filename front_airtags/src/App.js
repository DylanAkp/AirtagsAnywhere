import './App.css';
import 'react-pro-sidebar/dist/css/styles.css';
import React, { Component } from "react";
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from "leaflet";
import twemoji from "twemoji";
import {centroid, lineString, bbox} from '@turf/turf'
import ModeNightIcon from '@mui/icons-material/ModeNight';
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from '@mui/material/IconButton';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsIcon from '@mui/icons-material/Directions';
import StraightenIcon from '@mui/icons-material/Straighten';
import configData from "./config.json";
var ago = require('s-ago');

function refreshPage() {
  window.location.reload(false);
}

class App extends Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth;
    if (width > 768) {
      this.state = {
        data: [],
        colorMode: "light",
        collapsed: false,
        map: null,
      };
    } else {
      this.state = {
        data: [],
        colorMode: "light",
        collapsed: true,
        map: null
      };
    }

    this.myRef = React.createRef();
    this.light = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    this.dark = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    this.mapRef = React.createRef();

  }


  onDarkModeClick() {
    this.setState({
      colorMode: this.state.colorMode === "light" ? "dark" : "light"
    });
    if (this.myRef.current) {
      this.myRef.current.setUrl(
        this.state.colorMode === "light" ? this.light : this.dark
      );
    }
  }

  componentDidMount() {
    fetch(`http://${configData.SERVER_IP}:3890/json`)
      .then(res => res.json())
      .then(json => this.setState({ data: json }));
  }

  centerPosOfData() {
    var points = []
    this.state.data.map(point => points.push([point.coords[0], point.coords[1]]))
    const c = centroid(lineString(points))
    return c === null ? points[0] : c.geometry.coordinates
  }

  boundsOfData() {
    var points = []
    this.state.data.map(point => points.push([point.coords[0], point.coords[1]]))
    const b = bbox(lineString(points)) 
    return b === null ? null : [[b[0], b[1]], [b[2], b[3]]]
  }

  render() {
    let position

    if (this.state.data.length === 0)
      return (<div />)
    else
      position = this.state.data[0].coords

    return (

      <div>
        <div class="sidebar">
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }}
            onClick={() => window.open('https://github.com/DylanAkp/AirtagsAnywhere')}>
            <img src="images/logo.png" alt="AirtagsAnywhere Logo"></img> <span style={{
              fontSize: 25
            }}>AirtagsAnywhere</span>
          </div>
          <div class="airlist">
            {this.state.data.map(air => (
              <div class="button"
                variant="contained" size="small"
                onClick={() => this.mapRef.current.flyTo([air.coords[0], air.coords[1]])}
                >

                <center><span style={{ fontSize: 25 }}>{air.emote}</span> <span style={{ fontSize: 20 }}>{air.name}</span> | <BatteryFullIcon fontSize='small' style={{ position: 'relative', top: '5px' }} /> {air.battery}% <br />
                  <AccessTimeIcon fontSize="small" style={{ position: 'relative', top: '5px' }} /> {ago(new Date(air.timeStamp))}<br />
                  <StraightenIcon fontSize="small" style={{ position: 'relative', top: '5px' }} /> Last 24Hrs: {Math.round(air.distance24Hours)}m {air.distanceSinceLastReport > 0 ? `(${Math.round(air.distanceSinceLastReport)}m since last report)` : ''}<br />
                </center>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}>
            <IconButton color="primary"
              onClick={this.onDarkModeClick.bind(this)}>
              <ModeNightIcon />
            </IconButton>

            <IconButton color="primary"
              onClick={refreshPage}>
              <CachedIcon />
            </IconButton>


          </div>
        </div>
        <MapContainer
          id="airmap"
          center={this.centerPosOfData()}
          bounds={this.boundsOfData()}
          zoomControl={false}
          className="airtags_map"
          scrollWheelZoom={true}
          ref={this.mapRef}>

          <TileLayer
            ref={this.myRef}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={this.colorMode === "light" ? this.light : this.dark}
          />

          <MarkerClusterGroup
            iconCreateFunction={() => L.icon({
              iconUrl: /src="([^\"]+)"/.exec(twemoji.parse('⚪️'))[1],
              iconSize: 50,
              shadowUrl: /src="([^\"]+)"/.exec(twemoji.parse('⚫️'))[1],
              shadowAnchor: [36, 36]
            })}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            maxClusterRadius={100}>
              
          {this.state.data.map(air => (
            <Marker icon={L.icon({
              iconUrl: /src="([^\"]+)"/.exec(twemoji.parse('⚫️'))[1],
              iconSize: 50,
              shadowUrl: /src="([^\"]+)"/.exec(twemoji.parse('⚫️'))[1],
              shadowAnchor: [36, 36]
            })}
          
              position={air.coords}>
              <Popup id={air.sn}>
                <center>
                  <span style={{ fontSize: 25 }}>{air.emote} {air.name} </span> <br />
                  <div class="button" endIcon={<DirectionsIcon />}
                    style={{
                      margin: 10,
                      borderRadius: 30,
                      textTransform: 'none',
                      fontFamily: 'Roboto'
                    }}
                    variant="contained" size="small"
                    onClick={() => window.open('https://www.google.com/maps?q=' + air.coords[0] + ',' + air.coords[1], '_blank')}>
                    <center>Directions</center>
                  </div>
                </center>
              </Popup>
              <Tooltip offset={[0, 0]} permanent direction='center' className='emoji-tooltip'>{air.emote}</Tooltip>
              
            </Marker>
          ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    );
  }
}

export default App;