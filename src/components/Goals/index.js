import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import { Link } from 'react-router-dom'
import client from 'client';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import GoalsModel from 'models/Goals';
import AuthContext from 'components/context/Auth';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import Completion from 'components/Completion';
import styles from './styles.module.css';

export const GOALS_QUERY = gql`
  query Goals($auth: AuthInput!){
    goals(auth: $auth) {
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

class Goals extends Component {
  renderGoal(goal) {
    return (
      <Link to={`goals/${goal.id}`} key={goal.id} className={styles.goal}>
        <h3 className={styles.goalName}>{goal.name}</h3>
        <div className={styles.completionContainer}>
          <Completion goal={goal} />
        </div>
      </Link>
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
              {({ data, loading, error }) => (
                <Goals
                  loading={loading}
                  error={error}
                  goals={(data && data.goals) || []}
                />
              )}
            </Query>
          </ApolloProvider>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default GoalsWrapped;
