import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: ""
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSave = () => {
    console.log("save");
  };

  render() {
    const { username, token } = this.state;

    return (
      <div className="App" style={{ height: "200px", width: "300px" }}>
        <form autoCapitalize="off" autoComplete="off">
          <TextField
            id="outlined-name"
            label="Github Username"
            value={username}
            onChange={this.handleChange("username")}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-name"
            label="Access Token"
            value={token}
            onChange={this.handleChange("token")}
            margin="normal"
            variant="outlined"
          />
          <div>
            <Button
              variant="contained"
              size="medium"
              onClick={() => this.handleSave()}
            >
              <SaveIcon />
              Save
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default App;
