import React from "react";
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
var adc=JSON.stringify({"av":"avr"})
class App extends React.Component {
  constructor(props)
  {
    super(props)
    this.state={name:"a1111111111111111oyouuiuoipi"}
  }
  handleSubmit(e)
  {
    fetch('/post', {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify(this.state)
    }).then(function(response) {
      
      return response.json();
    }).then(function(data) {
      // `data` is the parsed version of the JSON returned from the above endpoint.
      console.log(data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
    });
    
    /*fetch('/get_data',  {
      method: "GET",
      headers:{"Content-Type": "application/json"}
    }).then((response)=> {
      
     // console.log("Get",response)
      response.json().then((result)=>console.log("result",result))
    });
    */
  }
  render()
  {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      
          <button type="submit" onClick={this.handleSubmit.bind(this)}>Connected?</button>
     
    </div>
  );
  }
}

export default App;
