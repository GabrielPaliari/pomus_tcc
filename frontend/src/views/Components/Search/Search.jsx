import React from "react";

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';

import GridContainer from "components/Grid/GridContainer.jsx";
import AuthService from "views/Components/AuthService.jsx";

import DiscList from "views/Components/Search/DiscList.jsx";

const API = 'http://localhost:8000/api/';
const SEARCH_PREFIX = '?search=';

const DISC = 'disciplinas/';
const TOPIC = 'topicos/';
const COMENT = 'comentarios/';
const RESP = 'respostas/';

class Search extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      searchString: '',
      disciplinas: [],          
      topicos: [],          
      comentarios: [],          
      respostas: [],          
    };
    this.Auth = new AuthService();
  }
  
  handleInputChange = (event) => {
    const value = event.target.value;
 
    this.setState({
      searchString: value
    });   
  }

  search = () => {
    const searchString = this.state.searchString;
    
    const discUrl = API + DISC + SEARCH_PREFIX + searchString;
    const topicUrl = API + TOPIC + SEARCH_PREFIX + searchString;
    const comentUrl = API + COMENT + SEARCH_PREFIX + searchString;
    const respUrl = API + RESP + SEARCH_PREFIX + searchString;

    
    if (!this.Auth.loggedIn()) {
      this.props.history.replace('/login')
    }
    else {
      const headers = {
        headers: {
          'Authorization': 'Bearer ' + this.Auth.getToken()
        }
      };
      // create the requests and then call Promise.all to resolve all the promises in parallel
      const discRequest = fetch(discUrl, headers).then(response => {
        return response.json()
      });
      
      const topicRequest = fetch(topicUrl, headers).then(response => {
        return response.json()
      });
      
      const comentRequest = fetch(comentUrl, headers).then(response => {
        return response.json()
      });
      
      const respRequest = fetch(respUrl, headers).then(response => {
        return response.json()
      });

      let searchResults = {
        "disciplinas":{},
        "topicos":{},
        "comentarios":{},
        "respostas":{}        
      };
      Promise.all([discRequest,topicRequest, comentRequest, respRequest]).then((values) => {
          console.log(values)
          searchResults["disciplinas"] = values[0];
          searchResults["topicos"] = values[1];
          searchResults["comentarios"] = values[2];
          searchResults["respostas"] = values[3];

          console.log(searchResults);
          this.setState(searchResults);
          
          return searchResults;
      });
    }
  }

  render() {       
    console.log(this.state);
    const discList = this.state.disciplinas.length > 0 ?
      <DiscList disciplinas={this.state.disciplinas}></DiscList> : '';
         
      return (             
      <div>        
        <GridContainer direction="column" className="DiscContainer">                  
          <h3>Busca</h3> 
          <TextField
            name="search"
            label="Busca"
            placeholder="Busque por uma disciplina"
            className="searchField"            
            onChange={this.handleInputChange}
          />
          <IconButton className="searchButton" onClick={this.search}><SearchIcon /></IconButton>          
          <Divider className="TopDivider"/>                            
        </GridContainer>            
        {discList}                
      </div>                                   
      );
    }
}

export default (Search);
