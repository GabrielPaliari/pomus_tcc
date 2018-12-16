import React from "react";
// material-ui components

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'


class TopicList extends React.Component {
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
          <h4>Topicos</h4>        
          <List className="DiscList">
            {this.props.topicos.map(topic =>
              <ListItem button key={topic.id} className="ListItem">
                <Link  className="ClickContainer" to={'topicos/forum?topic_id=' + topic.id}>
                  <Avatar className="IconAvatar">
                    <Icon>subject_icon</Icon>
                  </Avatar>
                  <ListItemText 
                          primary={this.truncate((topic.titulo), 40)} 
                          secondary={this.truncate(topic.explicacao, 47)} />  
                </Link>
              </ListItem>            
            )}                    
          </List>
        </div>
    );
  }
}

export default (TopicList);
