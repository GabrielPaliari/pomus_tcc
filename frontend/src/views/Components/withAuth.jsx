import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
  const Auth = new AuthService();
  // const API = 'http://ec2-18-231-198-111.sa-east-1.compute.amazonaws.com:8000/api/';
  const API = 'http://localhost:8000/api/';
//   const DISC_QUERY = 'disciplinas/';
  const USER_QUERY = 'usuarios/';


  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
          user: null
      }
    }  

    componentWillMount() {
      if (!Auth.loggedIn()) {
          this.props.history.replace('/login')
      }
      else {
          try {
              const profile = Auth.getProfile();
              console.log(profile);              
                fetch(API + USER_QUERY + profile.user_id + "/", {
                  headers: {
                    'Authorization': 'Bearer ' + Auth.getToken()
                  }
                })
                  .then(response => response.json())
                  .then(data => {
                    this.setState({ user: data })
                  });              
          }
          catch(err){
              Auth.logout()
              this.props.history.replace('/login')
          }
      }
    }

    render() {
      const { classes } = this.props;
      if (this.state.user) {
          return (
              <AuthComponent history={this.props.history} user={this.state.user} classes={classes}/>
          )
      }
      else {
          return null
      }
    }
  }
}