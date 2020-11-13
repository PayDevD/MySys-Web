import React, { Component } from "react";
import { Link } from "react-router-dom";
import logoImg from './logo.jpg';

import "./App.css";

class App extends Component {

  style = {
    width: '30%',
    padding: '12px 0',
    borderRadius: '10px 10px 10px 10px',
    backgroundColor: '#49c8a2',
    fontSize: '13pt',
    color: 'white',
    border: '1px solid #97ef7c',
    position: 'absolute',
    top: '67%',
    left: '50%',
    marginLeft: '-15%'
  }

  linkStyle = {    
    textDecoration: 'none',
    color: 'white',
    fontSize: '25px',
    letterSpacing: '4px'
  }

  render() {
    return (
      <div className="App">
        <img src={logoImg} width='600vw' height='600vh' alt='logo'/><br />
        <div style={this.style}>
          <Link to='/main' style={this.linkStyle}>로그인</Link>
        </div>
      </div>
    );
  }
}

export default App;
