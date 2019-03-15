import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import client from 'client';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import NotesModel from 'models/Notes';
import DeleteNote from 'components/Goal/Notes/Delete';
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import styles from './styles.module.css';

export const NOTES_QUERY = gql`
  query Notes($auth: AuthInput!, $goalId: Int!){
    notes(auth: $auth, goalId: $goalId) {
      id
      date
      body
    }
  }
`;

class Notes extends Component {
  renderNotes() {
    return this.props.notes.map(note => (
      <div key={note.id} className={styles.note}>
        <div className={styles.noteHeader}>
          <p className={styles.date}>{note.date}</p>
          <DeleteNote noteId={note.id} goalId={this.props.goalId}/>
        </div>
        <p className={styles.body}>{note.body}</p>
      </div>
    ))
  }

  render() {
    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        <div className={styles.notes}>
          <h2 className={styles.header}>Notes</h2>
          {this.renderNotes()}
        </div>
      </LoadingAndErrorHandler>
    );
  }
}

Notes.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  notes: NotesModel.isRequired,
  goalId: PropTypes.number.isRequired
}

export { Notes };

class NotesWrapped extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {auth => (
          <ApolloProvider client={client}>
            <Query
              query={NOTES_QUERY}
              variables={{
                auth,
                goalId: this.props.goalId
              }}
            >
              {({ data, loading, error }) => (
                <Notes
                  loading={loading}
                  error={error}
                  notes={(data && data.notes) || []}
                  goalId={this.props.goalId}
                />
              )}
            </Query>
          </ApolloProvider>
        )}
      </AuthContext.Consumer>
    );
  }
}

NotesWrapped.propTypes = {
  goalId: PropTypes.number.isRequired
}

export default NotesWrapped;
