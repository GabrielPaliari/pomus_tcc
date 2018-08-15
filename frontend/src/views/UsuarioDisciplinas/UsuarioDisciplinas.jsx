import React from "react";
import withStyles from "material-ui/styles/withStyles";

import GridContainer from "components/Grid/GridContainer.jsx";

import ListaDisciplinas from "views/UsuarioDisciplinas/UsuarioListaDisciplinas.jsx";

import disciplinasStyle from "assets/jss/material-kit-react/views/disciplinas.jsx";

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import UsuarioAddModal from "views/UsuarioDisciplinas/UsuarioAddModal.jsx";
import DetailsModal from "views/Disciplinas/DetailsModal.jsx";
import EditModal from "views/Disciplinas/EditModal.jsx";

import Tooltip from '@material-ui/core/Tooltip';

const API = 'http://localhost:8000/api/';
const DISC_QUERY = 'disciplinas/';
const USER_QUERY = 'usuarios/';

class UsuarioDisciplinas extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      disciplinas: [],
      disciplinasUsuario: [],
      disciplinasRestantes: [],
      open: false,
      detailsOpen: false,
      editOpen: false,
      selectedDisc: {
        preRequisitos: [],
      },    
      addDisciplina: {},   
      codigoExiste: false        
    };
    this.handleInputChange = this.handleInputChange.bind(this)
    this.deleteDisc = this.deleteDisc.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }
  
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;   

  }

  handleChangeSel = name => value => {
    this.setState({
      [name]: value,
    });
    console.log(this.state.addDisciplina);
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ 
      open: false,
      detailsOpen: false,
      editOpen: false,
      preRequisitos: [] 
    });
    
  };

  fetchDisc = () => {    
    fetch(API + DISC_QUERY)
      .then(response => response.json())
      .then(data => {
        let disciplinasUsuario = [];
        let idsDisc = this.props.user.disciplinas;
        let disciplinasRestantes = data.slice(0);
        for (let i = 0; i < idsDisc.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (idsDisc[i] === data[j]['id']) {
              disciplinasUsuario.push(data[j]);
              let index = disciplinasRestantes.indexOf(data[j]);
              disciplinasRestantes.splice(index, 1);
            } 
          } 
        }
        
        console.log(idsDisc);
        console.log(disciplinasRestantes);
        this.setState({ 
          disciplinasUsuario,
          disciplinasRestantes,
          disciplinas: data
        }); 
      });
  };

  addDisc = () => {
    let disciplina = this.state.addDisciplina;
    let user = this.props.user;
    user['disciplinas'].push(disciplina.value);
    
    fetch(API + USER_QUERY + this.props.user.id + "/", {
        method: 'put',
        body: JSON.stringify(user),
        headers:{
          'Content-Type': 'application/json'
        }
      })    
      .then(response => response.json())
      .then(data => {
        var disciplinasRestantes = [...this.state.disciplinasRestantes]; // make a separate copy of the array
        var index = disciplinasRestantes.indexOf(disciplina.disc)
        disciplinasRestantes.splice(index, 1);
        this.setState(prevState => ({
          disciplinasUsuario: [...prevState.disciplinasUsuario, disciplina.disc],
          disciplinasRestantes
        }))
        this.handleClose();                  
      });
  };

  deleteDisc = (disc) => {    
    let d = window.confirm("Você deseja realmente retirar a disciplina " + disc.codigo + " da sua lista?");
    if (d === true) {
      let user = this.props.user;
      user['disciplinas'].splice(user['disciplinas'].indexOf(disc.id), 1);
      
      fetch(API + USER_QUERY + this.props.user.id + "/", {
          method: 'put',
          body: JSON.stringify(user),
          headers:{
            'Content-Type': 'application/json'
          }
        })    
        .then(response => response.json())
        .then(data => {                
          var disciplinasUsuario = [...this.state.disciplinasUsuario]; // make a separate copy of the array
          var index = disciplinasUsuario.indexOf(disc);
          disciplinasUsuario.splice(index, 1);
          this.setState(prevState => ({
            disciplinasRestantes: [...prevState.disciplinasRestantes, disc],
            disciplinasUsuario
          }));
          this.handleClose();         
        });
    }
  };

  showDetails = (disc) => {   
    this.setState({
      selectedDisc: disc      
    }, function()  {
      this.openDetails();
    });     
  };

  openDetails = () => {
    this.setState({detailsOpen: true});
  }

  openEdit = (disc) => {   
    console.log(disc);    
    let preReqUrls = disc["preRequisitos"];
    let disciplinas = this.state.disciplinas;
    if (preReqUrls.length > 0) {
      for (let i = 0; i < preReqUrls.length; i++) {
        for (let k = 0; k < disciplinas.length; k++) {
          if (disciplinas[k]["id"] === preReqUrls[i]) {
            let option = {
              value: disciplinas[k]["id"], 
              label: disciplinas[k]["codigo"]
            }
            this.setState(prevState => ({
              preRequisitos: [...prevState.preRequisitos, option]
            }), function() {
              console.log(this.state.preRequisitos);
            })
          }        
        }                               
      }            
    }
    this.setState({
      newDisc: disc      
    }, function()  {
      this.setState({editOpen: true});
    });     
  };


  componentDidMount() {
    this.fetchDisc()       
  }

  render() {      
    return (
      <div>        
        <GridContainer direction="column" className="DiscContainer">                  
          <h2>Suas Disciplinas:</h2>  
          <p>Clique no botão + para adicionar disciplinas à sua lista.</p> 
          <Divider className="TopDivider"/>  
          <ListaDisciplinas 
            disciplinas={this.state.disciplinasUsuario} 
            deleteDisc={this.deleteDisc}
            showDetails={this.showDetails}
            openEdit={this.openEdit}/>
          <Divider className="BottomDivider"/>
          <Tooltip title="Adicionar Disciplina" placement="right" enterDelay={500}>
            <Button variant="fab" mini aria-label="Adicionar" className="AddButton"
                    onClick={this.handleOpen}>
              <AddIcon />
            </Button> 
          </Tooltip>
        </GridContainer>                            
        <DetailsModal 
          selectedDisc={this.state.selectedDisc} 
          detailsOpen={this.state.detailsOpen}
          handleOpen={this.openDetails} 
          handleClose={this.handleClose} 
          disciplinas={this.state.disciplinas}/>
        <UsuarioAddModal 
          disciplinas={this.state.disciplinasRestantes} 
          handleOpen={this.handleOpen} 
          handleClose={this.handleClose} 
          addDisc={this.addDisc}
          open={this.state.open}
          handleChangeSel={this.handleChangeSel}/>
      </div>
      
    );
  }
}

export default withStyles(disciplinasStyle)(UsuarioDisciplinas);
