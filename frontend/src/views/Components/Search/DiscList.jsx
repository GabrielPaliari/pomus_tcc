import React from "react";
// material-ui components

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'


class DiscList extends React.Component {
  truncate(string, maxSize) {        
    if (string.length > maxSize) {
      return (string.substring(0,maxSize) + "...");
    } else {
      return string;
    }
  }
  render() {
    return (
        <div>
          <h4>Disciplinas</h4>        
          <List className="DiscList">
            {this.props.disciplinas.map(disc =>
              <ListItem button key={disc.id} className="ListItem">
                <Link  className="ClickContainer" to={'topicos?disc_id=' + disc.id}>
                  <Avatar className="IconAvatar">
                    <Icon>subject_icon</Icon>
                  </Avatar>
                  <ListItemText 
                    primary={this.truncate((disc.codigo + " - " + disc.nome), 40)} 
                    secondary={this.truncate(disc.descricao, 47)} />  
                </Link>
              </ListItem>            
            )}                    
          </List>
        </div>
    );
  }
}

export default (DiscList);
