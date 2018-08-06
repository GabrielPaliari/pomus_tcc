import React, { Component } from 'react';
import AuthService from 'views/Components/AuthService';
import withAuth from 'views/Components/withAuth';
import Disciplinas from "views/Disciplinas/Disciplinas.jsx";


import Header from "components/Header/Header.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import IconButton from "components/CustomButtons/IconButton.jsx";
import Search from "@material-ui/icons/Search";
import ExitIcon from "@material-ui/icons/ExitToApp";

import disciplinasStyle from "assets/jss/material-kit-react/views/disciplinas.jsx";
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import "assets/scss/material-kit-react.css";
import "assets/scss/pomus-styles.css";

import green from '@material-ui/core/colors/green';

const Auth = new AuthService();

const appTheme = createMuiTheme({
  palette: {
    primary: green,
  },
});

class App extends Component {
  handleLogout(){
    Auth.logout()
    this.props.history.replace('/login');
  }
  render() {                
    const { classes, ...rest } = this.props;  
    return (
      <div className="App">
        <MuiThemeProvider theme={appTheme}>
        <div>
          <Header
            color="success"
            absolute
            brand={"Pomus - Usuário: " + this.props.user.user_id}
            {...rest}
            rightLinks={
              <div>              
                <CustomInput
                  white
                  inputRootCustomClasses={classes.inputRootCustomClasses}
                  formControlProps={{
                    className: classes.formControl
                  }}
                  inputProps={{
                    placeholder: "Buscar",
                    inputProps: {
                      "aria-label": "Buscar",
                      className: classes.searchInput
                    }
                  }}
                />
                <IconButton color="white">
                  <Search className={classes.searchIcon} />
                </IconButton>
                <IconButton color="white" onClick={this.handleLogout.bind(this)}>
                  <ExitIcon />
                </IconButton>

              </div>
            }
          />
          <div className={classes.pageHeader}>
            <div className={classes.container}>
              <Disciplinas userId={this.props.user.user_id}/>
            </div>
          </div>
        </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default withStyles(disciplinasStyle)(withAuth(App));