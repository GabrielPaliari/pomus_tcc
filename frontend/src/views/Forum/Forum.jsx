import React from "react";
import withStyles from "material-ui/styles/withStyles";

import GridContainer from "components/Grid/GridContainer.jsx";

import TextField from '@material-ui/core/TextField';
import disciplinasStyle from "assets/jss/material-kit-react/views/disciplinas.jsx";

import ComentarioList from "views/Components/Comentarios/ComentarioList.jsx"
import Dropzone from 'react-dropzone'
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Button2 from 'components/CustomButtons/Button.jsx';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';

import AlertDialog from 'views/Components/Alerts/AlertDialog.jsx';

import AuthService from "views/Components/AuthService.jsx";
import CustomSnack from 'views/Components/Alerts/SnackBar.jsx';

const API = 'http://ec2-18-231-198-111.sa-east-1.compute.amazonaws.com:8000/api/';
const DISC_QUERY = 'disciplinas/';
const TOPIC = 'topicos/';
const FILES = 'arquivos/';
const FILESTOPIC = 'arquivos_topic/';
const MAXFILES = 5;
const MAXFILESIZE = 5000000; //5MB

class Forum extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      discPai: {},
      isEditing: false,
      isFullOfFiles: false,
      sameFileName: false,
      maxSizeOn: false,
      dialogOpen: false,
      snackOpen: false,
      selTopic: {
        titulo:  '',
        explicacao:  '',
      },
      files: [], 
      prevFiles: [],
      arquivo: {
        name: '',
        upload: '',
        topico_pai: '',
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.Auth = new AuthService();
  }
  
  componentDidMount() {
    this.fetchData();
  }
  
  fetchData = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      const topicId = this.props.search.split('=')[1];   
      const urlTopic = API + TOPIC + topicId + '/';
      const urlFiles = API + FILESTOPIC + this.props.search;
       
      fetch(urlTopic, {
        headers: {
          'Authorization': 'Bearer ' + this.Auth.getToken()
        }
      })
        .then(response => response.json())
        .then(data => {        
          this.setState({ selTopic: data });        
          const urlDisc = API + DISC_QUERY + data.disc_pai + '/';
          fetch(urlDisc, {
            headers: {
              'Authorization': 'Bearer ' + this.Auth.getToken()
            }
          })
            .then(response => response.json())
            .then(disc => this.setState({ discPai: disc }));
        });
      fetch(urlFiles, {
        headers: {
          'Authorization': 'Bearer ' + this.Auth.getToken()
        }
      })
        .then(response => response.json())
        .then(data => {
          this.setState ({
            files: data,
            prevFiles: data,
          });
        });
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let selTopic = {...this.state.selTopic};
    selTopic[name] = value; 
    this.setState({selTopic});  

  }

  handleOpen = () => {
    this.setState({ 
      isEditing: true
     });
  };
  
  closeEdit = () => {    
    let prevFiles = this.state.prevFiles;
    this.setState({ 
      files: prevFiles,
      isEditing: false 
    });
  };


  handleClose = () => {
    this.setState({ 
      isEditing: false
    });    
  };

  handleSnackOpen = () => {
    this.setState({ snackOpen: true });
  };

  handleSnackClose = (event, reason) => {
    this.setState({ snackOpen: false });
  };
  
  onDrop(files) {
    // Reset state
    this.setState({
      isFullOfFiles: false,
      sameFileName: false,
      maxSizeOn: false,
    }) 
    // Remove big files
    files.forEach((file, index) => {
      if (file.size > MAXFILESIZE) {
        files.splice(index,1);
        this.setState({
          maxSizeOn: true,
        });        
      }
    });
    // Remove same name files
    let newFilesList = this.state.files.concat(files); 
    newFilesList.forEach((file, index) => {
      for(let i = 0; i < newFilesList.length; i++) {
        if (file.name === newFilesList[i].name && index !== i) {
          newFilesList.splice(i, 1);
          this.setState({
            sameFileName: true,
          });
        }
      }
    });
    // Validate number of files and add to the list
    if ((newFilesList.length) > MAXFILES) {
      this.setState({isFullOfFiles: true});       
    } else {
      newFilesList.forEach(file => {             
        this.setState({ files: newFilesList });            
      });        
    }
  }

  updateTopic = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      let topico = this.state.selTopic;
      topico.criado_por = this.props.user.id;
      topico.disc_pai = this.state.discPai.id;      
      fetch(API + TOPIC + topico.id + '/', {
        method: 'put',
        body: JSON.stringify(topico),
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.Auth.getToken()
        }
      })    
      .then(response => response.json())
      .then(data => {          
          this.state.files.forEach((f, index) => {
            if (!f['id'] && this.Auth.loggedIn()) {
              let data = new FormData();
              let file = new File([f.slice(0,-1)], Date.now() + '___' + f.name, {type: f.type}); // Grants that the names will be different   
              data.append("name", file.name);  
              data.append("upload", file);             
              data.append("topico_pai", topico.id);                        
              data.append("size", file.size);                        
                      
              fetch(API + FILES, {
                method: 'post',
                body: data,
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Authorization': 'Bearer ' + this.Auth.getToken()
                },
              })    
              .then(response => response.json())
              .then(data => { 
                let filesOld = this.state.files;
                filesOld.splice(index, 1);
                filesOld.push(data);
                this.setState({ filesOld })                                             
              });
            }             
          }); 
          console.log(this.state.prevFiles);
          this.state.prevFiles.forEach((prevF, index) => {
            let deletedFile = true;
            this.state.files.forEach((f) => {
              if (prevF === f) {
                deletedFile = false;                
              }
            })
            if (deletedFile && this.Auth.loggedIn()) {
              fetch(API + FILES + prevF.id + '/', {
                method: 'delete',
                headers: {
                  'Authorization': 'Bearer ' + this.Auth.getToken()
                }
              })    
              .then(response => {
                console.log("deleted:");
                console.log(prevF);                 
              });              
            }
          })         
          this.handleClose();
          console.log(this.state.topicos);          
          this.handleDialogClose();       
          this.handleSnackOpen();            
      });
    }
  };

  deleteFile = (file) => {                   
    var files = [...this.state.files]; // make a separate copy of the array
    var index = files.indexOf(file);
    files.splice(index, 1);
    this.setState({files});
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  downloadFile(url) {
    window.open(url);
  }

  truncate(string, maxSize) {        
    if (string.length > maxSize) {
      return (string.substring(0,maxSize) + "...");
    } else {
      return string;
    }
  }

  render() {   
    let disciplina = this.state.discPai;
    let selTopic = this.state.selTopic;      
    let commentaryList;
    if (selTopic.id) {
      commentaryList = <ComentarioList history={this.props.history} user={this.props.user} topicoPai={selTopic.id}></ComentarioList>;
    }

    const isEditing = this.state.isEditing;
    let editOrDetail 
    if (isEditing) {
      editOrDetail = <Paper className="topicContainer">
                      <IconButton onClick={this.closeEdit} className='closeFormButon'>
                        <Icon>close</Icon>
                      </IconButton>
                      <Grid direction="column" container spacing={24}>
                        <h3 className="greenText">Editar Tópico</h3> 
                        <Grid item >
                          <p className="pMarginOut">Edite o formulário abaixo para modificar este tópico.</p>
                        </Grid>
                        <Grid item sm={12}>                                                             
                          <TextField
                            name="titulo"
                            label="Título"
                            placeholder="Máx.: 500 caracteres"
                            margin="normal"
                            inputProps={{
                              maxLength: 400,
                            }}              
                            className="titleField"  
                            value={selTopic.titulo}             
                            onChange={this.handleInputChange}
                          />
                        </Grid>
                        <Grid item>                                                  
                          <TextField
                            name="explicacao"
                            label="Explicação"
                            placeholder="Escreva aqui a explicação do tópico que deseja criar. (Max.: 3000 caracteres)"                        
                            inputProps={{
                              maxLength: 3000,
                            }}                        
                            rowsMax="15"
                            rows="5"
                            multiline
                            className="bigTextArea"   
                            value={selTopic.explicacao}          
                            onChange={this.handleInputChange}
                          />            
                        </Grid>                    
                        <div>
                          <div>                        
                            <Dropzone 
                              className="dropFilesZone" 
                              activeClassName="dropActive" 
                              rejectClassName="dropReject" 
                              onDrop={this.onDrop.bind(this)}>
                              <InputLabel>Anexos</InputLabel>
                              <p>Clique aqui ou arraste e solte os arquivos que deseja anexar.</p>
                            </Dropzone>
                          </div>
                          <aside className="filesDiv">
                            { this.state.isFullOfFiles ?
                              <div className="warnMsg">
                                <p>O número máximo de arquivos permitido por tópico é {MAXFILES}.</p>
                              </div> : '' }
                            { this.state.sameFileName ?
                              <div className="warnMsg">
                                <p>Os arquivos submetidos devem ter nomes únicos.</p>
                              </div> : '' } 
                            { this.state.maxSizeOn ?
                              <div className="warnMsg">
                                <p>Os arquivos submetidos podem ter no máximo {MAXFILESIZE/1000000}MB cada.</p>
                              </div> : '' }
                            {this.state.files.length > 0 ?
                              <InputLabel>Arquivos:</InputLabel> : '' }                                              
                            <ul>
                              {
                                this.state.files.map(f => 
                                  <li key={f.name}>
                                    <div>
                                      <Icon className='fileIcon'>attachment</Icon>                                  
                                      <a className='fileName' onClick={() => (this.downloadFile(f.upload))} download={f.name.split('___')[1]}>
                                        {(f.name.split('___')[1] ? this.truncate( f.name.split('___')[1], 20) : this.truncate( f.name, 20)) + ' - ' + Math.round(f.size/1000) + ' Kbytes'}
                                      </a>
                                      <a className='downloadFileIcon' onClick={() => (this.downloadFile(f.upload))} download={f.name.split('___')[1]}>
                                        <Icon>cloud_download</Icon>
                                      </a>
                                      <Icon onClick={() => (this.deleteFile(f))} className='delFileIcon'>close</Icon>
                                    </div>
                                  </li>)
                              }
                            </ul>
                          </aside>
                        </div>
                        <Button2 
                          onClick={this.handleDialogOpen} 
                          type="button" 
                          color="success"
                          className="finishEditBtn"
                          disabled={!this.state.selTopic.titulo || !this.state.selTopic.explicacao}>Finalizar edição</Button2>      
                      </Grid>
                      <AlertDialog
                        handleClose={this.handleDialogClose}
                        open={this.state.dialogOpen}
                        handleConfirm={this.updateTopic}
                        title={"Finalizar Edição"}
                        message={"Tem certeza que deseja finalizar a edição deste tópico? Essa operação não poderá ser desfeita."}
                        confirmBtnText={"Editar"}
                        cancelBtnText={"Cancelar"}></AlertDialog>   
                    </Paper> 
    } else {
      editOrDetail =  <Paper className="topicContainer">
                        <Grid direction="column" container spacing={24}>
                          <Grid item> 
                            <h4>Explicação:</h4> 
                            <p>{selTopic.explicacao}</p>          
                          </Grid>
                          <Divider/> 
                          <Grid item>   
                            {this.state.files.length > 0 ? <h4>Anexos:</h4> : ''}                
                            <div className="filesDiv">                                 
                                <ul>
                                  {
                                    this.state.files.map(f => 
                                      <li key={f.name}>
                                        <div>
                                          <Icon className='fileIcon'>attachment</Icon>                                  
                                          <a className='fileName' onClick={() => (this.downloadFile(f.upload))} download={f.name.split('___')[1]}>
                                            {(f.name.split('___')[1] ? this.truncate( f.name.split('___')[1], 20) : this.truncate( f.name, 20)) + ' - ' + Math.round(f.size/1000) + ' Kbytes'}
                                          </a>
                                          <a className='downloadFileIcon' onClick={() => (this.downloadFile(f.upload))} download={f.name.split('___')[1]}>
                                            <Icon>cloud_download</Icon>
                                          </a>                      
                                        </div>
                                      </li>)
                                  }
                                </ul>
                            </div>     
                          </Grid>
                            {this.props.user.id === selTopic.criado_por ? 
                              <Button variant="fab" color="primary" mini aria-label="Edit" className="EditButtonT"
                                onClick={this.handleOpen}>
                                <Icon>edit_icon</Icon>
                              </Button> : ''}                                         
                        </Grid>   
                      </Paper> 
    }   
    return (             
        <GridContainer direction="column" className="mainContainer">                     
          { disciplina.codigo ? 
            <h3>{this.state.discPai.codigo + ' - ' + selTopic.titulo}</h3> : '' }
          <Divider className="TopDivider"/>  
            {editOrDetail}
          <Divider className="BottomDivider"/>
          {commentaryList}
          <CustomSnack 
            position={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={this.state.snackOpen} 
            handleClick={this.handleSnackOpen} 
            handleClose={this.handleSnackClose}
            message={"Tópico editado. O upload de arquivos pode demorar alguns instantes"}/>
        </GridContainer>                            
      
    );
  }
}

export default withStyles(disciplinasStyle)(Forum);
