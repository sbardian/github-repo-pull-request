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

  componentDidMount() {
    // const { username, token } = JSON.parse(localStorage.getItem("GHRPR"));
    const GHRPR = localStorage.getItem("GHRPR");
    if (GHRPR) {
      const localStorageObj = JSON.parse(localStorage.getItem("GHRPR"));
      const { username, token } = localStorageObj;
      this.setState({
        username,
        token
      });
    } else {
      console.log("No username or token available.");
    }
  }

  handleChange = name => event => {
    console.log(event.target.value);
    this.setState({
      [name]: event.target.value
    });
  };

  handleSave = () => {
    const { username, token } = this.state;
    console.log("New Username: ", username, ", New Token: ", token);
    const localStorageObj = JSON.parse(localStorage.getItem("GHRPR"));
    if (localStorageObj) {
      const { username: oldUsername, token: oldToken } = localStorageObj;
      console.log("Old Username: ", oldUsername, ", Old Token: ", oldToken);
      if (username !== oldUsername || token !== oldToken) {
        localStorage.setItem("GHRPR", JSON.stringify({ username, token }));
        window.chrome.tabs.query(
          { active: true, currentWindow: true },
          function(tabs) {
            window.chrome.tabs.sendMessage(tabs[0].id, {
              data: { username, token }
            });
          }
        );
      }
    } else {
      localStorage.setItem("GHRPR", JSON.stringify({ username, token }));
      window.chrome.tabs.query({ active: true, currentWindow: true }, function(
        tabs
      ) {
        window.chrome.tabs.sendMessage(tabs[0].id, {
          data: { username, token }
        });
      });
    }
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
