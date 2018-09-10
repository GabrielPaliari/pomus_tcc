import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
// import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
// import DeleteIcon from '@material-ui/icons/Delete';
// import Tooltip from '@material-ui/core/Tooltip';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class ListaTopicos extends React.Component {
  truncate(string, maxSize) {        
    if (string.length > maxSize) {
      return (string.substring(0,maxSize) + "...");
    } else {
      return string;
    }
  }

  render() {
    const { topicos } = this.props;
    let topicList;
    const divStyle = {
      textAlign: 'center',
      paddingTop: 10,
    }
    if (topicos.length === 0) {
      topicList = <div style={divStyle}>
                    <p>Esta disciplina ainda não possui nenhum tópico.</p>
                  </div>
    } else {
      topicList =  <List className="DiscList">
                    {topicos.map(topic =>
                      <ListItem button key={topic.id} className="ListItem">
                        <Link  className="ClickContainer" to={'topicos?topic_id=' + topic.id}>
                        <Avatar className="IconAvatar">
                          <Icon>subject_icon</Icon>
                        </Avatar>
                        <ListItemText 
                          primary={this.truncate((topic.titulo), 40)} 
                          secondary={this.truncate(topic.explicacao, 47)} />  
                        </Link>
                      </ListItem>            
                    )}                    
                  </List>;      
    }
    return (
      topicList
    );
  }
}

export default withStyles()(ListaTopicos);