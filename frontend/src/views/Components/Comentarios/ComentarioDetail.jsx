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

import Textarea from 'react-textarea-autosize';

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
      editing: false,  
      commentEdit: {}, 
      edited: false,  
      liked: false,    
    };
    this.textInput = React.createRef();
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
    if (this.props.comentario) {       
      const userId = this.props.comentario.criado_por;   
      const userUrl = API + USER + userId + '/';
      fetch(userUrl)
        .then(response => response.json())
        .then(data => {                  
          this.setState({ 
            autor: data,            
          });                        
        }); 
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
    let commentEdit = this.state.commentEdit;
    if (comentario.criado_por === this.props.user.id && commentEdit.texto) {
      comentario.texto = commentEdit.texto; 
      console.log(comentario)
      fetch(API + COMENTARIOS + comentario.id + '/', {
        method: 'put',
        body: JSON.stringify(comentario),
        headers:{
          'Content-Type': 'application/json'
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

  likeComment = (comentario) => {
      let curtidas = comentario.curtidas;
      let userId = this.props.user.id;
      let index = curtidas.indexOf(userId);
      if (index === -1) {
        curtidas.push(userId);
        this.setState({liked: true})
      } else {
        curtidas.splice(index, 1);
        this.setState({liked: false})
      } 
      comentario.curtidas = curtidas;      
      console.log(comentario)
      fetch(API + COMENTARIOS + comentario.id + '/', {
        method: 'put',
        body: JSON.stringify(comentario),
        headers:{
          'Content-Type': 'application/json'
        }
      })   
      .then(response => response.json())
      .then(data => {        
        this.props.handleLiked(data);          
      }) 
      
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
    let liked = comentario.curtidas.indexOf(user.id) !== -1 || this.state.liked;
    if (comentario.criado_por === user.id) {      
      delIcon = <Icon onClick={() => (this.props.del(comentario))} className='ComIcon'>delete</Icon>;
      editIcon = <Icon onClick={() => (this.editCom())} style={{right: 25, color: '#4caf50'}} className='ComIcon'>edit</Icon>; 
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
            <Button onClick={() => (this.likeComment(comentario))} className={classes.LikeBtn}>
              <Icon style={{color: liked ?  '#4caf50' : '#CCCCCC'}}>thumb_up</Icon>               
            </Button>
            <span className={classes.LikeCount}>{comentario.curtidas.length}</span> 
          </Paper>                                      
      );
    } else if (comentario && editing) {
      return (
        <Paper className={classes.commentaryPaper}>
          <Icon onClick={() => (this.cancelEdit())} style={{right: 25}} className='ComIcon'>close</Icon> 
          <Icon onClick={() => (this.finishEdit(comentario))} style={{color: '#4caf50'}} className='ComIcon'>done</Icon> 
          <Textarea name="texto"  
                    value={this.state.commentEdit.texto}                
                    minRows={2}
                    maxRows={10}
                    maxLength={1000}
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

export default withStyles(comentariosStyle)(ComentarioDetail);
