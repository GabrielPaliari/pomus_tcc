import React from "react";
import withStyles from "material-ui/styles/withStyles";

import respostasStyle from "assets/jss/components/respostasStyle.jsx";
import Paper from '@material-ui/core/Paper';

import Icon from '@material-ui/core/Icon';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Textarea from 'react-textarea-autosize';

import AuthService from "views/Components/AuthService.jsx";

const API = 'http://localhost:8000/api/';
const USER = 'usuarios/';
const COMENTARIOS = 'comentarios/';

class RespostasDetail extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      autor: {},      
      editing: false,  
      commentEdit: {}, 
      edited: false,  
      liked: false,    
    };
    this.textInput = React.createRef();
    this.Auth = new AuthService();
  }
  
  componentDidMount() {
    this.fetchAutor();
    let comentario = this.props.comentario;
    if (comentario) {
      this.setState({
        commentEdit: {
          id: comentario.id,
          texto: comentario.texto
        }
      })      
    }
  }
  
  fetchAutor = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/pomus/login')
    }
    else {
      if (this.props.comentario) {       
        const userId = this.props.comentario.criado_por;   
        const userUrl = API + USER + userId + '/';
        fetch(userUrl, {
          headers: {
            'Authorization': 'Bearer ' + this.Auth.getToken()
          }
        })
          .then(response => response.json())
          .then(data => {                  
            this.setState({ 
              autor: data,            
            });                        
          }); 
      }
    }
  };  

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  editCom = () => {
    this.setState({editing: true});
  }
  
  finishEdit = (comentario) => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/pomus/login')
    }
    else {
      let commentEdit = this.state.commentEdit;
      if (comentario.criado_por === this.props.user.id && commentEdit.texto) {
        comentario.texto = commentEdit.texto; 
        console.log(comentario)
        fetch(API + COMENTARIOS + comentario.id + '/', {
          method: 'put',
          body: JSON.stringify(comentario),
          headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
          }
        })   
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.setState({
            editing: false,
            edited: true
          });   
        })   
      }
    }
  }

  cancelEdit = () => {
    this.setState({editing: false});    
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let commentEdit = {...this.state.commentEdit};
    commentEdit[name] = value; 
    this.setState({commentEdit});  
    // console.log(this.state.selTopic);  
  }

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
    let editIcon; 
    let editing = this.state.editing;
    let edited = this.state.edited || (comentario.criado_em !== comentario.editado_em);
    if (comentario.criado_por === user.id) {      
      delIcon = <Delete onClick={() => (this.props.del(comentario))} className='ComIcon'/>;
      editIcon = <Edit onClick={() => (this.editCom())} style={{right: 25, color: '#4caf50'}} className='ComIcon'/>; 
    }
    if (comentario && !editing) {
      return (             
          <Paper className={classes.commentaryPaper}>
            <b className={classes.userName}>{this.state.autor.username}</b>                                                           
            <span className={classes.date}>
              {" - " + comentario.criado_em.substring(11,16) +
                ' - ' + comentario.criado_em.substring(8,10) + 
                '/' + comentario.criado_em.substring(5,7) +
                ( edited ? ' (editado)' : '')}</span>           
            <p>{comentario.texto}</p>  
            {delIcon}        
            {editIcon}        
          </Paper>                                      
      );
    } else if (comentario && editing) {
      return (
        <Paper className={classes.commentaryPaper}>
          <Close onClick={() => (this.cancelEdit())} style={{right: 25}} className='ComIcon'/> 
          <Done onClick={() => (this.finishEdit(comentario))} style={{color: '#4caf50'}} className='ComIcon'/> 
          <Textarea name="texto"  
                    value={this.state.commentEdit.texto}                
                    minRows={1}
                    maxRows={5}
                    maxLength={300}
                    className={classes.commTextArea}
                    onChange={this.handleInputChange}                      
                    placeholder="Edite o seu comentário..."
                    ref={this.textInput}/>
        </Paper>   
      )   
    } else {
      return (        
        <p>loading...</p>
      )
    }
  }
}

export default withStyles(respostasStyle)(RespostasDetail);
