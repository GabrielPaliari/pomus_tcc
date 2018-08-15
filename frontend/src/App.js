import React, { Component } from 'react';
import AuthService from 'views/Components/AuthService';
import withAuth from 'views/Components/withAuth';
import Disciplinas from "views/Disciplinas/Disciplinas.jsx";
import UsuarioDisciplinas from "views/UsuarioDisciplinas/UsuarioDisciplinas.jsx";


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
    const { classes, user, ...rest} = this.props;  
    let disciplinasDiv;
    console.log(user);
    if (user.is_superuser) {      
      disciplinasDiv = <Disciplinas user={user}/>
    } else {
      disciplinasDiv = <UsuarioDisciplinas user={user}/>
    }  
    return (
      <div className="App">
        <MuiThemeProvider theme={appTheme}>
        <div>
          <Header
            color="info"
            absolute
            brand={"Pomus - " + user.name + ", Cultive o conhecimento"}
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
              {disciplinasDiv}                          
            </div>
          </div>
        </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default withStyles(disciplinasStyle)(withAuth(App));