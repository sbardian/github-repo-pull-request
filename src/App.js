import React from "react"
import { Button, TextField } from "@material-ui/core"
import SaveIcon from "@material-ui/icons/Save"

const App = () => {
  const [username, setUsername] = React.useState()
  const [token, setToken] = React.useState()

  React.useEffect(() => {
    const GHRPR = localStorage.getItem("GHRPR")
    if (GHRPR) {
      const localStorageObj = JSON.parse(localStorage.getItem("GHRPR"))
      const { username, token } = localStorageObj
      setUsername(username)
      setToken(token)
      window.chrome.tabs.query({ active: true, currentWindow: true }, function (
        tabs
      ) {
        window.chrome.tabs.sendMessage(tabs[0].id, {
          data: { username, token },
        })
      })
    } else {
      console.log("No username or token")
    }
  }, [])

  const saveToLocalStorage = (username, token) => {
    localStorage.setItem("GHRPR", JSON.stringify({ username, token }))
    window.chrome.tabs.query({ active: true, currentWindow: true }, function (
      tabs
    ) {
      window.chrome.tabs.sendMessage(tabs[0].id, {
        data: { username, token },
      })
    })
  }

  const handleSave = () => {
    const localStorageObj = JSON.parse(localStorage.getItem("GHRPR"))
    if (localStorageObj) {
      const { username: oldUsername, token: oldToken } = localStorageObj
      if (username !== oldUsername || token !== oldToken) {
        saveToLocalStorage(username, token)
        window.chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            window.chrome.tabs.sendMessage(tabs[0].id, {
              data: { username, token },
            })
          }
        )
      } else {
        console.log("No change to username and/or token")
      }
    } else {
      console.log("Unable to access localStorage, saving data")
      saveToLocalStorage(username, token)
    }
  }

  const handleChange = (name) => (event) => {
    if (name === "username") {
      setUsername(event.target.value)
    }
    if (name === "token") {
      setToken(event.target.value)
    }
  }

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
          minWidth: "325px",
        }}
      >
        <div
          style={{
            fontSize: "18pt",
            marginBottom: "20px",
          }}
        >
          GitHub Repo Pull Requests
        </div>
        <TextField
          id="outlined-name"
          label="Github Username"
          value={username}
          onChange={handleChange("username")}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="Access Token"
          value={token}
          onChange={handleChange("token")}
          margin="normal"
          variant="outlined"
        />
        <div>
          <Button
            variant="contained"
            size="medium"
            style={{
              marginTop: "20px",
            }}
            onClick={() => handleSave()}
          >
            <SaveIcon />
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default App
