import React from "react";
import withStyles from "material-ui/styles/withStyles";

import comentariosStyle from "assets/jss/components/comentariosStyle.jsx";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';

import AlertDialog from 'views/Components/Alerts/AlertDialog.jsx';
import ComentarioDetail from './ComentarioDetail.jsx';
import Textarea from 'react-textarea-autosize';

import AuthService from "views/Components/AuthService.jsx";

const API = 'http://ec2-18-231-198-111.sa-east-1.compute.amazonaws.com:8000/api/';
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
      cToDel: {},
      orderString: 'curtidas'         
    };
    this.Auth = new AuthService();
  }
  
  componentDidMount() {
    this.fetchList();    
  }

  fetchList = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      let topicoPai = this.props.topicoPai;
      console.log(topicoPai);
      if (topicoPai) {       
        const commentListUrl = API + COMENTARIO_TOPICO + '?topic_id=' + topicoPai;
        console.log(commentListUrl);
        fetch(commentListUrl, {
          headers: {
            'Authorization': 'Bearer ' + this.Auth.getToken()
          }
        })
          .then(response => response.json())
          .then(data => {        
            console.log(data);
            this.setState({ comentarios: data });              
          }); 
      }
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
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      let comment = this.state.newComment;
      comment.criado_por = this.props.user.id;
      comment.topico_pai = this.props.topicoPai;
      fetch(API + COMENTARIO, {
        method: 'post',
        body: JSON.stringify(comment),
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.Auth.getToken()
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
    }
  };

  deleteComment = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      let c = this.state.cToDel;          
      if (this.props.user.id === c.criado_por) {        
        const commUrl = API + COMENTARIO + c.id + '/';      
        fetch(commUrl, {
          method: 'delete',
          headers: {
            'Authorization': 'Bearer ' + this.Auth.getToken()
          }
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

  handleLiked = (c) => {
    let comentarios = this.state.comentarios;
    comentarios.forEach((comment, index) => {
      if (c.id === comment.id) {
        comentarios[index] = c;
      }
    }); 
    this.setState({ comentarios });
  };

  orderBy = (orderString) => {
    this.setState({orderString});
  }

  truncate(string, maxSize) {        
    if (string.length > maxSize) {
      return (string.substring(0,maxSize) + "...");
    } else {
      return string;
    }
  }

  render() {   
    const { user , classes } = this.props;     
    return (             
      <Grid item sm={12}>  
        <div className={classes.section}>
          <span className={classes.orderSpan}>Ordenar por: <Button onClick={() => (this.orderBy('curtidas'))}>curtidas</Button> | <Button onClick={() => (this.orderBy('data'))}>Data de criação</Button></span>
          <h4>Comentários</h4>
          <ul className={classes.commentsList}>
            {this.state.comentarios
              .sort((a, b) => {
                if (this.state.orderString === 'curtidas') {
                  return a.curtidas.length < b.curtidas.length;
                } else if (this.state.orderString === 'data') {
                  return a.criado_em < b.criado_em; 
                }                
              })
              .map(c => 
                <li key={c.id}>
                  <ComentarioDetail user={user} comentario={c} del={this.prepareDel} handleLiked={this.handleLiked}></ComentarioDetail>
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
            message={"Tem certeza que deseja deletar este comentário? Esta operação não poderá ser desfeita."}
            confirmBtnText={"Deletar"}
            cancelBtnText={"Cancelar"}></AlertDialog>   
      </Grid>                                  
    );
  }
}

export default withStyles(comentariosStyle)(ComentarioList);
