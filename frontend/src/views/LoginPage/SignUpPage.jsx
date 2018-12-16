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
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import TextField from '@material-ui/core/TextField';

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg7.jpg";
import green from '@material-ui/core/colors/green';

import AuthService from 'views/Components/AuthService';
import LinearProgress from '@material-ui/core/LinearProgress';
import CustomSnack from 'views/Components/Alerts/SnackBar.jsx';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
      usuario: {
        username: "",
        name: "",
        email: "",
        nusp: 0,
        password1: "",
        password2: "",
      },      
      loading: false,
      erro: '',
      senhasDistintas: false,
      snackOpen: false,
      emailUsp: true,
    };    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleContinuousChange = this.handleContinuousChange.bind(this);
    this.back = this.back.bind(this);
    this.Auth = new AuthService();
    this.domain = 'http://ec2-18-231-198-111.sa-east-1.compute.amazonaws.com:8000/api/';
    // this.domain = 'http://ec2-18-231-198-111.sa-east-1.compute.amazonaws.com:8000/api/';
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
    if(this.Auth.loggedIn()) {
      this.props.history.replace('/');
    }
  }

  back = (event) => {
    this.props.history.replace('/login');
  }

  handleSubmit = () => {
    this.setState({erro: ''});
    let error = false;
    const usuario = this.state.usuario;
    /* Validações */
    if(usuario.password1.length < 8) {
      this.setState({erro: 'A senha deve ter no mínimo 8 caracteres'});      
      error = true;
    } else if(usuario.password1 != usuario.password2) {
      this.setState({erro: 'A senha e a confirmação devem ser iguais'});
      error = true;
    }          
    if (!error) {
      this.signup();
    }  
    
  }
  

  signup = () => {
    const usuario = this.state.usuario;
    this.state.loading = true;
    var mail = usuario.email;
    if (mail.substring(mail.length-7) !== "@usp.br" && this.state.emailUsp) {
      usuario.email = mail + "@usp.br";
    }      

    fetch(`${this.domain}rest-auth/registration/`, {
        method: 'post',
        body: JSON.stringify(usuario),
        headers: {
            'Content-Type': 'application/json'
          }
      })    
      .then(response => {
          this.state.loading = false;
          if (response.ok) {
            this.handleSnackOpen();                        
            return Promise.resolve();
          } else {
            response.json().then(data => {          
              if(data.username) {
                this.setState({erro: 'Nome de usuário já existente'});
              } else if (data.email) {
                this.setState({erro: 'Email inválido ou já existente'});
              } else {
                this.setState({erro: 'Ocorreu um erro no sistema'});
              }          
            })
          }
        }
      )
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let usuario = {...this.state.usuario};
    usuario[name] = value; 
    this.setState({usuario}); 
  };

  handleSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  }
  handleNumberChange = (event) => {
    const target = event.target;
    const name = target.name;

    if (/\D/g.test(target.value)){
			// Filter non-digits from input value.
      target.value = target.value.replace(/\D/g, '');
    }
    let usuario = {...this.state.usuario};
    usuario[name] = target.value; 
    this.setState({usuario}); 
  };

  handleContinuousChange = (event) => {
    const target = event.target;
    const name = target.name;
    let usuario = {...this.state.usuario};
    usuario[name] = target.value; 
    this.setState({usuario}); 
  };

  showError() {
    if(!this.state.erro) {
      return;
    }
    else {
      return (<div className="alert-danger alert-login" name="erroSignUp">
                {this.state.erro}
              </div>);
    }
  }

  handleSnackOpen = () => {
    this.setState({ snackOpen: true });
  };

  handleSnackClose = (event, reason) => {
    this.setState({ snackOpen: false });
    this.props.history.replace('/');
  };

  render() {
    const { classes, ...rest } = this.props;   
    const usuario = this.state.usuario;    
    let progress;
    if (this.state.loading) {
      progress = <LinearProgress color="primary" /> 
    }    
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
                      <h4>Pomus - Sign Up</h4>
                    </CardHeader>
                    {progress}
                    {this.showError()}
                    <CustomSnack 
                      open={this.state.snackOpen} 
                      handleClick={this.handleSnackOpen} 
                      handleClose={this.handleSnackClose}
                      message={"Usuário criado com sucesso!"}/>
                    <CardBody>
                      <TextField
                        model="username"
                        name="username"
                        label="Usuário"
                        placeholder="Usuário"
                        margin="normal"
                        inputProps={{
                          maxLength: 150,
                        }}
                        className={classes.textField} 
                        onChange={this.handleInputChange}
                      />
                      <TextField
                        model="name"
                        name="name"
                        label="Nome Completo"
                        placeholder="Nome Completo"
                        margin="normal"
                        inputProps={{
                          maxLength: 150,
                        }}
                        className={classes.textField} 
                        onChange={this.handleInputChange}
                      />
                      <div>
                        <TextField
                          model="email"
                          name="email"
                          label="e-mail"
                          placeholder="e-mail"
                          margin="normal"
                          inputProps={{
                            maxLength: 150,
                          }}
                          className={classes.textField} 
                          onChange={this.handleContinuousChange}
                          style = {{
                            width: 230,
                            marginRight: '0px',
                          }}
                        />                                                                     
                        <TextField
                          margin="normal"
                          label={this.state.emailUsp ? '@usp.br' : ""}
                          className={classes.textField}
                          style = {{
                            width: 60,
                            marginLeft: '0px',
                            marginRight: '0px',
                          }}
                          disabled
                        />
                        <FormControlLabel
                          label="Email Usp"
                          control={
                            <Switch
                              checked={this.state.emailUsp}
                              onChange={this.handleSwitch('emailUsp')}
                              value="emailUsp"
                              color="primary"
                            />
                          }                          
                        />                         
                      </div>
                      <TextField
                        model="nusp"
                        name="nusp"
                        label="NUSP"
                        placeholder="NUSP"
                        margin="normal"
                        inputProps={{
                          maxLength: 150,
                        }}
                        className={classes.textField} 
                        onChange={this.handleNumberChange}
                      />
                      <TextField
                        model="password1"
                        name="password1"
                        label="Senha"
                        placeholder="Senha"
                        margin="normal"
                        type="password"
                        inputProps={{
                          maxLength: 150,
                        }}
                        className={classes.textField} 
                        onChange={this.handleInputChange} 
                      />
                      <TextField
                        model="password2"
                        name="password2"
                        type="passwordConfirm"
                        label="Confirme Senha"
                        placeholder="Confirme Senha"
                        margin="normal"
                        type="password"
                        inputProps={{
                          maxLength: 150,
                        }}
                        className={classes.textField} 
                        onChange={this.handleInputChange} 
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button simple color="success" size="lg"
                        onClick={this.back}>
                        Voltar
                      </Button>
                      <Button onClick={this.handleSubmit} 
                              disabled={!usuario.username || 
                                        !usuario.name || 
                                        !usuario.email || 
                                        !usuario.nusp || 
                                        !usuario.password1 || 
                                        !usuario.password2} 
                              color="success" 
                              size="lg">
                        Registrar
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
