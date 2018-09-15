import React from "react";
import withStyles from "material-ui/styles/withStyles";

import comentariosStyle from "assets/jss/components/comentariosStyle.jsx";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import Button2 from 'components/CustomButtons/Button.jsx';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import AlertDialog from 'views/Components/Alerts/AlertDialog.jsx';

const API = 'http://localhost:8000/api/';
const TOPIC = 'topicos/';
const USER = 'usuarios/';
const COMENTARIOS = 'comentarios/';

class ComentarioDetail extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      autor: {},               
    };
  }
  
  componentDidMount() {
    this.fetchAutor();
  }
  
  fetchAutor = () => {  
    if (this.props.comentario) {       
      const userId = this.props.comentario.criado_por;   
      const userUrl = API + USER + userId + '/';
      fetch(userUrl)
        .then(response => response.json())
        .then(data => {        
          this.setState({ autor: data });              
        }); 
    }
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  truncate(string, maxSize) {        
    if (string.length > maxSize) {
      return (string.substring(0,maxSize) + "...");
    } else {
      return string;
    }
  }

  render() {   
    const { comentario, classes, user } = this.props;   
    let delIcon; 
    if (comentario.criado_por === user.id) {
      delIcon = <Icon onClick={() => (this.props.del(comentario))} className='delFileIcon'>close</Icon> 
    }
    if (comentario) {
      return (             
          <Paper className={classes.commentaryPaper}>
            <b className={classes.userName}>{this.state.autor.username}</b>                                                           
            <span className={classes.date}>
              {" - " + comentario.criado_em.substring(11,16) +
                ' - ' + comentario.criado_em.substring(8,10) + 
                '/' + comentario.criado_em.substring(5,7) + 
                '/' + comentario.criado_em.substring(0,4)}</span>           
            <p>{comentario.texto}</p>   
            {delIcon}        
          </Paper>                                      
      );
    } else {
      return (        
        <p>loading...</p>
      )
    }
  }
}

export default withStyles(comentariosStyle)(ComentarioDetail);
