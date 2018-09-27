import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import "assets/scss/material-kit-react.css";
import "assets/scss/pomus-styles.css";

import LoginPage from "views/LoginPage/LoginPage.jsx";
import SignUpPage from "views/LoginPage/SignUpPage.jsx";
import App from "App.js";

ReactDOM.render(
    <Router>
        <div>
          <Route path='/pomus/app' component={App} />          
          <Route exact path='/pomus/login' component={LoginPage} />
          <Route exact path='/pomus/signup' component={SignUpPage} />
          <Route exact path='/pomus' component={LoginPage} />
        </div>
    </Router>,
  document.getElementById("root")
);
