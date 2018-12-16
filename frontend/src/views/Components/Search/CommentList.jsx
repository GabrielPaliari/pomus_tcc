import React from "react";
// material-ui components

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import AuthService from "views/Components/AuthService.jsx";

const API = 'http://localhost:8000/api/';;
const USER = 'usuarios/';
const COMENTARIOS = 'comentarios/';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService();
  }
  truncate(string, maxSize) {        
    if (string.length > maxSize) {
      return (string.substring(0,maxSize) + "...");
    } else {
      return string;
    }
  }
  formatDate(date) {
    const formated = date.substring(11,16) +
                ' - ' + date.substring(8,10) + 
                '/' + date.substring(5,7);
    return formated;
  }
  componentDidMount() {
    this.fetchAutors();
  }
  
  fetchAutors = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      if (this.props.comentarios) { 
        const comments = [...this.props.comentarios];
        comments.forEach((comm, index) => {
          const userId = comm.criado_por;   
          const userUrl = API + USER + userId + '/';
          fetch(userUrl, {
            headers: {
              'Authorization': 'Bearer ' + this.Auth.getToken()
            }
          })
            .then(response => response.json())
            .then(data => {                
              comm['user'] = data.username;              
              this.setState({ 
                comentarios: comments               
              });                        
            });
        });      
      }
    } 
  }

  render() {
    return (
        <div>
          <h4>Comentários</h4>        
          <List className="DiscList">
            {this.props.comentarios.map(comm =>
              <ListItem button key={comm.id} className="ListItem">
                <Link  className="ClickContainer" to={'topicos/forum?topic_id=' + comm.topico_pai}>
                  <Avatar className="IconAvatar">
                    <Icon>subject_icon</Icon>
                  </Avatar>
                  <ListItemText 
                    primary={this.truncate((comm.user + " - " + this.formatDate(comm.criado_em)), 40)} 
                    secondary={this.truncate(comm.texto, 70)} />  
                </Link>
              </ListItem>            
            )}                    
          </List>
        </div>
    );
  }
}

export default (CommentList);
