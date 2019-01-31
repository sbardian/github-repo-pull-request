import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

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
      window.chrome.tabs.query({ active: true, currentWindow: true }, function(
        tabs
      ) {
        window.chrome.tabs.sendMessage(tabs[0].id, {
          data: { username, token }
        });
      });
    } else {
      console.log("No username or token available.");
    }
  }

  saveToLocalStorage = (username, token) => {
    localStorage.setItem("GHRPR", JSON.stringify({ username, token }));
    window.chrome.tabs.query({ active: true, currentWindow: true }, function(
      tabs
    ) {
      window.chrome.tabs.sendMessage(tabs[0].id, {
        data: { username, token }
      });
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSave = () => {
    const { username, token } = this.state;
    const localStorageObj = JSON.parse(localStorage.getItem("GHRPR"));
    if (localStorageObj) {
      const { username: oldUsername, token: oldToken } = localStorageObj;
      if (username !== oldUsername || token !== oldToken) {
        this.saveToLocalStorage(username, token);
      } else {
        console.log("No change to username and/or token");
      }
    } else {
      console.log("Unable to access localStorage, saving data");
      this.saveToLocalStorage(username, token);
    }
  };

  render() {
    const { username, token } = this.state;

    return (
      <div className="App" style={{ padding: "20px" }}>
        <form
          autoCapitalize="off"
          autoComplete="off"
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "325px"
          }}
        >
          <div
            style={{
              fontSize: "18pt",
              marginBottom: "20px"
            }}
          >
            GitHub Repo Pull Requests
          </div>
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
              style={{
                marginTop: "20px"
              }}
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
