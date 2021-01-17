import React from 'react';
import "./App.css";
import Link from "./components/Link";
import axios from "axios";
import TransactionsContainer from './components/TransactionsContainer'
import { Route, withRouter, Switch } from 'react-router-dom';

class App extends React.Component {

  state = {
    token: null,
    //Add access token
    access_token: null
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

//If link token is successfully created, user can click on button to exchange public token for an access token 
getAccessToken = async (publicToken) => {
  console.log("client side public token", publicToken)
  //sends the public token to the app server
  const res = await axios.post('http://localhost:5000/get_access_token', {publicToken: publicToken})
  const data = res.data.access_token
  //updates state with permanent access token
  this.setState({ access_token: data})
  this.props.history.push("/home")
}

  render(){
    return (
      <>
      <div className="App">
      {this.state.access_token === null ? <Link token={this.state.token} accessToken={this.state.access_token} getAccessToken={this.getAccessToken} /> : 
        <Switch>
          <Route path="/home" render={(routerprops) =><TransactionsContainer accessToken={this.state.access_token} />} />
        </Switch>
      }
      </div>
      </>
    );
  }
}



export default withRouter(App);
