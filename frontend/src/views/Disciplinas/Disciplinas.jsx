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
import AuthService from "views/Components/AuthService.jsx";

// const API = 'http://ec2-18-231-198-111.sa-east-1.compute.amazonaws.com:8000/api/';
const API = 'http://localhost:8000/api/';
const DISC_QUERY = 'disciplinas/';
const DISC_JUPITER_QUERY = 'disciplina_jupiter/';
const Auth = new AuthService(API);
var profile =  {
  user_id: 0
};

class Disciplinas extends React.Component {
  constructor(props) {
    super(props);
    if(Auth.loggedIn()) {
      profile = Auth.getProfile();
    }
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      disciplinas: [],
      open: false,
      detailsOpen: false,
      editOpen: false,
      selectedDisc: {
        preRequisitos: [],
      },
      discUser: {
        username: "",
        email: "",
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
        preRequisitos: [],
        criado_por: profile.user_id,
      },      
      preRequisitos: [],   
      codigoExiste: false,
      disabled: true
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.deleteDisc = this.deleteDisc.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.Auth = new AuthService();
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
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      fetch(API + DISC_QUERY, {
        headers: {
          'Authorization': 'Bearer ' + this.Auth.getToken()
        }
      })
        .then(response => response.json())
        .then(data => this.setState({ disciplinas: data }));
    }
  };

  createDisc = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
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
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
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
            alert("Disciplina "+disciplina.codigo+" criada com sucesso!"); 
          }
        });                         
      }
    }
  };

  searchDisc = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      let disciplina = this.state.newDisc;
      
      let codeNull = (disciplina.codigo === "");

      if (codeNull) {
        let alertString = "O campo seguinte não pode ser deixado em branco: \n"
        alertString += "Código da Disciplina";
        alert(alertString);
      } else {
        fetch(API + DISC_JUPITER_QUERY + "?sigla="+disciplina.codigo, {
          headers:{
            'Authorization': 'Bearer ' + this.Auth.getToken()
          }
        })    
        .then(response => response.json())
        .then(data => {
          let nomeNull = (data.nome === "");
          if (nomeNull) {
            let alertString = "Disciplina " + data.codigo + " não encontrada no sistema Júpiter: \n"
            alertString += "Certifique-se de que o código está correto";
            alert(alertString);
          } else {
            this.setState({newDisc: data});
          }
        });                         
      }
    }
  };

  editDisc = () => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
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
        let url = API + DISC_QUERY + disciplina.id +"/"; 
        fetch(url, {
          method: 'put',
          body: JSON.stringify(disciplina),
          headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
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
                disciplinas[i] = data;
                this.setState({disciplinas});
              } 
            }
            this.handleClose();
            alert("Disciplina "+disciplina.codigo+" editada com sucesso!"); 
          }
        });
      }
    }
  };

  deleteDisc = (disc) => {
    let d = window.confirm("Você deseja realmente deletar a disciplina " + disc.codigo + "?");
    if (d === true) {
      if (!this.Auth.loggedIn()) {
        this.props.history.replace('/login')
      }
      else {
          let url = API + DISC_QUERY + disc.id +"/";
          // console.log(url);
          fetch(url, {
            method: 'delete',
            headers: {
              'Authorization': 'Bearer ' + this.Auth.getToken()
            }
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
    }
  };

  showDetails = (disc) => {
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      fetch(API + 'usuarios/' + disc.criado_por + "/", {
        headers: {
          'Authorization': 'Bearer ' + this.Auth.getToken()
        }
      })
        .then(response => response.json())
        .then(data => {
          this.setState({ discUser: data }, () => {
            disc.criado_em = disc["criado_em"].replace('T', ' ');
            disc.editado_em = disc["editado_em"].replace('T', ' ');
            disc.criado_em = disc["criado_em"].substring(0, 19);
            disc.editado_em = disc["editado_em"].substring(0, 19);
            this.setState({
              selectedDisc: disc      
            }, function()  {
              this.openDetails();
            });
          });
        });
    }
  };

  openDetails = () => {
    this.setState({detailsOpen: true});
  }

  openEdit = (disc) => {
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
    this.fetchDisc();
  }

  render() {      
    return (
      <div>        
        <GridContainer direction="column" className="DiscContainer">                  
          <h3>Administrar Disciplinas do Sistema</h3>  
          <Divider className="TopDivider"/>  
          <ListaDisciplinas 
            disciplinas={this.state.disciplinas} 
            deleteDisc={this.deleteDisc}
            showDetails={this.showDetails}
            openEdit={this.openEdit}
            history={this.props.history}/>
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
          disciplinas={this.state.disciplinas}
          discUser={this.state.discUser}/>
        <AddModal 
          disciplinas={this.state.disciplinas} 
          newDisc={this.state.newDisc}
          handleOpen={this.handleOpen} 
          handleClose={this.handleClose} 
          handleInputChange={this.handleInputChange}
          createDisc={this.createDisc}
          searchDisc={this.searchDisc}
          open={this.state.open}
          preRequisitos={this.state.preRequisitos}
          handleChangeMultiSel={this.handleChangeMultiSel}
          disabled={this.state.disabled}/>
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
