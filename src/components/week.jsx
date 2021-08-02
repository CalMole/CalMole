import React from 'react';
import moment from 'moment';
import WeekCalendar from 'react-week-calendar';

class Week extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastUid: 4,
      selectedIntervals: [
        {
          uid: 1,
          start: moment({h: 10, m: 5}),
          end: moment({h: 12, m: 5}),
          value: "Booked by Smith"
          },
          {
            uid: 2,
            start: moment({h: 13, m: 0}).add(2,'d'),
            end: moment({h: 13, m: 45}).add(2,'d'),
            value: "Closed"
          },
          {
            uid: 3,
            start: moment({h: 11, m: 0}),
            end: moment({h: 14, m: 0}),
            value: "Reserved by White"
          },

          
      ]
    }
  }
    
//   componentDidMount() {
//     fetch('/getevents')
//       .then(res => res.json())
//       .then((data) => {
//         if (!Array.isArray(data)) items = [];
//         return this.setState({
//             selectedIntervals: {
//                 uid: this.state.lastUid + 1,
//                 start: moment(data.start.dateTime),
//                 end: moment(data.end.dateTime),
//                 value: data.summary

//           }
//         });
//       })
//       .catch(err => console.log('Events.componentDidmount: get Events: Error:', err));
//     }

  handleEventRemove = (event) => {
    const {selectedIntervals} = this.state;
    const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
    if (index > -1) {
      selectedIntervals.splice(index, 1);
      this.setState({selectedIntervals});
    }

  }

  handleEventUpdate = (event) => {
    const {selectedIntervals} = this.state;
    const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
    if (index > -1) {
      selectedIntervals[index] = event;
      this.setState({selectedIntervals});
    }
  }

  handleSelect = (newIntervals) => {
    const {lastUid, selectedIntervals} = this.state;
    const intervals = newIntervals.map( (interval, index) => {

      return {
        ...interval,
        uid: lastUid + index
      }
    });

    this.setState({
      selectedIntervals: selectedIntervals.concat(intervals),
      lastUid: lastUid + newIntervals.length
    })
  }

  render() {
    return <WeekCalendar
      startTime = {moment({h: 9, m: 0})}
      endTime = {moment({h: 15, m: 30})}
      numberOfDays= {7}
      selectedIntervals = {this.state.selectedIntervals}
      onIntervalSelect = {this.handleSelect}
      onIntervalUpdate = {this.handleEventUpdate}
      onIntervalRemove = {this.handleEventRemove}
    />
  }
}

export default Week;