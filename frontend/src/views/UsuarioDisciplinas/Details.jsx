import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
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
    padding: 40
  },
  field: {
    padding: theme.spacing.unit * 1,
  },
  container: {
    padding: 20,
    marginTop: 20,
    maxHeight: "70vh",    
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
  createButton: {
    marginLeft: 260,
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
      const { classes } = this.props;  
      let detailComponent;
      if(this.props.selectedDisc !== null) {
        let selectedDisc = this.props.selectedDisc;
        console.log(selectedDisc);
          detailComponent =  <MuiThemeProvider theme={theme}>     
                            <h3 variant="title" id="modal-title">
                              {selectedDisc.codigo + " - " + selectedDisc.nome }
                            </h3>                                  
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
                        </MuiThemeProvider>
      } else {
          detailComponent = null
      }
      return (
          <div>
              {detailComponent}
          </div>
      )
  }
}

DetailsModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const DetailsModalWrapped = withStyles(styles)(DetailsModal);

export default DetailsModalWrapped;