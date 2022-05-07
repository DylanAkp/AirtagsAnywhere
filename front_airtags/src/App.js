import './App.css';
import 'react-pro-sidebar/dist/css/styles.css';
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import twemoji from "twemoji";
import L from "leaflet";
import { ProSidebar, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import Button from '@mui/material/Button';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from '@mui/material/IconButton';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Fab from '@mui/material/Fab';
import configData from "./config.json";
import './custom.scss';

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
        collapsed: false
      };
    } else {
      this.state = {
        data: [],
        colorMode: "light",
        collapsed: true
      };
    }
    
    this.myRef = React.createRef();
    this.light = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    this.dark = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  }

  onClick() {
    this.setState({
      colorMode: this.state.colorMode === "light" ? "dark" : "light"
    });
    if (this.myRef.current) {
      this.myRef.current.setUrl(
        this.state.colorMode === "light" ? this.light : this.dark
      );
    }
  }

  onCollapseClick() {
    this.setState({
      collapsed: this.state.collapsed === true ? false : true
    });
    console.log(this.state.collapsed);
  }



  componentDidMount() {
    fetch(`http://${configData.SERVER_IP}:3890/json`)
      .then(res => res.json())
      .then(json => this.setState({ data: json }));
  }

  render() {
    let position
    
    if (this.state.data.length === 0)
      return (<div />)
    else
      position = this.state.data[0].coords


    return (

      <div>
        <Fab color="primary"
                onClick={this.onCollapseClick.bind(this)}
                id="collapser"
                variant="contained"
                style={{
                  margin: 5,
                  borderRadius: 20,
                }}>
                <CompareArrowsIcon/>
        </Fab>
        <ProSidebar
        id="sidebar"
        collapsed={this.state.collapsed}>
            <SidebarHeader style={{
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
            </SidebarHeader>
            <SidebarContent style={{
              padding: 5,
            }}>
              {this.state.data.map(air => (
                <Button
                
                style={{
                  margin: 10,
                  borderRadius: 30,
                  textTransform: 'none',
                  fontFamily: 'Roboto',
                  opacity: 0.8,
                }}
                  variant="contained" size="small"
                  onClick={() => window.open('https://www.google.com/maps?q=' + air.coords[0] + ',' + air.coords[1], '_blank')}>

                  <center><span style={{fontSize:25}}>{air.emote}</span> <span style={{fontSize:20}}>{air.name}</span>  <br /> <BatteryFullIcon fontSize='small' style={{position: 'relative', top: '5px'}} /> {air.battery}% <br />
                  <LocationOnIcon fontSize="small" style={{position: 'relative', top: '5px'}}/> {air.address}<br />
                  <AccessTimeIcon fontSize="small" style={{position: 'relative', top: '5px'}}/> {air.date}<br /><br />
                  </center>
                </Button>
              ))}
            </SidebarContent>
            <SidebarFooter
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}>
              <IconButton color="primary"
                onClick={this.onClick.bind(this)}>
                <ModeNightIcon/>
                  
              </IconButton>
              <IconButton color="primary"
                onClick={this.onCollapseClick.bind(this)}>
                <CompareArrowsIcon/>
              </IconButton>
              
              <IconButton color="primary"
                onClick={refreshPage}>
                  <CachedIcon/>
              </IconButton>


            </SidebarFooter>
        </ProSidebar>
        <MapContainer
          id="airmap"
          center={position}
          zoom={17}
          zoomControl={false}
          className="airtags_map"
          scrollWheelZoom={true}>
          <TileLayer
            ref={this.myRef}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={this.colorMode === "light" ? this.light : this.dark}
          />
          {this.state.data.map(air => (
            <Marker icon={L.icon({
              iconUrl: /src="([^\"]+)"/.exec(twemoji.parse(air.emote))[1],
              iconSize: 50,
              shadowUrl: /src="([^\"]+)"/.exec(twemoji.parse('⚫️'))[1],
              shadowAnchor: [36, 36]
            })}

              position={air.coords}>
              <Popup id={air.sn}>
                <center> <span style={{fontSize:25}}>{air.emote} {air.name} </span> | <BatteryFullIcon style={{position: 'relative', top: '5px'}}/> {air.battery}% <br /><br /><LocationOnIcon style={{position: 'relative', top: '5px'}}/> {air.address} <br /><AccessTimeIcon style={{position: 'relative', top: '5px'}}/> {air.date} <br /><br /> <b><a href={'https://www.google.com/maps?q=' + air.coords[0] + ',' + air.coords[1]}>Open in Google Maps</a></b></center>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  }
}

export default App;