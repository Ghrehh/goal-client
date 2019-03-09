import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import { Mutation } from "react-apollo";
import { Redirect } from 'react-router';
import gql from "graphql-tag";
import client from 'client';
import AuthModel from 'models/Auth';
import { GOALS_QUERY } from 'components/Goals';
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import Button from 'components/Button';
import styles from './styles.module.css';

const CREATE_GOAL_MUTATION = gql`
  mutation CreateGoal($auth: AuthInput!, $goalName: String!){
    createGoal(auth: $auth, goalName: $goalName) {
      goal {
        id
        name
        dueDate
        completions {
          id
          completedAt
        }
      }
    }
  }
`;

class NewGoal extends Component {
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
    if (this.props.called && !this.props.loading) {
      return <Redirect push to="/" />
    }

    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        <form className={styles.newGoal}>
          <h1 className={styles.title}>Create Goal</h1>
          <div className={styles.inputContainer}>
            <label htmlFor='name-input'>
              Name
            </label>

            <input
              className='name'
              ref={this.nameInput}
              name='name-input'
            />
          </div>

          <Button
            onClick={this.handleGoalCreation}
            className={styles.button}
          >
            Create Goal
          </Button>
        </form>
      </LoadingAndErrorHandler>
    );
  }
}

NewGoal.propTypes = {
  loading: PropTypes.bool.isRequired,
  called: PropTypes.bool.isRequired,
  error: PropTypes.object,
  auth: AuthModel.isRequired,
  createGoal: PropTypes.func.isRequired,
}

export { NewGoal };

class NewGoalWrapped extends Component {
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
                (createGoal, {loading, error, called }) => {
                  return (
                    <NewGoal
                      loading={loading}
                      error={error}
                      createGoal={createGoal}
                      auth={auth}
                      called={called}
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

export default NewGoalWrapped;
