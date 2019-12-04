import React, { Component } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
import MapComponent from "./Components/MapComponent/Map.Component";
export class App extends Component {
  constructor(name, enthusiasmLevel) {
    super();
    this.state = {
      response: false,
      endpoint: "http://localhost:5002"
    };
  }

  componentDidMount() {
   
  
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h3>Hello</h3>
          <div className="App-intro">
            <MapComponent />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
