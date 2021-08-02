import React from "react";
import NavBar from "../components/navBar";
import Week from "../components/week";

class Comparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
      return (
    <div>
      <div className="whattheDiv">
        <div className="nav">
          <NavBar />
        </div>
            <div className="comparison">
                <div className="current">
                  <h3>Current Schedule for the Week</h3>
                  <div className="comparisonweek">
                    <Week />
                    </div>
                  <div className="batchButton">
                    <button type="button" class="btn btn-warning">
                        Reject
                    </button>
                  </div>
                </div>

                <div className="recommended">
                  <h3>Recommended Schedule for the Week</h3>
                  <div className="comparisonweek">
                    <Week />
                    </div>
                    <div className="batchButton">
                    <button type="button" class="btn btn-primary">
                        Confirm
                    </button>
                </div>
                </div>

            </div>
        </div>
          <div className="batchPotential">
            <div className="card card-a">
              <div className="card-body">
                <h5 className="card-title">Potential Time Saved</h5>
                <p className="card-text">245 Minutes</p>
                <p>Last updated 3 minutes ago</p>
              </div>
            </div>
            <div className="card card-b">
              <div className="card-body">
                <h5 className="card-title">Current Focus Time</h5>
                <p className="card-text">18 Hours</p>
                <p>Last updated 3 minutes ago</p>
              </div>
            </div>
            <div className="card card-c">
              <div className="card-body">
                <h5 className="card-title">Potential Focus Time</h5>
                <p className="card-text">24 Hours</p>
                <p>Last updated 3 minutes ago</p>
              </div>
                </div>
                <div className="card card-d">
              <div className="card-body">
                <h5 className="card-title">Number of Meetings Moved</h5>
                <p className="card-text">7</p>
                <p>Last updated 3 minutes ago</p>
              </div>
                </div>
                <div className="card card-e">
              <div className="card-body">
                <h5 className="card-title">Meetings this Week</h5>
                <p className="card-text">11</p>
                <p>Last updated 3 minutes ago</p>
              </div>
                </div>
                <div className="card card-f">
              <div className="card-body">
                <h5 className="card-title">Focus to Work Ratio</h5>
                <p className="card-text">54%</p>
                <p>Last updated 3 minutes ago</p>
              </div>
            </div>
        </div>
    </div>   
    );
  }
}

export default Comparison;
