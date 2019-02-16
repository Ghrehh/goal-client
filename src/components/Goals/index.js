import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import client from 'client';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import LocalStorage from 'util/LocalStorage'
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import GoalsModel from 'models/Goals';
import AuthContext from 'components/context/Auth';

export const GOALS_QUERY = gql`
  query Goals($auth: AuthInput!){
    goals(auth: $auth) {
      id
      name
      dueDate
      latestCompletion {
        id
        completedAt
      }
    }
  }
`;

class Goals extends Component {
  renderGoal(goal) {
    return (
      <div key={goal.id}>
        <p>{goal.name}</p>
        <p>Completed: {String(!!goal.latestCompletion)}</p>
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
        {this.props.goals.map(goal => this.renderGoal(goal))}
      </LoadingAndErrorHandler>
    );
  }
}

Goals.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  goals: GoalsModel.isRequired
}

export { Goals };

class GoalsWrapped extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {auth => (
          <ApolloProvider client={client}>
            <Query query={GOALS_QUERY} variables={{ auth }}>
              {({ data, loading, error }) => {
                if (error) {
                  console.log(error.message)
                }
                return (<Goals
                  loading={loading}
                  error={error}
                  goals={data && data.goals || []}
                />)
              }}
            </Query>
          </ApolloProvider>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default GoalsWrapped;