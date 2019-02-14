import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";
import client from './client';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import LocalStorage from 'util/LocalStorage';
import LogIn from 'components/LogIn';
import Goals from 'components/Goals';
import AuthContext from 'components/context/Auth';

export const GOALS_QUERY = gql`
  query Goals($auth: AuthInput!){
    goals(auth: $auth) {
      id
      name
      dueDate
    }
  }
`;

class App extends Component {
  state = {}

  componentDidMount() {
    const rememberToken = LocalStorage.getItem('rememberToken')
    const userId = LocalStorage.getItem('userId')

    if (rememberToken && userId) this.setState({ rememberToken, userId })
  }

  setAuth = ({ rememberToken, userId }) => {
    this.setState({ rememberToken, userId })

    LocalStorage.setItem('rememberToken', rememberToken)
    LocalStorage.setItem('userId', userId)
  }

  auth = () => ({
    rememberToken: this.state.rememberToken,
    userId: parseInt(this.state.userId, 10)
  })

  render() {
    if (this.state.rememberToken && this.state.userId) {
      return (
        <AuthContext.Provider value={this.auth()}>
          <Goals />
        </AuthContext.Provider>
      )
    }

    return <LogIn setAuth={this.setAuth} />
  }
}

export default App;
