import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import client from 'client';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import NotesModel from 'models/Notes';
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';

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
      <div key={note.id}>
        <p>Date: {note.date}</p>
        <p>Body: {note.body}</p>
      </div>
    ))
  }

  render() {
    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        {this.renderNotes()}
      </LoadingAndErrorHandler>
    );
  }
}

Notes.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  notes: NotesModel.isRequired
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
