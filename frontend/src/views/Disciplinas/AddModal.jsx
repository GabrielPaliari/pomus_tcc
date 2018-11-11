import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from 'components/CustomButtons/Button.jsx';
import green from '@material-ui/core/colors/green';

import AutoComplete from "views/Disciplinas/AutoComplete.jsx"

import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  paper: {
    margin: '20px auto',    
    width: theme.spacing.unit * 70,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  textField: {
    marginRight: 20,
    width: 200,
  },
  bigField: {
    width: 420
  },
  container: {
    paddingLeft: 20,
    maxHeight: "75vh",
    overflow: "auto"
  },
  createButton: {
    marginLeft: 260,
  }  
});

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

class AddModal extends React.Component {  
  render() {
    const { classes } = this.props;        
    return (
      <div>
        <MuiThemeProvider theme={theme}>
        <Modal          
          open={this.props.open}
          onClose={this.props.handleClose}
        >
          <div className={classes.paper}>
            <h2 variant="title" id="modal-title">
              Nova Disciplina
            </h2>          
            <Divider />
            <div className={classes.container}>
            <TextField
              name="codigo"
              label="Código da Disciplina"
              placeholder="ex.: MAT2454"
              margin="normal"
              inputProps={{
                maxLength: 7,
              }}  
              className={classes.textField}     
              //value={this.props.newDisc.codigo}       
              onChange={this.props.handleInputChange}
              required
            />
            <TextField
              name="nome"
              label="Nome"
              placeholder="ex.: Cálculo"
              margin="normal"
              inputProps={{
                maxLength: 70,
              }}
              className={classes.textField} 
              //value={this.props.newDisc.nome}
              onChange={this.props.handleInputChange}
              disabled = {(this.props.disabled)? "disabled" : ""}
            />
            <TextField
              name="descricao"
              label="Descrição"
              placeholder="Máx.: 400 caracteres"
              inputProps={{
                maxLength: 400,
              }}
              margin="normal"
              multiline
              rowsMax="3"
              className={classes.bigField} 
              //value={this.props.newDisc.descricao}
              onChange={this.props.handleInputChange}
              disabled = {(this.props.disabled)? "disabled" : ""}
            />
            <TextField
              name="creditosA"
              label="Créditos Aula"
              placeholder=""
              margin="normal"
              type="number"
              className={classes.textField}
              //value={this.props.newDisc.creditosA}
              onChange={this.props.handleInputChange}
              disabled = {(this.props.disabled)? "disabled" : ""}
            />
            <TextField
              name="creditosT"
              label="Créditos Trabalho"
              placeholder=""
              margin="normal"
              type="number"
              className={classes.textField}
              //value={this.props.newDisc.creditosT}
              onChange={this.props.handleInputChange}
              disabled = {(this.props.disabled)? "disabled" : ""}
            />
            <TextField
              name="dataIni"
              label="Data de Início"
              type="date"
              defaultValue="2018-08-01"
              className={classes.textField}   
              //value={this.props.newDisc.dataIni}
              onChange={this.props.handleInputChange}           
            />
            <TextField
              name="dataFim"
              label="Data de Fim"
              type="date"
              defaultValue="2018-12-01"
              className={classes.textField}    
              //value={this.props.newDisc.dataFim}
              onChange={this.props.handleInputChange}          
            />
            <TextField
              name="objetivos"
              label="Objetivos"
              placeholder="Máx.: 500 caracteres"
              margin="normal"
              inputProps={{
                maxLength: 400,
              }}
              multiline
              rowsMax="3"
              className={classes.bigField} 
              //value={this.props.newDisc.objetivos}
              onChange={this.props.handleInputChange}
              disabled = {(this.props.disabled)? "disabled" : ""}
            />
            <TextField
              name="programa"
              label="Programa"
              placeholder="Máx.: 1000 caracteres"
              margin="normal"
              inputProps={{
                maxLength: 600,
              }}
              multiline
              rowsMax="3"
              className={classes.bigField} 
              //value={this.props.newDisc.programa}
              onChange={this.props.handleInputChange}
              disabled = {(this.props.disabled)? "disabled" : ""}
            />
            <AutoComplete 
              preRequisitos={this.props.preRequisitos} 
              disciplinas={this.props.disciplinas}
              handleChange={this.props.handleChangeMultiSel}/>
            <Button onClick={this.props.createDisc} className={classes.createButton} type="button" color="success">Pesquisar Disciplina</Button>            
            <Button onClick={this.props.createDisc} className={classes.createButton} type="button" color="success">Criar Disciplina</Button>            
            </div>
            <AddModalWrapped />
          </div>
        </Modal>
        </MuiThemeProvider>
      </div>
    );
  }
}

AddModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const AddModalWrapped = withStyles(styles)(AddModal);

export default AddModalWrapped;