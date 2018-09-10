import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
// import TextField from '@material-ui/core/TextField';
// import Button from 'components/CustomButtons/Button.jsx';
import green from '@material-ui/core/colors/green';

import Divider from '@material-ui/core/Divider';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 1,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  root: {
    flexGrow: 1,
    margin: "30px auto",
    padding: 40,
    maxWidth: "900px",  
  },
  field: {
    padding: theme.spacing.unit * 1,
  },
  container: {
    padding: 20,
    marginTop: 20,
    maxHeight: "50vh",    
    overflow: "auto",
  },
  title: {
    padding: theme.spacing.unit * 1,
    textAlign: 'center',
    fontSize: '0.9em',        
  },
  group: {
    alignItens: "center",
  }, 
  thead: {
    fontSize: "1em",
  } 
});

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

class DetailsModal extends React.Component {  
  render() {
    const { classes, selectedDisc, disciplinas } = this.props;
    let keys = [];    
    let preReq = [];    
    if (selectedDisc){      
      Object.keys(selectedDisc).forEach(function(key) {
        keys.push(key);
      });        
      let preReqUrls = selectedDisc["preRequisitos"];
      if (preReq.length === 0 && preReqUrls.length !== 0) {
        for (let i = 0; i < preReqUrls.length; i++) {
          for (let k = 0; k < disciplinas.length; k++) {
            if (disciplinas[k]["id"] === preReqUrls[i]) {
              preReq.push(disciplinas[k].codigo);
            }        
          }                               
        }            
      } 
    } 
    
    if (selectedDisc) {
      return (
        <div>
          <MuiThemeProvider theme={theme}>
          <Modal
            open={this.props.detailsOpen}
            onClose={this.props.handleClose}
          >
          
            <Paper className={classes.root}>
              
              <h2 variant="title" id="modal-title">
                {selectedDisc.codigo + " - " + selectedDisc.nome }
              </h2>                                      
              <Divider />              
              <Grid className={classes.container} container spacing={24}>
                {/* Créditos: */}
                <Grid item container className={classes.group} spacing={24}>
                  <Grid item xs={6} sm={3}>                  
                    <h6 className={classes.title}>Créditos Aula:</h6>
                  </Grid>
                  <Grid item xs={6} sm={3}>                  
                    <Paper className={classes.paper}>{selectedDisc.creditosA}</Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>                  
                    <h6 className={classes.title}>Créditos Trabalho:</h6>
                  </Grid>
                  <Grid item xs={6} sm={3}>                  
                    <Paper className={classes.paper}>{selectedDisc.creditosT}</Paper>
                  </Grid>
                </Grid>
                {/* Data: */}
                <Grid item container className={classes.group} spacing={24}>
                  <Grid item xs={6} sm={3}>                  
                    <h6 className={classes.title}>Data de Início:</h6>
                  </Grid>
                  <Grid item xs={6} sm={3}>                  
                    <Paper className={classes.paper}>{selectedDisc.dataIni}</Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>                  
                    <h6 className={classes.title}>Data de Término</h6>
                  </Grid>
                  <Grid item xs={6} sm={3}>                  
                    <Paper className={classes.paper}>{selectedDisc.dataFim}</Paper>
                  </Grid>
                </Grid>
                {/* Objetivos: */}
                <Grid item container className={classes.group}>
                  <Grid item xs={4} sm={2}>                  
                    <h6 className={classes.title}>Objetivos:</h6>
                  </Grid>
                  <Grid item xs={12} sm={10}>                  
                    <Paper className={classes.field}>
                      {selectedDisc.objetivos ? selectedDisc.objetivos : "-"}
                    </Paper>
                  </Grid>
                </Grid>
                {/* Programa: */}
                <Grid item container className={classes.group}>
                  <Grid item xs={4} sm={2}>                  
                    <h6 className={classes.title}>Programa:</h6>
                  </Grid>
                  <Grid item xs={12} sm={10}>                  
                    <Paper className={classes.field}>
                      {selectedDisc.programa ? selectedDisc.programa : "-"}
                    </Paper>
                  </Grid>
                </Grid>                
              </Grid>                   
              <DetailsModalWrapped />
            </Paper>
          </Modal>
          </MuiThemeProvider>
        </div>
      );  
    } else {
      return <div></div>;
    }

  }
}

DetailsModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const DetailsModalWrapped = withStyles(styles)(DetailsModal);

export default DetailsModalWrapped;