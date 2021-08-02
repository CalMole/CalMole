import React from 'react';

class NavBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <ul class="nav nav-pills">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Analytics Report</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">User</a>
            </li>
          </ul>
        )
    }
}

export default NavBar;