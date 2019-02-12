import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";
import client from './client';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import LocalStorage from 'util/LocalStorage'
import './App.css';

export const GOALS_QUERY = gql`
  query Goals($auth: AuthInput!){
    goals(auth: $auth) {
      id
      name
      dueDate
    }
  }
`;

export const CREATE_SESSION_MUTATION = gql`
  mutation CreateSession($name: String!, $password: String!) {
    createSession(name: $name, password: $password) {
      user { id }
      token
    }
  }
`;

const loadingStates = (renderFunction) => {
  return props => {
    if (props.loading) return <p>Loading...</p>;
    if (props.error) return <p>Error :(</p>;

    return renderFunction(props)
  }
}

class App extends Component {
  state = {}

  nameInput = React.createRef();
  passwordInput = React.createRef();

  componentDidMount() {
    const rememberToken = LocalStorage.getItem('rememberToken')
    const userId = LocalStorage.getItem('userId')

    if (rememberToken && userId) this.setState({ rememberToken, userId })
  }

  render() {
    if (this.state.rememberToken) {
      return (
        <div>
          <p>{this.state.rememberToken}</p>
          <p>{this.state.userId}</p>

          <ApolloProvider client={client}>
            <Query query={GOALS_QUERY} variables={{ auth: { rememberToken: this.state.rememberToken, userId: parseInt(this.state.userId) } }}>
              {({ data, loading, error }) => {
                if (loading) return <p>LOADING</p>;
                if (error) return <p>ERROR</p>;
                console.log(data)
              }}
            </Query>
          </ApolloProvider>
        </div>
      )
    }

    return (
      <ApolloProvider client={client}>
        <Mutation mutation={CREATE_SESSION_MUTATION}>
          {
            (createSession, { data }) => {
              if (data) {
                this.setState({
                  rememberToken: data.createSession.token,
                  userId: data.createSession.user.id,
                })

                LocalStorage.setItem('rememberToken', data.createSession.token)
                LocalStorage.setItem('userId', data.createSession.user.id)
              }

              return (
                <div>
                  <form
                    onSubmit={
                      event => {
                        event.preventDefault();

                        createSession({
                          variables: {
                            name: this.nameInput.current.value,
                            password: this.passwordInput.current.value
                          }
                        });

                        this.nameInput.current.value = "";
                        this.passwordInput.current.value = "";
                      }
                    }
                  >
                    <input ref={this.nameInput}/>
                    <input ref={this.passwordInput}/>
                    <button type="submit">Log In</button>
                  </form>
                </div>
              )
            }
          }
        </Mutation>
      </ApolloProvider>
    );
  }
}

export default App;
