import React from "react";
import NavBar from "../components/navBar";
import Week from "../components/week";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="home">
        <div className="NavBar">
          <NavBar />
        </div>
        <div className="calendar">
          <h3>Current Schedule for the Week</h3>
          <div className="week">
            <Week />
          </div>

          <div className="batchButton">
            <button type="button" class="btn btn-primary">
              Batch My Meetings
            </button>
          </div>
          <div className="batchPotential">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Potential Time Saved</h5>
                <p className="card-text">245 Minutes</p>
                <p>Last updated 3 minutes ago</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Current Focus Time</h5>
                <p className="card-text">18 Hours</p>
                <p>Last updated 3 minutes ago</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Potential Focus Time</h5>
                <p className="card-text">24 Hours</p>
                <p>Last updated 3 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
