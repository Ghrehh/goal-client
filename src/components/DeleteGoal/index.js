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
import { Redirect } from 'react-router';
import Button from 'components/Button';
import ConfirmationModal from 'components/modals/Confirmation';
import styles from './styles.module.css';

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
  state = {
    modalOpen: false
  }

  handleDelete = () => {
    this.props.deleteGoal({
      variables: {
        auth: this.props.auth,
        goalId: this.props.goalId
      }
    });
  }

  renderConfirmationModal = () => {
    if (!this.state.modalOpen) return null;

    return (
      <ConfirmationModal
        text='Are you sure want to delete this goal?'
        onConfirm={this.handleDelete}
        onCancel={() => this.setState({ modalOpen: false })}
      />
    )
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
        <Button
          onClick={() => this.setState({ modalOpen: true })}
          className={styles.button}
        >
          Delete Goal
        </Button>

        {this.renderConfirmationModal()}
      </LoadingAndErrorHandler>
    );
  }
}

Delete.propTypes = {
  called: PropTypes.bool.isRequired,
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
              {(deleteGoal, { loading, error, called }) => (
                <Delete
                  called={called}
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
