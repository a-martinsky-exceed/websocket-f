import React, { Component } from "react";
import axios from "axios";
import Login from "./components/Login";
import DataPage from "./components/DataPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      status: 0,
      url: "",
      tryToConnectCount: 0,
      isLoggedIn: false
    };
  }

  componentDidMount() {
    this.subscribe();
  }

  handleInput = e => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });
  };

  onSubmit = () => {
    axios
      .post("https://work.vint-x.net/api/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if (response.status === 200) {
          localStorage.setItem(
            "autentification_token",
            response.headers["x-test-app-jwt-token"]
          );

          this.setState(prevState => ({
            ...prevState,
            tryToConnectCount: prevState.tryToConnectCount + 1,
            status: response.status,
            isLoggedIn: response.status === 200
          }));
        }
      })
      .then(() => this.subscribe())
      .catch(err => {
        if (err.response) {
          if ([400, 401].includes(err.response.status)) {
            this.setState({ status: err.response.status });
            return;
          }
          if (
            ![400, 401].includes(
              err.response.status && this.state.tryToConnectCount < 3
            )
          ) {
            this.setState({ status: err.response.status });
            this.onSubmit();
          }
        }
      });
  };

  subscribe = () => {
    const token = localStorage.getItem("autentification_token");
    if (token) {
      axios
        .get("https://work.vint-x.net/api/subscribe", {
          headers: { "x-test-app-jwt-token": token }
        })
        .then(response =>
          this.setState({
            url: response.data.url,
            connection: true,
            status: response.status,
            isLoggedIn: true
          })
        );
    }
  };

  logout = () => {
    this.setState({
      url: "",
      status: null,
      tryToConnectCount: 0,
      isLoggedIn: false
    });
    localStorage.removeItem("autentification_token");
  };

  render() {
    return (
      <div className="main">
        {this.state.isLoggedIn ? (
          <DataPage
            status={this.state.status}
            url={this.state.url}
            subscribe={this.subscribe}
            logout={this.logout}
          />
        ) : (
          <Login
            status={this.state.status}
            username={this.state.username}
            password={this.state.password}
            handleInput={this.handleInput}
            onSubmit={this.onSubmit}
          />
        )}
      </div>
    );
  }
}

export default App;
