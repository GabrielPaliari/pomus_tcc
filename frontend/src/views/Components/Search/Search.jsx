import React from "react";

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';

import GridContainer from "components/Grid/GridContainer.jsx";
import AuthService from "views/Components/AuthService.jsx";

import DiscList from "views/Components/Search/DiscList.jsx";
import TopicList from "views/Components/Search/TopicList.jsx";
import CommentList from "views/Components/Search/CommentList.jsx";
import RespList from "views/Components/Search/RespList.jsx";

import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiThemeProvider } from "@material-ui/core";
import { FormControl } from "material-ui";

const API = 'http://ec2-18-231-198-111.sa-east-1.compute.amazonaws.com:8000/api/';
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
      filter: 'all',   
      hasSearched: false     
    };
    this.Auth = new AuthService();
  }
  
  handleInputChange = (event) => {
    const value = event.target.value;
 
    this.setState({
      searchString: value
    });   
  }

  handleSelect = (event) => {
    const value = event.target.value;
    this.setState({
      filter: value
    });   
  }
  
  _handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.search();
    }  
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
      this.setState({
        disciplinas: [],          
        topicos: [],          
        comentarios: [],          
        respostas: [], 
      })
      Promise.all([discRequest,topicRequest, comentRequest, respRequest]).then((values) => {
          console.log(values);
          searchResults["disciplinas"] = values[0];
          searchResults["topicos"] = values[1];
          searchResults["comentarios"] = values[2];
          searchResults["respostas"] = values[3];

          console.log(searchResults);
          this.setState(searchResults);
          this.setState({hasSearched: true});
          
          return searchResults;
      });
    }
  }

  render() {       
    console.log(this.state);
    const filter = this.state.filter;
    const discList = this.state.disciplinas.length > 0 && (filter === 'all' || filter === 'disc')  
                     ? <DiscList disciplinas={this.state.disciplinas}></DiscList> 
                     : '';
    const topicList = this.state.topicos.length > 0 && (filter === 'all' || filter === 'topic')
                     ? <TopicList topicos={this.state.topicos}></TopicList> 
                     : '';
    const commentList = this.state.comentarios.length > 0 && (filter === 'all' || filter === 'comment')
                     ? <CommentList comentarios={this.state.comentarios}></CommentList> 
                     : '';
    const respList = this.state.respostas.length > 0 && (filter === 'all' || filter === 'resp')
                     ? <RespList respostas={this.state.respostas}></RespList> 
                     : '';
    let emptyResults = (discList + topicList + commentList + respList) === ''; 
    const emptyMessage = emptyResults && this.state.hasSearched
                 ? <h4 style={{margin: 64, textAlign: 'center'}}>Nenhum resultado encontrado</h4>
                 : '';    
         
      return (             
      <div>        
        <GridContainer direction="column" className="DiscContainer">                  
          <h3>Busca</h3> 
          <div style={{margin: '24px auto'}}>
            <TextField
              name="search"
              label="Busca"
              placeholder="Busque por uma disciplina"
              className="searchField"            
              onChange={this.handleInputChange}
              onKeyPress={this._handleKeyPress}
            />
            <FormControl 
              style={{
                  width: 200,
                  margin: '16px 24px'
                }}>
              <InputLabel htmlFor="search-filter">Filtrar Busca</InputLabel>
              <Select
                value={this.state.filter}
                onChange={this.handleSelect}
                inputProps={{
                  name: 'filtro', 
                  id: 'search-filter'
                }}
              >
                <MenuItem value={'all'}>Tudo</MenuItem>
                <MenuItem value={'disc'}>Disciplinas</MenuItem>
                <MenuItem value={'topic'}>Tópicos</MenuItem>
                <MenuItem value={'comment'}>Comentários</MenuItem>
                <MenuItem value={'resp'}>Respostas</MenuItem>
              </Select>
            </FormControl>
            <IconButton className="searchButton" onClick={this.search}><SearchIcon /></IconButton>          
          </div>
          <Divider className="TopDivider"/>                            
        </GridContainer>            
        {discList}                
        {topicList}                
        {commentList}                
        {respList} 
        {emptyMessage}               
      </div>                                   
      );
    }
}

export default (Search);
