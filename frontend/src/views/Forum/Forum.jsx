import React from "react";
import withStyles from "material-ui/styles/withStyles";

import GridContainer from "components/Grid/GridContainer.jsx";

import ListaTopicos from "views/Topicos/ListaTopicos.jsx";
import TextField from '@material-ui/core/TextField';
import disciplinasStyle from "assets/jss/material-kit-react/views/disciplinas.jsx";

import Dropzone from 'react-dropzone'
import Grid from '@material-ui/core/Grid';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Button2 from 'components/CustomButtons/Button.jsx';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

const API = 'http://localhost:8000/api/';
const DISC_QUERY = 'disciplinas/';
const TOPICS_DISC = 'topicos_disc/';
const TOPIC = 'topicos/';
const FILES = 'arquivos/';
const FILESTOPIC = 'arquivos_topic/';
const FILEFOLDER = 'http://localhost:80/uploads/';
const MAXFILES = 5;
const MAXFILESIZE = 5000000; //5MB

class Forum extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      topicos: [],
      discPai: {},
      isEditing: false,
      isFullOfFiles: false,
      sameFileName: false,
      maxSizeOn: false,
      selTopic: {
        titulo:  '',
        explicacao:  '',
      },
      files: [], 
      prevFiles: [],
      arquivo: {
        nome: '',
        upload: '',
        topico_pai: '',
        formato: '',
        tamanho: '',
      }    
    };
    this.handleInputChange = this.handleInputChange.bind(this)
  }
  
  componentDidMount() {
    this.fetchData();
  }

  fetchTopics = () => {
    fetch(API + TOPICS_DISC + this.props.search)
      .then(response => response.json())
      .then(data => this.setState({ topicos: data }));
  };
  
  fetchData = () => {  
    const topicId = this.props.search.split('=')[1];   
    const urlTopic = API + TOPIC + topicId + '/';
    const urlFiles = API + FILESTOPIC + this.props.search;
    // console.log(url); 
    fetch(urlTopic)
      .then(response => response.json())
      .then(data => {        
        this.setState({ selTopic: data });        
        const urlDisc = API + DISC_QUERY + data.disc_pai + '/';
        fetch(urlDisc)
          .then(response => response.json())
          .then(disc => this.setState({ discPai: disc }));
      });
    fetch(urlFiles)
      .then(response => response.json())
      .then(data => {
        data.forEach(file => {
          let splited = file.upload.split('/');
          let path = splited[splited.length - 1];
          const fileId = file.id;
          console.log(FILEFOLDER + path);    
          // Access-Control-Allow-Origin: '*' Header is needed
          fetch(FILEFOLDER + path)
            .then(response => response.blob())  
            .then(blob => {     
              let fileObject = new File([blob], path);              
              let url = window.URL.createObjectURL(blob);         
              fileObject['id'] = fileId;              
              fileObject['url'] = url;              
              this.setState(prevState => ({            
                files: [...prevState.files, fileObject],
                prevFiles: [...prevState.prevFiles, fileObject],
              }))
            })
        });
      });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let selTopic = {...this.state.selTopic};
    selTopic[name] = value; 
    this.setState({selTopic});  
    // console.log(this.state.selTopic);  

  }

  handleOpen = () => {
    this.setState({ 
      isEditing: true,
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
        let url = window.URL.createObjectURL(file);
        file['url'] = url; 
        this.setState({ files: newFilesList });            
      });        
    }
    console.log(this.state.files);
  }

  updateTopic = () => {    
      let topico = this.state.selTopic;
      topico.criado_por = this.props.user.id;
      topico.disc_pai = this.state.discPai.id;      
      fetch(API + TOPIC + topico.id + '/', {
        method: 'put',
        body: JSON.stringify(topico),
        headers:{
          'Content-Type': 'application/json'
        }
      })    
      .then(response => response.json())
      .then(data => {
          console.log(data);          
          this.state.files.forEach(function(f) {
            if (!f['id']) {
              let data = new FormData();
              let file = new File([f.slice(0,-1)], Date.now() + '___' + f.name, {type: f.type}); // Grants that the names will be different   
              data.append("nome", file.name);  
              data.append("upload", file);             
              data.append("topico_pai", topico.id);             
              data.append("formato", file.type);             
              data.append("tamanho", file.size);             
                      
              fetch(API + FILES, {
                method: 'post',
                body: data,
                headers: {
                  Accept: 'application/json, text/plain, */*',
                },
              })    
              .then(response => response.json())
              .then(data => {            
                  console.log(data);                 
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
            if (deletedFile) {
              fetch(API + FILES + prevF.id + '/', {
                method: 'delete',                                
              })    
              .then(response => {
                console.log(response);           
                console.log("data"); 
                console.log("deleted:");
                console.log(prevF);                 
              });              
            }
          })         
          this.handleClose();
          console.log(this.state.topicos);
          alert("Tópico modificado com sucesso!");                 
      });                         
        
  };

  deleteFile = (file) => {                   
    var files = [...this.state.files]; // make a separate copy of the array
    var index = files.indexOf(file);
    files.splice(index, 1);
    this.setState({files});
  };

  truncate(string, maxSize) {        
    if (string.length > maxSize) {
      return (string.substring(0,maxSize) + "...");
    } else {
      return string;
    }
  }

  render() {   
    // console.log(this.state.selTopic);
    // console.log(this.props.search);
    // console.log("Files: ");
    // console.log(this.state.files);
    let disciplina = this.state.discPai;
    let selTopic = this.state.selTopic;
    let pageHeader = '';    
    if (disciplina.codigo) {
      pageHeader = <h3>{this.state.discPai.codigo + ' - ' + selTopic.titulo}</h3>;
    }
    let maxFilesMsg; 
    if (this.state.isFullOfFiles) {
      maxFilesMsg = <div className="warnMsg">
                      <p>O número máximo de arquivos permitido por tópico é {MAXFILES}.</p>
                    </div>;
    }
    let fileNameMsg; 
    if (this.state.sameFileName) {
      fileNameMsg = <div className="warnMsg">
                      <p>Os arquivos submetidos devem ter nomes únicos.</p>
                    </div>;
    } 
    let maxSizeMsg;
    if (this.state.maxSizeOn) {
      maxSizeMsg =  <div className="warnMsg">
                      <p>Os arquivos submetidos podem ter no máximo {MAXFILESIZE/1000000}MB cada.</p>
                    </div>;
    }
    let filesLabel;
    if (this.state.files.length > 0) {
      filesLabel =  <InputLabel>Arquivos:</InputLabel>
    }
    
    
    const isEditing = this.state.isEditing;
    let editOrDetail 
    if (isEditing) {
      editOrDetail = <div className="topicContainer">
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
                              <p>Arraste e solte aqui os arquivos que deseja anexar.</p>
                            </Dropzone>
                          </div>
                          <aside className="filesDiv">
                            {maxFilesMsg}
                            {fileNameMsg}
                            {maxSizeMsg}
                            {filesLabel}                                              
                            <ul>
                              {
                                this.state.files.map(f => 
                                  <li key={f.name}>
                                    <div>
                                      <Icon className='fileIcon'>attachment</Icon>                                  
                                      <a className='fileName' href={f.url} download={f.name.split('___')[1]}>
                                        {(f.name.split('___')[1] ? this.truncate( f.name.split('___')[1], 20) : this.truncate( f.name, 20)) + ' - ' + Math.round(f.size/1000) + ' Kbytes'}
                                      </a>
                                      <a className='downloadFileIcon' href={f.url} download={f.name.split('___')[1]}>
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
                          onClick={this.updateTopic} 
                          type="button" 
                          color="success"
                          className="createTopicBtn"
                          disabled={!this.state.selTopic.titulo || !this.state.selTopic.explicacao}>Finalizar edição</Button2>      
                      </Grid>   
                    </div> 
    } else {
      editOrDetail =  <div className="topicContainer">
                        <Grid direction="column" container spacing={24}>
                          <Grid item> 
                            <h4>Explicação:</h4> 
                            <p>{selTopic.explicacao}</p>          
                          </Grid>
                          <Divider/> 
                          <Grid item>   
                            <h4>Anexos:</h4>                
                            <div className="filesDiv">                                 
                                <ul>
                                  {
                                    this.state.files.map(f => 
                                      <li key={f.name}>
                                        <div>
                                          <Icon className='fileIcon'>attachment</Icon>                                  
                                          <a className='fileName' href={f.url} download={f.name.split('___')[1]}>
                                            {(f.name.split('___')[1] ? this.truncate( f.name.split('___')[1], 20) : this.truncate( f.name, 20)) + ' - ' + Math.round(f.size/1000) + ' Kbytes'}
                                          </a>
                                          <a className='downloadFileIcon' href={f.url} download={f.name.split('___')[1]}>
                                            <Icon>cloud_download</Icon>
                                          </a>                      
                                        </div>
                                      </li>)
                                  }
                                </ul>
                            </div>     
                          </Grid>
                          <Button variant="fab" color="primary" mini aria-label="Edit" className="EditButtonT"
                            onClick={this.handleOpen}>
                            <Icon>edit_icon</Icon>
                          </Button>                
                        </Grid>   
                      </div> 
    }   
    return (             
        <GridContainer direction="column" className="mainContainer">                 
          {pageHeader}
          <Divider className="TopDivider"/>  
            {editOrDetail}
          <Divider className="BottomDivider"/>
        </GridContainer>                            
      
    );
  }
}

export default withStyles(disciplinasStyle)(Forum);