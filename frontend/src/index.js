import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import "assets/scss/material-kit-react.css";
import "assets/scss/pomus-styles.css";

import LoginPage from "views/LoginPage/LoginPage.jsx";
import SigninPage from "views/LoginPage/SignInPage.jsx";
import App from "App.js";

ReactDOM.render(
    <Router>
        <div>
          <Route path='/app' component={App} />          
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/signin' component={SigninPage} />
        </div>
    </Router>,
  document.getElementById("root")
);
