import React, { Component, useState, useEffect } from 'react';
import LoginForm from './pages/login';
import './Styles/App.css';
import './Styles/loginpage.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.auth = this.auth.bind(this);
  }

  // auth() {
  //   fetch('/auth/google').then(res=> console.log(res));
  // }

  async auth () {
    const res = await fetch("/auth/google");
    // const data = await res.json()
    console.log(res);
    // store returned user somehow
  }

  render () {
    return (
      <div className="App">
        <body>
          <LoginForm auth={this.auth} />
        </body>
      </div>
    );
    }
}

export default App;
