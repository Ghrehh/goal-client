import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import client from 'client';
import { GOALS_QUERY } from 'components/Goals';
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import AuthModel from 'models/Auth';

const DELETE_GOAL_MUTATION = gql`
  mutation DeleteGoal($auth: AuthInput!, $goalId: Int!){
    deleteGoal(auth: $auth, goalId: $goalId) {
      goals {
        id
      }
    }
  }
`;

class Delete extends Component {
  handleDelete = () => {
    this.props.deleteGoal({
      variables: {
        auth: this.props.auth,
        goalId: this.props.goalId
      }
    });
  }

  render() {
    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        <button onClick={this.handleDelete}>Delete</button>
      </LoadingAndErrorHandler>
    );
  }
}

Delete.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  goalId: PropTypes.number.isRequired,
  auth: AuthModel.isRequired,
  deleteGoal: PropTypes.func.isRequired,
}

export { Delete };

class DeleteWrapped extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {auth => (
          <ApolloProvider client={client}>
            <Mutation
              mutation={DELETE_GOAL_MUTATION}
              update={(cache, { data }) => {
                cache.writeQuery({
                  query: GOALS_QUERY,
                  variables: { auth },
                  data: { goals: data.deleteGoal.goals },
                });
              }}
            >
              {(deleteGoal, { loading, error }) => (
                <Delete
                  loading={loading}
                  error={error}
                  auth={auth}
                  goalId={this.props.goalId}
                  deleteGoal={deleteGoal}
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
  goalId: PropTypes.number.isRequired
}

export default DeleteWrapped;
