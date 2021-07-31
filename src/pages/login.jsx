import React from 'react';

class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
          <div className="card" >
            <div className="card-body">
              <h2 className="card-title">Welcome to CalMole</h2>
              <h6 className="card-subtitle mb-2 text-muted">Continue with:</h6>
                    <button type="button" className="btn btn-primary">Continue with Google</button>
                    <button type="button" className="btn btn-dark">Continue with Apple</button>
                    <button type="button" className="btn btn-light">Continue with Outlook</button>
            </div>
          </div>
        )
    }
}

export default LoginForm;