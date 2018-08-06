import React from "react";
import withStyles from "material-ui/styles/withStyles";

import GridContainer from "components/Grid/GridContainer.jsx";

import ListaDisciplinas from "views/Disciplinas/ListaDisciplinas.jsx";

import disciplinasStyle from "assets/jss/material-kit-react/views/disciplinas.jsx";

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import AddModal from "views/Disciplinas/AddModal.jsx";
import DetailsModal from "views/Disciplinas/DetailsModal.jsx";
import EditModal from "views/Disciplinas/EditModal.jsx";

const API = 'http://localhost:8000/api/';
const DISC_QUERY = 'disciplinas/';

class Disciplinas extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      disciplinas: [],
      open: false,
      detailsOpen: false,
      editOpen: false,
      selectedDisc: {
        preRequisitos: [],
      },
      newDisc: {
        codigo:   "",
        nome:     "",
        descricao:"",
        creditosA:1,
        creditosT:0,
        dataIni:  "2018-08-01",
        dataFim:  "2018-12-01",
        objetivos:"",
        programa: "",
        preRequisitos: [] 
      },      
      preRequisitos: [],   
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

    let newDisc = {...this.state.newDisc};
    newDisc[name] = value; 
    this.setState({newDisc});    

  }

  handleChangeMultiSel = name => value => {
    this.setState({
      [name]: value,
    });
    console.log(this.state.preRequisitos);
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
      .then(data => this.setState({ disciplinas: data }));
  };

  createDisc = () => {
    let disciplina = this.state.newDisc;
    let nomeNull = (disciplina.nome === "");
    let codeNull = (disciplina.codigo === "");
    // console.log(this.state.disciplinas);

    if (nomeNull || codeNull) {
      let alertString = "Os campos seguintes não podem ser deixados em branco: \n"
      if (nomeNull && codeNull) {
        alertString += "Código da Disciplina, Nome";
      } else if (codeNull) {
        alertString += "Código da Disciplina";
      } else {
        alertString += "Nome";
      }
      alert(alertString);
    } else {
      let preReq = this.state.preRequisitos;
      let preRequisitos = [];
      for (let i = 0; i < preReq.length; i++) {
        preRequisitos.push(preReq[i].value);
      };
      disciplina.preRequisitos = preRequisitos;   
      fetch(API + DISC_QUERY, {
        method: 'post',
        body: JSON.stringify(disciplina),
        headers:{
          'Content-Type': 'application/json'
        }
      })    
      .then(response => response.json())
      .then(data => {
        if (data.codigo[0] === "disciplina with this codigo already exists.") {
          alert("Já existe uma disciplina com o código: "+disciplina.codigo); 
        } else {
          this.setState(prevState => ({
            disciplinas: [...prevState.disciplinas, data]
          }))
          this.handleClose();
          console.log(this.state.disciplinas);
          alert("Disciplina "+disciplina.codigo+" criada com sucesso!"); 
        }          
      });                         
    }    
  };

  editDisc = () => {
    let disciplina = this.state.newDisc;
    let nomeNull = (disciplina.nome === "");
    let codeNull = (disciplina.codigo === "");    
    
    if (nomeNull || codeNull) {
      let alertString = "Os campos seguintes não podem ser deixados em branco: \n"
      if (nomeNull && codeNull) {
        alertString += "Código da Disciplina, Nome";
      } else if (codeNull) {
        alertString += "Código da Disciplina";
      } else {
        alertString += "Nome";
      }
      alert(alertString);
    } else {
      let preReq = this.state.preRequisitos;
      let preRequisitos = [];
      for (let i = 0; i < preReq.length; i++) {
        preRequisitos.push(preReq[i].value);
      };
      disciplina.preRequisitos = preRequisitos;   
      fetch(disciplina.url, {
        method: 'put',
        body: JSON.stringify(disciplina),
        headers:{
          'Content-Type': 'application/json'
        }
      })    
      .then(response => response.json())
      .then(data => {
        if (data.codigo[0] === "disciplina with this codigo already exists.") {
          alert("Já existe uma disciplina com o código: "+disciplina.codigo); 
        } else {
          let disciplinas = this.state.disciplinas;
          for (let i = 0; i < disciplinas.length; i++) {
            if (disciplinas[i]["id"] === disciplina["id"]) {
              disciplinas[i] = disciplina;
              this.setState({disciplinas});
            } 
          }
          this.handleClose();
          console.log(this.state.disciplinas);
          alert("Disciplina "+disciplina.codigo+" editada com sucesso!"); 
        }          
      });                         
    }    
  };

  deleteDisc = (disc) => {    
    
    let d = window.confirm("Você deseja realmente deletar a disciplina " + disc.codigo + "?");
    if (d === true) {
        let url = API + DISC_QUERY + disc.id +"/";
        // console.log(url);
        fetch(url, {
          method: 'delete',
        })    
        .then(response => {    
          if(response.ok) {
            let disciplinas = [...this.state.disciplinas]; 
            let index = disciplinas.indexOf(disc);
            disciplinas.splice(index, 1);
            this.setState({disciplinas});
            alert("Disciplina "+disc.codigo+" foi deletada com sucesso");  
          } else {
            alert("Ocorreu algum erro no sistema.");
          }                                       
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
          if (disciplinas[k]["url"] === preReqUrls[i]) {
            let option = {
              value: disciplinas[k]["url"], 
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
    //this.fetchDisc();
  }

  render() {      
    return (
      <div>        
        <GridContainer direction="column" className="DiscContainer">                  
          <h2>Disciplinas</h2>  
          <Divider className="TopDivider"/>  
          <ListaDisciplinas 
            disciplinas={this.state.disciplinas} 
            deleteDisc={this.deleteDisc}
            showDetails={this.showDetails}
            openEdit={this.openEdit}/>
          <Divider className="BottomDivider"/>
          <Button variant="fab" mini aria-label="Adicionar" className="AddButton"
                  onClick={this.handleOpen}>
            <AddIcon />
          </Button> 
        </GridContainer>                            
        <DetailsModal 
          selectedDisc={this.state.selectedDisc} 
          detailsOpen={this.state.detailsOpen}
          handleOpen={this.openDetails} 
          handleClose={this.handleClose} 
          disciplinas={this.state.disciplinas}/>
        <AddModal 
          disciplinas={this.state.disciplinas} 
          newDisc={this.state.newDisc}
          handleOpen={this.handleOpen} 
          handleClose={this.handleClose} 
          handleInputChange={this.handleInputChange}
          createDisc={this.createDisc}
          open={this.state.open}
          preRequisitos={this.state.preRequisitos}
          handleChangeMultiSel={this.handleChangeMultiSel}/>
        <EditModal 
          disciplinas={this.state.disciplinas} 
          selectedDisc={this.state.newDisc}
          handleOpen={this.openEdit} 
          handleClose={this.handleClose} 
          handleInputChange={this.handleInputChange}
          editDisc={this.editDisc}
          open={this.state.editOpen}
          preRequisitos={this.state.preRequisitos}
          handleChangeMultiSel={this.handleChangeMultiSel}/>
      </div>
      
    );
  }
}

export default withStyles(disciplinasStyle)(Disciplinas);
