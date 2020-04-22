import React, {Component} from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { format, fromUnixTime } from 'date-fns'

export class DataPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      serverTime: 0,
      connection: false
    }
  }

  componentWillMount() {
    if(this.props.status === 200) {
      this.connect()
    }
  }

  connect = () => {
    let client = new W3CWebSocket(this.props.url)
    client.onmessage = (message) => {
      this.setState({serverTime: JSON.parse(message.data).server_time, connection: true})
    }

    client.onclose = () => {
      this.setState({connection: false})
      client = null
      setTimeout(() => {
        this.props.subscribe()
        this.connect()
      }, 500)
    }
  }

  convertTime = (unixTime) => {
    const formattedTime = format(fromUnixTime(unixTime), "yyyy-MM-dd HH:mm:ss")
    return formattedTime
  }

  render() {
    return (
      <div className='window connection'>
        <div>WebSocket:
          <span className={this.state.connection ? 'btn-success' : 'btn-danger'}>
            {this.state.connection ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div>{this.convertTime(this.state.serverTime)}</div>
        <button className='btn btn-link' onClick={this.props.logout}>Logout</button>
      </div>
    )
  }
}
