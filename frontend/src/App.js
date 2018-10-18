import React, { Component } from 'react';
import AuthService from 'views/Components/AuthService';
import withAuth from 'views/Components/withAuth';
import Disciplinas from "views/Disciplinas/Disciplinas.jsx";
import UsuarioDisciplinas from "views/UsuarioDisciplinas/UsuarioDisciplinas.jsx";
import Topicos from "views/Topicos/Topicos.jsx";
import Forum from "views/Forum/Forum.jsx";

import Footer from "components/Footer/Footer.jsx";
import classNames from "classnames";
import List from "material-ui/List";
import ListItem from "material-ui/List/ListItem";
import Header from "components/Header/Header.jsx";
// import CustomInput from "components/CustomInput/CustomInput.jsx";
// import IconButton from "components/CustomButtons/IconButton.jsx";
import Button from "components/CustomButtons/Button.jsx";
// import Search from "@material-ui/icons/Search";
// import HomeIcon from "@material-ui/icons/Home";
import ExitIcon from "@material-ui/icons/ExitToApp";
import Icon from '@material-ui/core/Icon';

import AccountCircle from "@material-ui/icons/AccountCircle";
import Settings from "@material-ui/icons/Settings";

import appStyle from "assets/jss/material-kit-react/views/app.jsx";
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import "assets/scss/material-kit-react.css";
import "assets/scss/pomus-styles.css";
import green from '@material-ui/core/colors/green';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const Auth = new AuthService();

const appTheme = createMuiTheme({
  palette: {
    primary: green,
  },
});

class App extends Component {
  handleLogout(){
    Auth.logout();
    this.props.history.replace('/login');
  }
  
  render() {                
    const { classes, user, history, ...rest} = this.props;  
    // console.log(user);  
    return (
        <div className="App">
          <MuiThemeProvider theme={appTheme}>          
            <Header
              color="info"
              absolute
              brand={"Pomus - Cultive o Conhecimento" }
              {...rest}
              rightLinks={
                
                <List className={classes.list}>                  
                    <ListItem className={classes.listItem}>
                      <Button
                        className={classes.navLink}
                        color="transparent"
                      >
                      <Link to={'/app/disciplinas'}  className={classes.link}>
                        <Icon  className={classes.icons}>subject_icon</Icon>
                          Disciplinas
                      </Link>
                      </Button>
                    </ListItem>                    
                    <ListItem className={classes.listItem}>
                      <Button
                        className={classes.navLink}
                        color="transparent"
                      >
                      <Link to={'/app/admin'}  className={classes.link}>
                      <Settings className={classes.icons} />
                        Admin
                      </Link>
                      </Button>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                      <Button
                        className={classes.navLink}
                        color="transparent"
                      >
                      <Link to={'/app'}  className={classes.link}>
                      <AccountCircle className={classes.icons} />
                        Perfil
                      </Link>
                      </Button>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                        <Button
                          className={classes.navLink}
                          onClick={this.handleLogout.bind(this)}
                          color="transparent"
                        >
                      <Link to={'/login'}  className={classes.link}>
                        <ExitIcon  className={classes.icons}/>
                          Sair
                      </Link>
                        </Button>
                    </ListItem>
                  </List>                           
                }
              
            />
            <div className={classNames(classes.main, classes.mainRaised)}>
              <div className={classes.container}>
                <Route path='/app/disciplinas' render={() => (
                  <UsuarioDisciplinas user={user} history={this.props.history}/>
                  )}/>                         
                <Route path='/app/admin' render={() => (
                  <Disciplinas history={this.props.history} user={user}/>
                  )}/>    
                <Route exact path='/app' render={() => (
                  <div>
                    <h3>Bem Vinde!</h3>
                    <h5>A vida na poli não é fácil...</h5>
                    <p> 
                      Foi focando em você e em seus estudos que esta 
                      plataforma foi feita.
                    </p>
                    <p>
                      O objetivo dela é permitir o compartilhamento de arquivos úteis para as disciplinas, 
                      e também ser um forum para esclarecimento de dúvidas.  
                    </p>
                    <h5>Como utilizar:</h5>
                    <ul>
                      <li>Na aba <b>admin</b> é posível criar e editar disciplinas no sistema. </li>
                      <li>Na aba <b>disciplinas </b> você pode criar uma lista com as suas disciplinas no semestre e acessar os tópicos de cada uma. </li>
                      <li>Ao clicar na disciplina você pode visualizar seus tópicos e criar novos tópicos. </li>
                      <li>Em cada tópico é possível fazer o upload de até 5 arquivos e há uma discussão com comentários e respostas em forma de fórum.</li>
                    </ul>  
                    <h4>              
                      Pomus - Colabore, compartilhe e cultive o conhecimento!   
                    </h4>
                  </div>                    
                  )}/>    
                <Route exact path='/app/topicos' render={() => (
                  <Topicos history={this.props.history} user={user} search={this.props.history.location.search}/> 
                  )}/>                                    
                <Route path='/app/topicos/forum' render={() => (
                  <Forum history={this.props.history} user={user} search={this.props.history.location.search}/> 
                  )}/>                                    
              </div>              
            </div>
            <Footer />
          </MuiThemeProvider>
        </div>
    );
  }
}

export default withStyles(appStyle)(withAuth(App));