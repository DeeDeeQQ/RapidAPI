import React, { Component } from "react";

import "./App.css";
import Converter from "./Converter";
import Calc from "./Calc";
import Chart from "./Chart";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>RapidAPI FrontEnd candidate challenge</h1>
        </header>
        <Converter />
        <Calc />
        <Chart />
      </div>
    );
  }
}

export default App;
