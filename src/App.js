import React, { Component, useState, useEffect } from 'react';
import LoginForm from './pages/login';
import './Styles/App.css';
import './Styles/loginpage.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  auth() {
    fetch('/auth/google').then((err, res) => {
      if (err) console.log(err);
      console.log(res);
    })
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
