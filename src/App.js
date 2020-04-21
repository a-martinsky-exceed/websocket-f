import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super()
    this.state = {
      username: 'test',
      password: 'test',
      status: 0,
    }
  }

  handleInput = (e) => {
    this.setState({[e.currentTarget.className]: e.currentTarget.value})
  }

  onSubmit = async () => {
    const response = await axios.post('http://localhost:3001/api/login', {username: this.state.username, password: this.state.password})
    this.setState({status: response.status})
    window.localStorage.setItem('autentification_token', response.headers['x-test-app-jwt-token'])
  }

  render() {
    return (
      <div>
        <input type='text' className='username' onChange={(e)=> this.handleInput(e)} value={this.state.username} placeholder='username'/>
        <input type='password' className='password' onChange={(e)=> this.handleInput(e)} value={this.state.password} placeholder='password'/>
        <button type='submit' onClick={this.onSubmit}>Login</button>
      </div>
    )
  }
}

export default App;
