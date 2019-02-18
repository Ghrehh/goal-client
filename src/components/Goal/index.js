import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import client from 'client';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import GoalModel from 'models/Goal';
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';

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
      <div key={goal.id}>
        <h3>{goal.name}</h3>
        <br />
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
    console.log(this.props)
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
