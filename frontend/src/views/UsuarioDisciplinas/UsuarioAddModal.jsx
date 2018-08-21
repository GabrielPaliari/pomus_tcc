import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from 'components/CustomButtons/Button.jsx';
import green from '@material-ui/core/colors/green';

import AutoComplete from "views/UsuarioDisciplinas/AutoComplete.jsx"
import Details from "views/UsuarioDisciplinas/Details.jsx"

import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  paper: {
    margin: '20px auto',    
    width: '85vw',
    maxWidth: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    paddingBottom: 40,
    position: "relative"
  },
  textField: {
    margin: '0 auto',
    width: 200,
  },
  bigField: {
    width: 420
  },
  container: {
    paddingLeft: 20,
    maxHeight: "55vh",
    minHeight: 250,
    overflow: "auto",
    overflowX: "hidden",
    marginBottom: 50
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 70
  }  
});

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

class UsuarioAddModal extends React.Component {     
  render() {
    const { classes, open } = this.props;        
    return (
      <div>
        <MuiThemeProvider theme={theme}>
        <Modal          
          open={open}
          onClose={this.props.handleClose}
        >
          <div className={classes.paper}>
            <h2 variant="title" id="modal-title">
              Nova Disciplina
            </h2>          
            <Divider />
            <div className={classes.container}>
            <AutoComplete 
              className={classes.textField}
              disciplinas={this.props.disciplinas}
              handleChange={this.props.handleChangeSel}/>
            <Details selectedDisc={this.props.selectedDisc}/>
            </div>
            <Button disabled={!this.props.selectedDisc} onClick={this.props.addDisc} className={classes.createButton} type="button" color="success">Adicionar Disciplina</Button>            
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