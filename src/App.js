import React, { Component, useState, useEffect } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import LoginForm from "./pages/login";
import Home from "./pages/home";
import Week from "./components/week";
import Comparison from "./pages/comparison";
import "./Styles/App.css";
import "./Styles/loginpage.css";
import "./Styles/home.css";
import "./Styles/comparison.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.auth = this.auth.bind(this);
  }

  // auth() {
  //   fetch('/auth/google').then(res=> console.log(res));
  // }

  // async auth () {
  //   const res = await fetch("/auth/google");
  //   // const data = await res.json()
  //   console.log(res);
  //   // store returned user somehow
  // }

  auth() {
    window.location.href = "/auth/google";
    // let headers = new Headers();

    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // headers.append('Origin','http://localhost:3000');

    // fetch('http://localhost:5000/auth/google')
    // mode: 'cors',
    // credentials: 'include',
    //     method: 'GET',
    //     // headers: headers
    // })
    //.then(response => response.json())
    //.then(json => console.log(json))
    //.catch(error => console.log('Authorization failed : ' + error.message));
  }

  render() {
    return (
      <div className="router">
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              component={() => <LoginForm auth={this.auth} />}
            />
            <Route exact path="/home" component={Home} />
            <Route exact path="/comparison" component={Comparison} />
          </Switch>
        </Router>
      </div>
    );
  }
}
// return (
//   <div className="App">
//     {/* <LoginForm auth={this.auth} /> */}
//     <LoginForm auth={this.auth} />

export default App;
