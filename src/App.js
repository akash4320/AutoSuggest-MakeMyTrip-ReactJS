import React from "react";
import Autosuggest from "react-autosuggest";
import { Row, Col } from "react-bootstrap";
const axios = require("axios");

const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = (suggestion) => (
  <div style={{
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  boxShadow: '0 4px 16px 0 rgba(0,0,0,.15), 0 1px 2px 0 rgba(0,0,0,.07), 0 0 1px 0 rgba(0,0,0,.2)',
  width:300}}>
    <Row className="justify-content-md-center">
      <Col>{`${suggestion.cityName},${suggestion.cityCountry}`}</Col>
    </Row>
    <Row>
      <Col>{suggestion.airportName}</Col>
    </Row>
  </div>
);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "",
      suggestions: []
    };
  }

  fetchSuggestions=(keySearch)=>{
    axios
      .get(
        `https://voyager.goibibo.com/api/v2/flights_search/find_node_by_name_v2/?limit=15&search_query=${keySearch}&v=2&cc=IN`
      )
      .then((result) => {
        this.setState({suggestions:[] });
        result.data.data.r.map((res)=>{
          if(res.n.toLowerCase().includes(keySearch.toLowerCase()) || res.xtr.cnt_n.toLowerCase().includes(keySearch.toLowerCase())||
          res.xtr.cn.toLowerCase().includes(keySearch.toLowerCase()) )
          {
            const suggest ={airportName:res.n,cityName:res.xtr.cn,cityCountry:res.xtr.cnt_n} 
            const suggestionList =this.state.suggestions;
            this.setState({
              suggestions:[...suggestionList,suggest]
            });
          }
          
      })
    })
      .catch((err) => {
        console.log(err);
        this.setState({suggestions:[]});
      });
  }
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };


  onSuggestionsFetchRequested = ({ value }) => {
    if(value===''){
      this.fetchSuggestions("india");
    }else{
      this.fetchSuggestions(value);
    }
  };

  
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;
    

    const inputProps = {
      placeholder: "Enter City Name",
      value,
      onChange: this.onChange,
    };

    return (
      <>
      <h2>Search the City</h2>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        {this.state.suggestions.length===0?<p>No Suggestions to display</p>:null}
      </>
    );
  }
}

export default App;
