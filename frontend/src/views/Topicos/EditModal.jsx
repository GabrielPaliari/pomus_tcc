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

class EditModal extends React.Component {  
  render() {
    const { classes, selectedDisc } = this.props;
    if (selectedDisc) {
      return (
        <div>
          <MuiThemeProvider theme={theme}>
          <Modal          
            open={this.props.open}
            onClose={this.props.handleClose}
          >
            <div className={classes.paper}>
              <h2 variant="title" id="modal-title">
                Editar: {selectedDisc.codigo}
              </h2>          
              <Divider />
              <div className={classes.container}>
              <TextField
                name="nome"
                label="Nome"
                placeholder="ex.: Cálculo"
                margin="normal"
                className={classes.bigField} 
                value={selectedDisc.nome}
                onChange={this.props.handleInputChange}
                required
              />
              <TextField
                name="descricao"
                label="Descrição"
                placeholder="Máx.: 400 caracteres"
                margin="normal"
                multiline
                rowsMax="3"
                className={classes.bigField} 
                value={selectedDisc.descricao}
                onChange={this.props.handleInputChange}
              />
              <TextField
                name="creditosA"
                label="Créditos Aula"
                placeholder=""
                margin="normal"
                type="number"
                className={classes.textField}
                value={selectedDisc.creditosA}
                onChange={this.props.handleInputChange}
              />
              <TextField
                name="creditosT"
                label="Créditos Trabalho"
                placeholder=""
                margin="normal"
                type="number"
                className={classes.textField}
                value={selectedDisc.creditosT}
                onChange={this.props.handleInputChange}
              />
              <TextField
                name="dataIni"
                label="Data de Início"
                type="date"
                className={classes.textField}   
                value={selectedDisc.dataIni}
                onChange={this.props.handleInputChange}           
              />
              <TextField
                name="dataFim"
                label="Data de Fim"
                type="date"
                className={classes.textField}    
                value={selectedDisc.dataFim}
                onChange={this.props.handleInputChange}          
              />
              <TextField
                name="objetivos"
                label="Objetivos"
                placeholder="Máx.: 500 caracteres"
                margin="normal"
                multiline
                rowsMax="3"
                className={classes.bigField} 
                value={selectedDisc.objetivos}
                onChange={this.props.handleInputChange}
              />
              <TextField
                name="programa"
                label="Programa"
                placeholder="Máx.: 1000 caracteres"
                margin="normal"
                multiline
                rowsMax="3"
                className={classes.bigField} 
                value={selectedDisc.programa}
                onChange={this.props.handleInputChange}
              />
              <AutoComplete 
                preRequisitos={this.props.preRequisitos} 
                disciplinas={this.props.disciplinas}
                handleChange={this.props.handleChangeMultiSel}/>
              <Button onClick={this.props.editDisc} className={classes.createButton} type="button" color="success">Editar Disciplina</Button>            
              </div>
              <EditModalWrapped />
            </div>
          </Modal>
          </MuiThemeProvider>
        </div>
      );
    } else {
      return <div></div>;
    }       
  }
}

EditModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const EditModalWrapped = withStyles(styles)(EditModal);

export default EditModalWrapped;