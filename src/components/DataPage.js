import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { format, fromUnixTime } from "date-fns";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class DataPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverTime: 0,
      connection: false,
      showPreloader: false
    };
  }

  componentWillMount() {
    setTimeout(() => this.connect(), 500);
  }

  componentDidMount() {
    this.setState({
      showPreloader: true
    });
    setTimeout(() => {
      this.setState({
        showPreloader: false
      });
    }, 3000);
  }

  connect = () => {
    if (this.props.url) {
      let client = new W3CWebSocket(this.props.url);
      client.onmessage = message => {
        this.setState({
          serverTime: JSON.parse(message.data).server_time,
          connection: true
        });
      };

      client.onerror = () => {
        client = new W3CWebSocket(this.props.url);
      };

      client.onclose = () => {
        this.setState({
          connection: false
        });
        client = null;
        setTimeout(() => {
          this.props.subscribe();
          this.connect();
        }, 500);
      };
    }
  };

  convertTime = unixTime => {
    return format(fromUnixTime(unixTime), "yyyy-MM-dd HH:mm:ss");
  };

  render() {
    return this.state.showPreloader ? (
      <div className="preloader">
        <Loader type="BallTriangle" color="#00BFFF" height={150} width={150} />
      </div>
    ) : (
      <div className="window connection">
        <div>
          WebSocket:
          <span
            className={this.state.connection ? "btn-success" : "btn-danger"}
          >
            {this.state.connection ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="time">
          {this.convertTime(this.state.serverTime)}
          <Loader type="Watch" color="#00BFFF" height={20} width={35} />
        </div>
        <button className="btn btn-link" onClick={this.props.logout}>
          Logout
        </button>
      </div>
    );
  }
}

export default DataPage;
