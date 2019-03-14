import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import { Mutation } from "react-apollo";
import { Redirect } from 'react-router';
import { NOTES_QUERY } from 'components/Goal/Notes';
import gql from "graphql-tag";
import client from 'client';
import AuthModel from 'models/Auth';
import AuthContext from 'components/context/Auth';
import SelectedDateContext from "components/context/SelectedDate";
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import Button from 'components/Button';
import styles from './styles.module.css';

const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote(
    $auth: AuthInput!
    $goalId: Int!
    $date: ISO8601DateTime!
    $body: String!
  ) {
    createNote(
      auth: $auth,
      goalId: $goalId,
      date: $date,
      body: $body
    ) {
      goal {
        id
        notes {
          id
          date
          body
        }
      }
    }
  }
`;

class NewNote extends Component {
  bodyInput = React.createRef();

  handleNoteCreation = event => {
    event.preventDefault();

    this.props.createNote({
      variables: {
        goalId: this.props.goalId,
        auth: this.props.auth,
        body: this.bodyInput.current.value,
        date: this.props.selectedDate
      }
    });
  }

  render() {
    if (this.props.called && !this.props.loading) {
      return <Redirect push to={`/goals/${this.props.goalId}`} />
    }

    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        <form className={styles.newNote}>
          <h1 className={styles.title}>Create Note</h1>

          <textarea
            className={styles.bodyField}
            ref={this.bodyInput}
            name='note-content'
          />

          <Button
            onClick={this.handleNoteCreation}
            className={styles.button}
          >
            Create Note
          </Button>
        </form>
      </LoadingAndErrorHandler>
    );
  }
}

NewNote.propTypes = {
  loading: PropTypes.bool.isRequired,
  called: PropTypes.bool.isRequired,
  error: PropTypes.object,
  auth: AuthModel.isRequired,
  createNote: PropTypes.func.isRequired,
  goalId: PropTypes.number.isRequired,
  selectedDate: PropTypes.string.isRequired
}

export { NewNote };

class NewNoteWrapped extends Component {
  render() {
    return (
      <SelectedDateContext.Consumer>
        {selectedDate => (
          <AuthContext.Consumer>
            {auth => (
              <ApolloProvider client={client}>
                <Mutation
                  mutation={CREATE_NOTE_MUTATION}
                  refetchQueries={[
                    {
                      query: NOTES_QUERY,
                      variables: {
                        auth,
                        goalId: parseInt(this.props.match.params.goalId, 10)
                      }
                    }
                  ]}
                >
                  {
                    (createNote, {loading, error, called }) => {
                      return (
                        <NewNote
                          loading={loading}
                          error={error}
                          createNote={createNote}
                          auth={auth}
                          called={called}
                          goalId={parseInt(this.props.match.params.goalId, 10)}
                          selectedDate={selectedDate}
                        />
                      )
                    }
                  }
                </Mutation>
              </ApolloProvider>
            )}
          </AuthContext.Consumer>
        )}
      </SelectedDateContext.Consumer>
    );
  }
}

export default NewNoteWrapped;
