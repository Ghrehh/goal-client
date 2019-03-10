import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import client from 'client';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import GoalModel from 'models/Goal';
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import Completion from 'components/Completion';
import DeleteGoal from 'components/DeleteGoal';
import HeatMap from './HeatMap';
import styles from './styles.module.css';

export const GOAL_QUERY = gql`
  query Goal($auth: AuthInput!, $goalId: Int!){
    goal(auth: $auth, goalId: $goalId) {
      id
      name
      dueDate
      completions {
        id
        completedAt
      }
    }
  }
`;

class Goal extends Component {
  renderGoal() {
    const { goal } = this.props;

    if (!goal) return null;

    return (
      <div className={styles.goal} key={goal.id}>
        <h1 className={styles.title}>{goal.name}</h1>
        <div className={styles.completionContainer}>
          <label htmlFor='completed'>Goal Completed</label>
          <Completion goal={goal} />
        </div>

        <div className={styles.deleteGoalContainer}>
          <DeleteGoal goalId={goal.id} />
        </div>

        <HeatMap completions={goal.completions} />
      </div>
    )
  }

  render() {
    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        {this.renderGoal()}
      </LoadingAndErrorHandler>
    );
  }
}

Goal.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  goal: GoalModel
}

export { Goal };

class GoalWrapped extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {auth => (
          <ApolloProvider client={client}>
            <Query
              query={GOAL_QUERY}
              variables={{
                auth,
                goalId: parseInt(this.props.match.params.goalId, 10)
              }}
            >
              {({ data, loading, error }) => (
                <Goal
                  loading={loading}
                  error={error}
                  goal={data && data.goal}
                />
              )}
            </Query>
          </ApolloProvider>
        )}
      </AuthContext.Consumer>
    );
  }
}


export default GoalWrapped;
