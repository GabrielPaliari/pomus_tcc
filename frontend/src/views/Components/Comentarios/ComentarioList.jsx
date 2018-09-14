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
import AddIcon from '@material-ui/icons/Add';

import AlertDialog from 'views/Components/Alerts/AlertDialog.jsx';
import ComentarioDetail from './ComentarioDetail.jsx';
import Textarea from 'react-textarea-autosize';

const API = 'http://localhost:8000/api/';
const TOPIC = 'topicos/';
const USER = 'usuarios/';
const COMENTARIO = 'comentarios/';
const COMENTARIO_TOPICO = 'comentarios_topic/';

class ComentarioList extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      autor: {},  
      comentarios: [],
      dialogOpen: false,
      newComment: {
        texto: '',
      },
      cToDel: {}           
    };
  }
  
  componentDidMount() {
    this.fetchList()
  }

  fetchList = () => {  
    let topicoPai = this.props.topicoPai;
    console.log(topicoPai);
    if (topicoPai) {       
      const commentListUrl = API + COMENTARIO_TOPICO + '?topic_id=' + topicoPai;
      console.log(commentListUrl);
      fetch(commentListUrl)
        .then(response => response.json())
        .then(data => {        
          console.log(data);
          this.setState({ comentarios: data });              
        }); 
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let newComment = {...this.state.newComment};
    newComment[name] = value; 
    this.setState({newComment});  
    // console.log(this.state.selTopic);  
  }

  createComment = () => {  
    let comment = this.state.newComment;
    comment.criado_por = this.props.user.id;
    comment.topico_pai = this.props.topicoPai;
    fetch(API + COMENTARIO, {
      method: 'post',
      body: JSON.stringify(comment),
      headers:{
        'Content-Type': 'application/json'
      }
    })   
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState(prevState => ({            
        comentarios: [...prevState.comentarios, data],        
        newComment: {
          texto: ''
        }
      }))      
    }) 
  };

  deleteComment = () => {
    let c = this.state.cToDel;          
    if (this.props.user.id === c.criado_por) {        
      const commUrl = API + COMENTARIO + c.id + '/';      
      fetch(commUrl, {
        method: 'delete'
      }) 
        .then(response => response)
        .then(data => {        
          this.setState({ autor: data });              
          var comentarios = [...this.state.comentarios]; // make a separate copy of the array
          var index = comentarios.indexOf(c);
          comentarios.splice(index, 1);
          this.setState({comentarios});
          this.handleDialogClose();
        }); 
    }
  };

  prepareDel = (c) => {
    this.setState({ 
      dialogOpen: true,
      cToDel: c
    });
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
    const { newComm, user , classes } = this.props;
    // console.log(this.state);    
    return (             
      <Grid item sm={12}>  
        <div className={classes.section}>
          <h5>Comentários</h5>
          <ul className={classes.commentsList}>
            {
              this.state.comentarios.map(c => 
                <li key={c.id}>
                  <ComentarioDetail user={user} comentario={c} del={this.prepareDel}></ComentarioDetail>
                </li>)
            }
          </ul>
        </div>
        <Divider className={classes.divider}/>
        <div className={classes.section}>
          <h5>Novo Comentário</h5>
          <Paper className={classes.addComm}>
            <Textarea name="texto"
                      value={this.state.newComment.texto}
                      minRows={2}
                      maxRows={10}
                      maxLength={1000}
                      className={classes.commTextArea}
                      onChange={this.handleInputChange}                      
                      placeholder="Escreva um comentário..."/>
          </Paper>      
          <Button variant="fab" mini aria-label="Adicionar" className='addCommentBtn'
            disabled={!this.state.newComment.texto} onClick={this.createComment}>
            <Icon>add_icon</Icon>
          </Button>
        </div>  
        <AlertDialog
            handleClose={this.handleDialogClose}
            open={this.state.dialogOpen}
            handleConfirm={this.deleteComment}
            title={"Deletar comentário"}
            message={"Tem certeza que deseja deltar este comentário? Essa operação não poderá ser desfeita."}
            confirmBtnText={"Deletar"}
            cancelBtnText={"Cancelar"}></AlertDialog>   
      </Grid>                                  
    );
  }
}

export default withStyles(comentariosStyle)(ComentarioList);
