import React, { Component } from "react";

import classnames from "classnames";


// Helpers
import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
} from "../helpers/selectors";

// Components
import Loading from "./Loading";
import Panel from "./Panel";

// Mock data
const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }
];




class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: [],
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => fetch(url).then(response => response.json()));

    Promise.all(urlsPromise)
    .then(([photos, topics]) => {
      console.log(photos,topics)
      this.setState({
        loading: false,
        photos: photos,
        topics: topics
      })
    })

  };

  if (focused) {
    this.setState({ focused });
  };


  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  };

  selectPanel = (id) => {
    this.state.focused ? this.setState({ focused: null }) : this.setState({ focused: id });
  };

  render() {
    console.log(this.state)
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    // return if state loading is true
    if (this.state.loading) {
      return <Loading />
    };

    fetch("/api/photos").then(response => console.log(response.json()))


    const panelData = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
      .map((panel) => (
      <Panel
        key={panel.id}
        label={panel.label}
        value={panel.getValue(this.state)}
        selectPanel={event => this.selectPanel(panel.id)}
      />
    ));


    return <main className={dashboardClasses}>{panelData}</main>
  }
}

export default Dashboard;
