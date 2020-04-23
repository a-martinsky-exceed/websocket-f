import React, { Component } from "react";

class Login extends Component {
  render() {
    const existingError = [400, 401].includes(this.props.status);
    const valid = existingError ? "is-invalid" : "";
    const disabled = !(
      this.props.username.length > 0 && this.props.password.length > 0
    );

    return (
      <div className="window login">
        <div className="form-group row">
          <label className="col-form-label">Username</label>
          <div>
            <input
              type="text"
              name="username"
              className={`form-control ${valid}`}
              onChange={e => this.props.handleInput(e)}
              value={this.props.username}
              placeholder="username"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-form-label"> Password </label>
          <div>
            <input
              type="password"
              name="password"
              className={`form-control ${valid}`}
              onChange={e => this.props.handleInput(e)}
              value={this.props.password}
              placeholder="password"
            />
          </div>
        </div>
        {![200, null].includes(this.props.status) && (
          <div className="error">
            {existingError
              ? "Wrong username or password"
              : this.props.status > 0
                ? `Error ${this.props.status}`
                : ""}
          </div>
        )}
        <div className="submit form-group row">
          <div className="col-sm-10">
            <button
              type="submit"
              disabled={disabled}
              className="btn btn-primary"
              onClick={this.props.onSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
