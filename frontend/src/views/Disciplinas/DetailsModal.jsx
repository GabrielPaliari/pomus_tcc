import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
// import TextField from '@material-ui/core/TextField';
// import Button from 'components/CustomButtons/Button.jsx';
import green from '@material-ui/core/colors/green';

import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  paper: {
    margin: '20px auto',    
    width: 800,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
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
          
            <div className={classes.paper}>
              <h2 variant="title" id="modal-title">
                {selectedDisc.codigo}
              </h2>                                      
              <Divider />
              <div className={classes.container}>
              <Table className={classes.table}>
                <TableHead >
                  <TableRow>
                    <TableCell className={classes.thead}>Coluna</TableCell>
                    <TableCell className={classes.thead}>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {keys.map(key => {
                    if (key !== "preRequisitos") {
                      return (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row">
                            <b>{key}</b>
                          </TableCell>
                          <TableCell>{selectedDisc[key]}</TableCell>
                          </TableRow>
                      );                      
                    } else {
                      return (
                        <TableRow key={key}>
                          <TableCell component="th" scope="row">
                            <b>{key}</b>
                          </TableCell>
                          <TableCell>{preReq.join(", ")}</TableCell>
                          </TableRow>
                      ); 
                    }
                  })}
                </TableBody>
              </Table>           
              </div>
              <DetailsModalWrapped />
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

DetailsModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const DetailsModalWrapped = withStyles(styles)(DetailsModal);

export default DetailsModalWrapped;