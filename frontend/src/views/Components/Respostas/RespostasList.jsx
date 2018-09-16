import React from "react";
import withStyles from "material-ui/styles/withStyles";

import respostasStyle from "assets/jss/components/respostasStyle.jsx";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';

import AlertDialog from 'views/Components/Alerts/AlertDialog.jsx';
import RespostasDetail from './RespostasDetail.jsx';
import Textarea from 'react-textarea-autosize';

const API = 'http://localhost:8000/api/';
const RESPOSTAS_COMMENT = 'respostas_comment/';
const RESPOSTAS = 'respostas/';

class ComentarioList extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      autor: {},  
      respostas: [],
      dialogOpen: false,
      newResp: {
        texto: '',
      },
      cToDel: {},
      orderString: 'data'         
    };
  }
  
  componentDidMount() {
    this.fetchList();    
  }

  fetchList = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      let comentarioPai = this.props.comentarioPai;
      console.log(comentarioPai);
      if (comentarioPai) {       
        const respListUrl = API + RESPOSTAS_COMMENT + '?comment_id=' + comentarioPai;
        console.log(respListUrl);
        fetch(respListUrl, {
          headers: {
            'Authorization': 'Bearer ' + this.Auth.getToken()
          }
        })
          .then(response => response.json())
          .then(data => {        
            console.log(data);
            this.setState({ respostas: data });              
          }); 
      }
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let newResp = {...this.state.newResp};
    newResp[name] = value; 
    this.setState({newResp});  
    // console.log(this.state.selTopic);  
  }

  createResp = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      let resp = this.state.newResp;
      resp.criado_por = this.props.user.id;
      resp.comentario_pai = this.props.comentarioPai;
      if (resp.texto) {
        fetch(API + RESPOSTAS, {
          method: 'post',
          body: JSON.stringify(resp),
          headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
          }
        })   
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.setState(prevState => ({            
            respostas: [...prevState.respostas, data],        
            newResp: {
              texto: ''
            }
          }))      
        }) 
      }
    }
  };

  deleteResp = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      let r = this.state.cToDel;          
      if (this.props.user.id === r.criado_por) {        
        const commUrl = API + RESPOSTAS + r.id + '/';      
        fetch(commUrl, {
          method: 'delete',
          headers: {
            'Authorization': 'Bearer ' + this.Auth.getToken()
          }
        }) 
          .then(response => response)
          .then(data => {        
            this.setState({ autor: data });              
            var respostas = [...this.state.respostas]; // make a separate copy of the array
            var index = respostas.indexOf(r);
            respostas.splice(index, 1);
            this.setState({respostas});
            this.handleDialogClose();
          }); 
      }
    }
  };

  prepareDel = (r) => {
    this.setState({ 
      dialogOpen: true,
      cToDel: r
    });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleLiked = (r) => {
    let respostas = this.state.respostas;
    respostas.forEach((comment, index) => {
      if (r.id === comment.id) {
        respostas[index] = r;
      }
    }); 
    this.setState({ respostas });
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
    const { user, showResp, classes } = this.props;     
    let respCount = this.state.respostas.length;
    if (showResp) {
      return (             
        <Grid item sm={12} style={{marginTop: -30}}>  
          <div className={classes.section}>
            <ul className={classes.commentsList}>
              {this.state.respostas
                .sort((a, b) => {
                  if (this.state.orderString === 'data') {
                    return a.criado_em > b.criado_em; 
                  }                
                })
                .map(r => 
                  <li key={r.id}>
                    <RespostasDetail user={user} comentario={r} del={this.prepareDel} handleLiked={this.handleLiked}></RespostasDetail>
                  </li>)
              }
              <li>
                <Paper className={classes.addResp}>
                  <Textarea name="texto"
                            value={this.state.newResp.texto}
                            minRows={2}
                            maxRows={10}
                            maxLength={1000}
                            className={classes.commTextArea}
                            onChange={this.handleInputChange}                      
                            placeholder="Escreva uma resposta..."/>
                  <Icon variant="fab"                          
                        aria-label="Adicionar" 
                        onClick={this.createResp} 
                        style={{color: '#4caf50'}} 
                        className='RespIcon'>send</Icon>                          
                </Paper>              
              </li>
            </ul>
            <span onClick={this.props.toggleShow} className={classes.respCountSpan}>
              <p className={classes.respCount}>{ respCount === 1 ? "1 Resposta" : (respCount + " Respostas") }</p>
              <Icon className="ExpandIcon">expand_less</Icon>
            </span>   
          </div>                
          <AlertDialog
              handleClose={this.handleDialogClose}
              open={this.state.dialogOpen}
              handleConfirm={this.deleteResp}
              title={"Deletar Resposta"}
              message={"Tem certeza que deseja deletar esta resposta? Esta operação não poderá ser desfeita."}
              confirmBtnText={"Deletar"}
              cancelBtnText={"Cancelar"}></AlertDialog>   
        </Grid>                                  
      );
    } else {
      return (
        <span className={classes.respCountSpan}>
          <p className={classes.respCount}>{ respCount === 1 ? "1 Resposta" : (respCount + " Respostas") }</p>
          <Icon className="ExpandIcon" onClick={this.props.toggleShow}>expand_more</Icon>
        </span>        
      );
    }
  }
}

export default withStyles(respostasStyle)(ComentarioList);
