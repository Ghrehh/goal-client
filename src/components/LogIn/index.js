import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import client from 'client';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import LocalStorage from 'util/LocalStorage'
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';

const CREATE_SESSION_MUTATION = gql`
  mutation CreateSession($name: String!, $password: String!) {
    createSession(name: $name, password: $password) {
      user { id }
      token
    }
  }
`;

class LogIn extends Component {
  nameInput = React.createRef();
  passwordInput = React.createRef();

  componentDidUpdate() {
    if (this.props.rememberToken && this.props.userId) {
      this.props.setAuth({
        rememberToken: this.props.rememberToken,
        userId: this.props.userId,
      })
    }
  }

  handleSessionCreation = event => {
    event.preventDefault();

    this.props.createSession({
      variables: {
        name: this.nameInput.current.value,
        password: this.passwordInput.current.value
      }
    });
  }

  render() {
    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        <form>
          <input className='name' ref={this.nameInput}/>
          <input className='password' type="password" ref={this.passwordInput}/>
          <button onClick={this.handleSessionCreation}>Log In</button>
        </form>
      </LoadingAndErrorHandler>
    );
  }
}

LogIn.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  createSession: PropTypes.func.isRequired,
  setAuth: PropTypes.func.isRequired
}

export { LogIn };

class LogInWrapped extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Mutation mutation={CREATE_SESSION_MUTATION}>
          {
            (createSession, { data, loading, error }) => {
              const rememberToken = (
                data &&
                data.createSession &&
                data.createSession.token
              )

              const userId = (
                data &&
                data.createSession &&
                data.createSession.user &&
                data.createSession.user.id
              )

              return (
                <LogIn
                  loading={loading}
                  error={error}
                  setAuth={this.props.setAuth}
                  createSession={createSession}
                  rememberToken={rememberToken}
                  userId={userId}
                />
              )
            }
          }
        </Mutation>
      </ApolloProvider>
    );
  }
}

LogInWrapped.propTypes = {
  setAuth: PropTypes.func.isRequired
}

export default LogInWrapped;
