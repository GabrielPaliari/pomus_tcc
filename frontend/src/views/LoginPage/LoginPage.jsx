import React from "react";
// material-ui components
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import InputAdornment from "material-ui/Input/InputAdornment";
// @material-ui/icons
// import UserIcon from "@material-ui/icons/AccountCircle";
// import LockOutline from "@material-ui/icons/LockOutline";
// import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.jsx";
// import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import IconButton from "components/CustomButtons/IconButton.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import TextField from '@material-ui/core/TextField';

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg7.jpg";
import green from '@material-ui/core/colors/green';

import AuthService from 'views/Components/AuthService';

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      username: "",
      password:"",
    };    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.Auth = new AuthService();
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  componentWillMount(){
    if(this.Auth.loggedIn())
        this.props.history.replace('/');
  }

  handleFormSubmit(e) {
    e.preventDefault();
   
    this.Auth.login(this.state.username,this.state.password)
    .then(res =>{
       this.props.history.replace('/');
    })
    .catch(err =>{
        alert(err);
    })
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value});    
  }
  

  render() {
    const { classes, ...rest } = this.props;            
    return (
      <div>
      <MuiThemeProvider theme={theme}>
        <Header
          absolute
          color="transparent"
          brand="Pomus - Cultive o Conhecimento"
          //rightLinks={<HeaderLinks />}
          {...rest}
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form} onSubmit={this.handleFormSubmit}>
                    <CardHeader color="success" className={classes.cardHeader}>
                      <h4>Pomus</h4>
                      <div className={classes.socialLine}>
                        <IconButton
                          href="#pablo"
                          target="_blank"
                          color="transparent"
                          onClick={e => e.preventDefault()}
                        >
                          <i
                            className={classes.socialIcons + " fab fa-twitter"}
                          />
                        </IconButton>
                        <IconButton
                          href="#pablo"
                          target="_blank"
                          color="transparent"
                          onClick={e => e.preventDefault()}
                        >
                          <i
                            className={classes.socialIcons + " fab fa-facebook"}
                          />
                        </IconButton>
                        <IconButton
                          href="#pablo"
                          target="_blank"
                          color="transparent"
                          onClick={e => e.preventDefault()}
                        >
                          <i
                            className={
                              classes.socialIcons + " fab fa-google-plus-g"
                            }
                          />
                        </IconButton>
                      </div>
                    </CardHeader>                                        
                    <p className={classes.divider}>Login</p>
                    <CardBody>                      
                    <TextField
                      name="username"
                      label="Usuário"
                      placeholder="Usuário"
                      margin="normal"
                      className={classes.textField} 
                      onChange={this.handleInputChange}
                    />
                    <TextField
                      name="password"
                      label="Senha"
                      placeholder="Senha"
                      margin="normal"
                      className={classes.textField} 
                      onChange={this.handleInputChange} 
                    />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button simple color="success" size="lg">
                        Registre-se
                      </Button>
                      <Button type="submit" color="success" size="lg">
                        Entrar
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <Footer whiteFont />
        </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
