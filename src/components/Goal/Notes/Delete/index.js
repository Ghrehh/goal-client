import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import client from 'client';
import { NOTES_QUERY } from 'components/Goal/Notes';
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import AuthModel from 'models/Auth';
import { Redirect } from 'react-router';
import Button from 'components/Button';
import styles from './styles.module.css';

const DELETE_NOTE_MUTATION = gql`
  mutation DeleteNote($auth: AuthInput!, $noteId: Int!){
    deleteNote(auth: $auth, noteId: $noteId) {
      goal {
        id
      }
    }
  }

`;

class Delete extends Component {
  handleDelete = () => {
    this.props.deleteNote({
      variables: {
        auth: this.props.auth,
        noteId: this.props.noteId
      }
    });
  }

  render() {
    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        <Button
          onClick={this.handleDelete}
          className={styles.button}
        >
          Delete
        </Button>
      </LoadingAndErrorHandler>
    );
  }
}

Delete.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  noteId: PropTypes.number.isRequired,
  auth: AuthModel.isRequired,
  deleteNote: PropTypes.func.isRequired,
}

export { Delete };

class DeleteWrapped extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {auth => (
          <ApolloProvider client={client}>
            <Mutation
              mutation={DELETE_NOTE_MUTATION}
              refetchQueries={[
                {
                  query: NOTES_QUERY,
                  variables: {
                    auth,
                    goalId: this.props.goalId
                  }
                }
              ]}
            >
              {(deleteNote, { loading, error, called }) => (
                <Delete
                  loading={loading}
                  error={error}
                  auth={auth}
                  noteId={this.props.noteId}
                  deleteNote={deleteNote}
                />
              )}
            </Mutation>
          </ApolloProvider>
        )}
      </AuthContext.Consumer>
    );
  }
}

DeleteWrapped.propTypes = {
  noteId: PropTypes.number.isRequired,
  goalId: PropTypes.number.isRequired
}

export default DeleteWrapped;
