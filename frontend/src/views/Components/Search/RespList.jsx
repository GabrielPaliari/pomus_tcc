import React from "react";
// material-ui components

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import AuthService from "views/Components/AuthService.jsx";

const API = 'http://ec2-18-231-198-111.sa-east-1.compute.amazonaws.com:8000/api/';;
const USER = 'usuarios/';
const COMENTARIOS = 'comentarios/';

class RespList extends React.Component {
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
      if (this.props.respostas) { 
        const resps = [...this.props.respostas];
        resps.forEach(resp => {
          const userId = resp.criado_por;   
          const userUrl = API + USER + userId + '/';
          fetch(userUrl, {
            headers: {
              'Authorization': 'Bearer ' + this.Auth.getToken()
            }
          })
            .then(response => response.json())
            .then(data => {                
              resp['user'] = data.username;              
              this.setState({ 
                respostas: resps               
              });                        
            });
        });      
        resps.forEach(resp => {
          const commentId = resp.comentario_pai;   
          const commentUrl = API + COMENTARIOS + commentId + '/';
          fetch(commentUrl, {
            headers: {
              'Authorization': 'Bearer ' + this.Auth.getToken()
            }
          })
            .then(response => response.json())
            .then(data => {                
              resp['topic'] = data.topico_pai;              
              this.setState({ 
                respostas: resps               
              });                        
            });
        });      
      }
    } 
  }

  render() {
    return (
        <div>
          <h4>Respostas</h4>        
          <List className="DiscList">
            {this.props.respostas.map(resp =>
              <ListItem button key={resp.id} className="ListItem">
                <Link  className="ClickContainer" to={'topicos/forum?topic_id=' + resp.topic}>
                  <Avatar className="IconAvatar">
                    <Icon>subject_icon</Icon>
                  </Avatar>
                  <ListItemText 
                    primary={this.truncate((resp.user + " - " + this.formatDate(resp.criado_em)), 40)} 
                    secondary={this.truncate(resp.texto, 70)} />  
                </Link>
              </ListItem>            
            )}                    
          </List>
        </div>
    );
  }
}

export default (RespList);
