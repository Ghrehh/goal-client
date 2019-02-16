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
import { GOALS_QUERY } from 'components/Goals';

const CREATE_GOAL_MUTATION = gql`
  mutation CreateGoal($auth: AuthInput!, $goalName: String!){
    createGoal(auth: $auth, goalName: $goalName) {
      goal {
        id
        name
        dueDate
        latestCompletion {
          id
          completedAt
        }
      }
    }
  }
`;

class CreateGoal extends Component {
  nameInput = React.createRef();

  handleGoalCreation = event => {
    event.preventDefault();

    this.props.createGoal({
      variables: {
        goalName: this.nameInput.current.value,
        auth: this.props.auth
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
          <h3>Create Goal</h3>
          <label>
            Name
            <input className='name' ref={this.nameInput}/>
          </label>
          <button onClick={this.handleGoalCreation}>Create Goal</button>
        </form>
      </LoadingAndErrorHandler>
    );
  }
}

CreateGoal.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  auth: AuthModel.isRequired,
  createGoal: PropTypes.func.isRequired,
}

export { CreateGoal };

class CreateGoalWrapped extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {auth => (
          <ApolloProvider client={client}>
            <Mutation
              mutation={CREATE_GOAL_MUTATION}
              update={(cache, { data }) => {
                const { goals } = cache.readQuery({
                  query: GOALS_QUERY,
                  variables: { auth }
                });

                cache.writeQuery({
                  query: GOALS_QUERY,
                  variables: { auth },
                  data: { goals: goals.concat([data.createGoal.goal]) },
                });
              }}
            >
              {
                (createGoal, {loading, error }) => {
                  return (
                    <CreateGoal
                      loading={loading}
                      error={error}
                      createGoal={createGoal}
                      auth={auth}
                    />
                  )
                }
              }
            </Mutation>
          </ApolloProvider>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default CreateGoalWrapped;
