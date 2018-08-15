import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from 'components/CustomButtons/Button.jsx';
import green from '@material-ui/core/colors/green';

import AutoComplete from "views/UsuarioDisciplinas/AutoComplete.jsx"

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

class UsuarioAddModal extends React.Component {  
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
            <AutoComplete 
              disciplinas={this.props.disciplinas}
              addDisciplina={this.props.addDisciplina}
              handleChange={this.props.handleChangeSel}/>
            <Button onClick={this.props.addDisc} className={classes.createButton} type="button" color="success">Adicionar Disciplina</Button>            
            </div>
            <UsuarioAddModalWrapped />
          </div>
        </Modal>
        </MuiThemeProvider>
      </div>
    );
  }
}

UsuarioAddModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const UsuarioAddModalWrapped = withStyles(styles)(UsuarioAddModal);

export default UsuarioAddModalWrapped;