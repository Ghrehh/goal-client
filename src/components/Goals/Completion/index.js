import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import client from 'client';
import LocalStorage from 'util/LocalStorage'
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import AuthModel from 'models/Auth';
import GoalModel from 'models/Goal';
import { GOALS_QUERY } from 'components/Goals';

const CREATE_COMPLETION_MUTATION = gql`
  mutation CreateCompletion(
    $auth: AuthInput!,
    $goalId: Int!,
    $completedAt: ISO8601DateTime!
  ){
    createCompletion(auth: $auth, goalId: $goalId, completedAt: $completedAt) {
      completion {
        id
        completedAt
      }
    }
  }
`;

const DELETE_COMPLETION_MUTATION = gql`
  mutation DeleteCompletion($auth: AuthInput!, $completionId: Int!){
    deleteCompletion(auth: $auth, completionId: $completionId) {
      goals {
        id
        latestCompletion {
          id
        }
      }
    }
  }
`;

class Completion extends Component {
  toggle = () => {
    this.props.createCompletion({
      variables: {
        auth: this.props.auth,
        completedAt: new Date().toISOString(),
        goalId: this.props.goal.id
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
          <label>
            Completed:
            <input
              name="completed"
              type="checkbox"
              checked={!!this.props.goal.latestCompletion}
              onChange={this.toggle}
            />
          </label>
        </form>
      </LoadingAndErrorHandler>
    );
  }
}

Completion.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  auth: AuthModel.isRequired,
  createCompletion: PropTypes.func.isRequired,
  goal: GoalModel.isRequired
}

export { Completion };

class CompletionWrapped extends Component {
  updateCreateCompletion = ({ cache, completion, auth }) => {
    const { goals } = cache.readQuery({
      query: GOALS_QUERY,
      variables: { auth }
    });

    goals.forEach((goal, index) => {
      if (goal.id == this.props.goal.id) {
        goals[index].latestCompletion = completion
      }
    });

    cache.writeQuery({
      query: GOALS_QUERY,
      variables: { auth },
      data: { goals },
    });
  }

  render() {
    return (
      <AuthContext.Consumer>
        {auth => (
          <ApolloProvider client={client}>
            <Mutation
              mutation={CREATE_COMPLETION_MUTATION}
              update={
                (cache, { data }) => this.updateCreateCompletion({
                  cache,
                  completion: data.createCompletion.completion,
                  auth
                })
              }
            >
              {
                (createCompletion, create) => (
                  <Completion
                    loading={create.loading}
                    error={create.error}
                    createCompletion={createCompletion}
                    auth={auth}
                    goal={this.props.goal}
                  />
                )
              }
            </Mutation>
          </ApolloProvider>
        )}
      </AuthContext.Consumer>
    );
  }
}

CompletionWrapped.propTypes = {
  goal: GoalModel
}

export default CompletionWrapped;
