import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Login} from './components/Login';
import {DataPage} from './components/DataPage';


class App extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      status: 0,
      url: '',
      tryToConnectCount: 0,
    }
  }

  componentDidMount() {
    this.subscribe()
  }

  handleInput = (e) => {
    this.setState({[e.currentTarget.className.split(' ')[0]]: e.currentTarget.value})
  }

  onSubmit = () => {
    axios.post('https://work.vint-x.net/api/login', {username: this.state.username, password: this.state.password})
         .then((response) => {
            if(response.status === 200) {
              window.localStorage.setItem('autentification_token', response.headers['x-test-app-jwt-token'])

              this.setState(prevState => (
                  {...prevState, tryToConnectCount: prevState.tryToConnectCount+1, status: response.status}
                )
              )
            }
         })
         .then(()=> this.subscribe())
         .catch(err => {
           if(err.response) {
             if([400, 401].includes(err.response.status)) {
               this.setState({status: err.response.status})
               return
             }
             if(![400,401].includes(err.response.status && this.state.tryToConnectCount < 3)) {
              this.setState({status: err.response.status})
              this.onSubmit()
            }
          }
         })

    this.subscribe()
  }

  subscribe = () => {
    const token = (window.localStorage.getItem('autentification_token'))
    if(token) {
      axios.get('https://work.vint-x.net/api/subscribe', {headers: {'x-test-app-jwt-token': token}})
           .then(response => this.setState({url: response.data.url, connection: true, status: response.status}))
    }
  }

  logout = () => {
    this.setState({url: '', status: null, tryToConnectCount: 0})
  }

  render() {
    return (
      <div className="main">
        { this.state.status === 200 && this.state.url ?
          <DataPage
            status={this.state.status}
            url={this.state.url}
            subscribe={this.subscribe}
            logout={this.logout}
          />
          :
          <Login
            status={this.state.status}
            username={this.state.username}
            password={this.state.password}
            handleInput={this.handleInput}
            onSubmit={this.onSubmit}
          />
        }
      </div>
    )
  }
}

export default App;
