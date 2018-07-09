import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import 'typeface-roboto';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
  palette: {
    primary: { main: green[700] }, // Purple and green play nicely together.
    secondary: { main: purple[500] }, // This is just green.A700 as hex.
  },
});

class App extends Component {
  render() {
    return (      
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <MuiThemeProvider theme={theme}>
          <Button className="App-intro" variant="contained" color="primary">
            Setup do frontend com material ui
          </Button>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
