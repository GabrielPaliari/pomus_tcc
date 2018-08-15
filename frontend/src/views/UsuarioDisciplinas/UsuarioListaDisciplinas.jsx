import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

class ListaDisciplinas extends React.Component {
  truncate(string, maxSize) {        
    if (string.length > maxSize) {
      return (string.substring(0,maxSize) + "...");
    } else {
      return string;
    }
  }

  render() {
    let discList;
    const divStyle = {
      textAlign: 'center',
      paddingTop: 10,
    }
    if (this.props.disciplinas.length === 0) {
      discList =  <div style={divStyle}>
                    <p>Você ainda não possui nenhuma disciplina na sua lista.</p>
                  </div>;      
    } else {
      discList =  <List className="DiscList">
                    {this.props.disciplinas.map(disc =>
                      <ListItem button key={disc.id} className="ListItem">
                        <div  className="ClickContainer">
                        <Avatar className="IconAvatar">
                          <Icon>subject_icon</Icon>
                        </Avatar>
                        <ListItemText 
                          primary={this.truncate((disc.codigo + " - " + disc.nome), 40)} 
                          secondary={this.truncate(disc.descricao, 47)} />  
                        </div>
                        <Tooltip title="Detalhes" placement="right" enterDelay={500}> 
                          <Button variant="fab" color="primary" mini aria-label="Details" className="EditButton" onClick={() => (this.props.showDetails(disc))}>
                            <Icon>description</Icon>
                          </Button>
                        </Tooltip> 
                        <Tooltip title="Deletar" placement="right" enterDelay={500}>
                          <Button 
                            variant="fab" mini aria-label="Delete" onClick={() => (this.props.deleteDisc(disc))}>
                            <DeleteIcon />
                          </Button>
                        </Tooltip>                         
                      </ListItem>            
                    )}                    
                  </List>;      
    }
    return (
      discList
    );
  }
}

export default withStyles()(ListaDisciplinas);
