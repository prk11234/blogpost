import React from "react";
import './App.css';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router,Route } from 'react-router-dom';
import App1 from "./App1.js";
import login from "./components/login.js"
import SignUp from "./components/SignUp.js"

class App extends React.Component {

  render()
  {
  return (
    <Router>
      <div className="App">
      <Route path="/" component={App1} exact />
      <Route path="/login_success" component={login}/>
      <Route path="/account_create" component={SignUp}/>
      </div>
      </Router>
  );
  }
}

export default App;
