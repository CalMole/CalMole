import React from "react";
import moment from "moment";
import WeekCalendar from "react-week-calendar";

class ComparisonWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastUid: 0,
      selectedIntervals: [],
    };
  }
  componentDidMount() {
    fetch("http://localhost:5000/calendarComparison")
      .then((res) => res.json())
      .then((data) => {
        this.setState((state) => {
          let newUid = state.lastUid;
          let newIntervals = state.selectedIntervals;
          for (let i = 0; i < data.length; i++) {
            newIntervals.push({
              uid: newUid++,
              start: moment(data[i].formattedStart.hoursmins).add(
                data[i].formattedStart.date,
                "d"
              ),
              end: moment(data[i].formattedEnd.hoursmins).add(
                data[i].formattedStart.date,
                "d"
              ),
              value: data[i].event_summary,
            });
          }
          return {
            ...state,
            lastUid: newUid,
            selectedIntervals: newIntervals,
          };
        });
      })
      .catch((err) =>
        console.log("Events.componentDidmount: get Events: Error:", err)
      );
  }

  handleEventRemove = (event) => {
    const { selectedIntervals } = this.state;
    const index = selectedIntervals.findIndex(
      (interval) => interval.uid === event.uid
    );
    if (index > -1) {
      selectedIntervals.splice(index, 1);
      this.setState({ selectedIntervals });
    }
  };

  handleEventUpdate = (event) => {
    const { selectedIntervals } = this.state;
    const index = selectedIntervals.findIndex(
      (interval) => interval.uid === event.uid
    );
    if (index > -1) {
      selectedIntervals[index] = event;
      this.setState({ selectedIntervals });
    }
  };

  handleSelect = (newIntervals) => {
    const { lastUid, selectedIntervals } = this.state;
    const intervals = newIntervals.map((interval, index) => {
      return {
        ...interval,
        uid: lastUid + index,
      };
    });

    this.setState({
      selectedIntervals: selectedIntervals.concat(intervals),
      lastUid: lastUid + newIntervals.length,
    });
  };

  render() {
    return (
      <WeekCalendar
        startTime={moment({ h: 9, m: 0 })}
        endTime={moment({ h: 15, m: 30 })}
        numberOfDays={7}
        selectedIntervals={this.state.selectedIntervals}
        onIntervalSelect={this.handleSelect}
        onIntervalUpdate={this.handleEventUpdate}
        onIntervalRemove={this.handleEventRemove}
      />
    );
  }
}

export default ComparisonWeek;
