import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import { Mutation, Query } from "react-apollo";
import { Redirect } from 'react-router';
import gql from "graphql-tag";
import client from 'client';
import { GOAL_QUERY } from 'components/Goal';
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import Button from 'components/Button';
import GoalModel from 'models/Goal';
import styles from './styles.module.css';

const UPDATE_GOAL_MUTATION = gql`
  mutation UpdateGoal($auth: AuthInput!, $name: String!, $id: Int!){
    updateGoal(auth: $auth, name: $name, id: $id) {
      goal {
        id
      }
    }
  }
`;

class EditGoal extends Component {
  state = { name: '' }

  handleGoalUpdate = event => {
    event.preventDefault();
    this.props.updateGoal(this.state.name);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.goal && state.name === '') {
      return { name: props.goal.name }
    }

    return null;
  }

  render() {
    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        <form className={styles.editGoal}>
          <h1 className={styles.title}>Update Goal</h1>
          <div className={styles.inputContainer}>
            <label htmlFor='name-input'>
              Name
            </label>

            <input
              autoFocus
              className='name'
              value={this.state.name}
              onChange={({ target }) => this.setState({ name: target.value })}
              name='name'
            />
          </div>

          <Button
            onClick={this.handleGoalUpdate}
            className={styles.button}
          >
            Update Goal
          </Button>
        </form>
      </LoadingAndErrorHandler>
    );
  }
}

EditGoal.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  updateGoal: PropTypes.func.isRequired,
  goal: GoalModel
}

export { EditGoal };

export default class EditGoalWrapped extends Component {
  render() {
    const id = parseInt(this.props.match.params.goalId, 10);

    return (
      <AuthContext.Consumer>
        {auth => (
          <ApolloProvider client={client}>
            <Query
              query={GOAL_QUERY}
              variables={{ auth, goalId: id }}
            >
              {({ data, loading, error }) => (
                <Mutation
                  mutation={UPDATE_GOAL_MUTATION}
                  refetchQueries={[
                    {
                      query: GOAL_QUERY,
                      variables: { auth, goalId: id }
                    }
                  ]}
                >
                  {
                    (updateGoal, {loading, error, called }) => {
                      if (called && loading) return <Redirect push to={`/goals/${id}`} />
                      const wrappedUpdateGoal = (name) => 
                        updateGoal({ variables: { id, name, auth } });

                      return (
                        <EditGoal
                          loading={loading}
                          error={error}
                          updateGoal={wrappedUpdateGoal}
                          goal={data && data.goal}
                        />
                      )
                    }
                  }
                </Mutation>
              )}
            </Query>
          </ApolloProvider>
        )}
      </AuthContext.Consumer>
    );
  }
}
