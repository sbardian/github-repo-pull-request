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
        console.log("app.js tab = ", tabs[0].id);
        window.chrome.tabs.sendMessage(tabs[0].id, {
          data: { username, token }
        });
      });
    } else {
      console.log("No username or token available.");
    }
  }

  saveToLocalStorage = (username, token) => {
    console.log("saveToLocalStorage : ", username, token);
    localStorage.setItem("GHRPR", JSON.stringify({ username, token }));
    window.chrome.tabs.query({ active: true, currentWindow: true }, function(
      tabs
    ) {
      console.log("app.js tab = ", tabs[0].id);
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
    console.log("username token from app.js = ", username, token);
    const localStorageObj = JSON.parse(localStorage.getItem("GHRPR"));
    if (localStorageObj) {
      console.log("fi localStorageObj");
      const { username: oldUsername, token: oldToken } = localStorageObj;
      console.log("oldusername, oldTOken: ", oldUsername, oldToken);
      if (username !== oldUsername || token !== oldToken) {
        console.log("not same");
        this.saveToLocalStorage(username, token);
      } else {
        this.saveToLocalStorage(oldUsername, oldToken);
      }
    } else {
      console.log("same as old saving");
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
