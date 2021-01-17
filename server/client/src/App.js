import React from 'react';
import "./App.css";
import Link from "./components/Link";
import axios from "axios";
import TransactionsContainer from './components/TransactionsContainer'
import { Route, withRouter, Switch } from 'react-router-dom';

class App extends React.Component {

  state = {
    token: null
  }

//Grabs temporary Link token generated from server and updates state with it client side
createLinkToken = async () => {
const res = await axios.post('http://localhost:5000/create_link_token');
const data = res.data.link_token
this.setState({ token: data })
}

//Ensures above action runs upon page load
componentDidMount(){
this.createLinkToken()
}  

  render(){
    return (
      <>
      <div className="App">
        <Link/>
      </div>
      </>
    );
  }
}



export default withRouter(App);
