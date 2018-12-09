import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

class ListaDisciplinas extends React.Component {
  truncate(string, maxSize) {        
    if (string.length > maxSize) {
      return (string.substring(0,maxSize) + "...");
    } else {
      return string;
    }
  }
  render() {
    // const { classes, ...rest } = this.props;
    //  console.log(this.props.disciplinas);
    return (
        <List className="DiscList">
          {this.props.disciplinas.map(disc =>
            <ListItem button key={disc.id} className="ListItem">
              <div  className="ClickContainer" onClick={() => (this.props.showDetails(disc))}>
              <Avatar className="IconAvatar">
                <Icon>subject_icon</Icon>
              </Avatar>
              <ListItemText 
                primary={this.truncate((disc.codigo + " - " + disc.nome), 40)} 
                secondary={this.truncate(disc.descricao, 47)} />  
              </div>
              <Button variant="fab" color="primary" mini aria-label="Edit" className="EditButton" onClick={() => (this.props.openEdit(disc))}>
                <Icon>edit_icon</Icon>
              </Button> 
            </ListItem>            
          )}                    
        </List>

    );
  }
}

export default withStyles()(ListaDisciplinas);
