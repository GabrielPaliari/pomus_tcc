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
const MAXFILES = 5;
const MAXFILESIZE = 5000000; //5MB

class Topicos extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      topicos: [],
      discPai: {},
      addOpen: false,
      isFullOfFiles: false,
      sameFileName: false,
      maxSizeOn: false,
      selTopic: {
        titulo: '',
        explicacao: '',
        disc_pai: '',
        criado_por: '',
      },
      files: [],   
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
    this.fetchTopics();
    this.fetchDiscPai();
  }

  fetchTopics = () => {
    fetch(API + TOPICS_DISC + this.props.search)
      .then(response => response.json())
      .then(data => this.setState({ topicos: data }));
  };
  
  fetchDiscPai = () => {     
    const url = API + DISC_QUERY + this.props.search.slice(-1) + '/';
    console.log(url); 
    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ discPai: data }));
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
      addOpen: true,
      files: []
     });
  };

  handleClose = () => {
    this.setState({ 
      addOpen: false,
      selTopic: {
        titulo:  '',
        explicacao:  '',
      }  
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
        this.setState(prevState => ({            
          files: newFilesList,          
        }))            
      });        
    }
    console.log(this.state.files);
  }

  createTopic = () => {    
      let topico = this.state.selTopic;
      topico.criado_por = this.props.user.id;
      topico.disc_pai = this.state.discPai.id;
      fetch(API + TOPIC, {
        method: 'post',
        body: JSON.stringify(topico),
        headers:{
          'Content-Type': 'application/json'
        }
      })    
      .then(response => response.json())
      .then(data => {
          console.log(data);
          let topico_pai = data.id;
          this.state.files.forEach(function(f) {
            let data = new FormData();
            let file = new File([f.slice(0,-1)], Date.now() + '___' + f.name, {type: f.type}); // Grants that the names will be different   
            data.append("nome", file.name);  
            data.append("upload", file);             
            data.append("topico_pai", topico_pai);             
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
          });
          this.setState(prevState => ({            
            topicos: [...prevState.topicos, data]
          }))
          this.handleClose();
          console.log(this.state.topicos);
          alert("Tópico criado com sucesso!");                 
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
    let disciplina = this.state.discPai;
    let pageHeader = '';    
    if (disciplina.codigo) {
      pageHeader = <h4>{this.state.discPai.codigo + ' - ' + this.state.discPai.nome}</h4>;
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
    
    
    const addOpen = this.state.addOpen;
    let addForm 
    if (addOpen) {
      addForm = <div className="addFormContainer">
                  <IconButton onClick={this.handleClose} className='closeFormButon'>
                    <Icon>close</Icon>
                  </IconButton>
                  <Grid direction="column" container spacing={24}>
                    <h3 className="greenText">Novo Tópico</h3> 
                    <Grid item >
                      <p className="pMarginOut">Preencha o Formulário abaixo com título, explicação e associe os
                            arquivos dos anexos para criar um tópico para esta disciplina.</p>
                    </Grid>
                    <Grid item>                                                             
                      <TextField
                        name="titulo"
                        label="Título"
                        placeholder="Máx.: 500 caracteres"
                        margin="normal"
                        inputProps={{
                          maxLength: 400,
                        }}              
                        className="titleField"               
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
                        <ul className="newFileList">
                          {
                            this.state.files.map(f => 
                              <li key={f.name}>
                                <div>
                                  <Icon className='fileIcon'>attachment</Icon>                                  
                                  <p>{this.truncate(f.name, 20) + ' - ' + Math.round(f.size/1000) + ' Kbytes'}</p>
                                  <Icon onClick={() => (this.deleteFile(f))} className='delFileRight'>close</Icon>
                                </div>
                              </li>)
                          }
                        </ul>
                      </aside>
                    </div>
                    <Button2 
                      onClick={this.createTopic} 
                      type="button" 
                      color="success"
                      className="createTopicBtn"
                      disabled={!this.state.selTopic.titulo || !this.state.selTopic.explicacao}>Criar Tópico</Button2>      
                  </Grid>            
                </div> 
    } else {
      addForm = <Button variant="fab" mini aria-label="Adicionar" className="AddButton"
                  onClick={this.handleOpen}>
                  <AddIcon />
                </Button> 
    }   
    return (             
        <GridContainer direction="column" className="mainContainer">  
          <h3>Tópicos</h3>                
          {pageHeader}
          <Divider className="TopDivider"/>  
          <ListaTopicos 
            topicos={this.state.topicos} />
          <Divider className="BottomDivider"/>
          {addForm}
        </GridContainer>                            
      
    );
  }
}

export default withStyles(disciplinasStyle)(Topicos);
