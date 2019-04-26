import React, { Component } from "react";
import PropTypes from "prop-types";
import { ApolloProvider } from "react-apollo";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import client from "client";
import AuthContext from "components/context/Auth";
import SelectedDateContext from "components/context/SelectedDate";
import Button from "components/Button";
import LoadingAndErrorHandler from "components/LoadingAndErrorHandler";
import AuthModel from "models/Auth";
import GoalModel, { goalCompletionForDate } from "models/Goal";
import Tick from './Tick';
import styles from "./styles.module.css";

const CREATE_COMPLETION_MUTATION = gql`
  mutation CreateCompletion(
    $auth: AuthInput!
    $goalId: Int!
    $completedAt: ISO8601DateTime!
  ) {
    createCompletion(auth: $auth, goalId: $goalId, completedAt: $completedAt) {
      goals {
        id
        completions {
          completedAt
          id
        }
      }
    }
  }
`;

const DELETE_COMPLETION_MUTATION = gql`
  mutation DeleteCompletion($auth: AuthInput!, $completionId: Int!) {
    deleteCompletion(auth: $auth, completionId: $completionId) {
      goals {
        id
        completions {
          id
        }
      }
    }
  }
`;

export class Completion extends Component {
  completion = () =>
    goalCompletionForDate({
      goal: this.props.goal,
      dateString: this.props.selectedDate
    });

  checked = () => !!this.completion();

  toggle = event => {
    event.preventDefault();

    if (!this.checked()) {
      return this.props.createCompletion({
        variables: {
          auth: this.props.auth,
          completedAt: new Date(this.props.selectedDate).toISOString(),
          goalId: this.props.goal.id
        }
      });
    }

    this.props.deleteCompletion({
      variables: {
        auth: this.props.auth,
        completionId: this.completion().id
      }
    });
  };

  renderTickBox = () => (
    <React.Fragment>
      <input
        name="completed"
        type="checkbox"
        onChange={this.toggle}
        checked={this.checked()}
      />
      <Tick checked={this.checked()} />
    </React.Fragment>
  )

  renderButton = () => (
    <React.Fragment>
      <Button className={styles.button}>
        <p className={styles.buttonText}> {this.checked() ? 'Uncomplete Goal' : 'Complete Goal' }
        </p>

        <Tick checked={this.checked()} />
      </Button>
    </React.Fragment>
  )

  render() {
    const tickBoxStyles = `
      ${styles.tickBox}
      ${!this.checked() && this.props.button && styles.hideTick}
      ${this.props.className}
    `
    return (
      <LoadingAndErrorHandler
        loading={false}
        error={this.props.error}
      >
        <div
          className={tickBoxStyles}
          onClick={this.toggle}
        >
          {this.props.button ? this.renderButton() : this.renderTickBox()}
        </div>
      </LoadingAndErrorHandler>
    );
  }
}

Completion.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  auth: AuthModel.isRequired,
  createCompletion: PropTypes.func.isRequired,
  goal: GoalModel.isRequired,
  selectedDate: PropTypes.string.isRequired,
  button: PropTypes.bool,
  className: PropTypes.string
};

Completion.defaultProps = {
  button: false
}

export default class CompletionWrapped extends Component {
  render() {
    return (
      <SelectedDateContext.Consumer>
        {selectedDate => (
          <AuthContext.Consumer>
            {auth => (
              <ApolloProvider client={client}>
                <Mutation mutation={CREATE_COMPLETION_MUTATION}>
                  {(createCompletion, create) => (
                    <Mutation mutation={DELETE_COMPLETION_MUTATION}>
                      {(deleteCompletion, remove) => (
                        <Completion
                          loading={create.loading || remove.loading}
                          error={create.error || remove.error}
                          createCompletion={createCompletion}
                          deleteCompletion={deleteCompletion}
                          auth={auth}
                          goal={this.props.goal}
                          selectedDate={selectedDate}
                          button={this.props.button}
                          className={this.props.className}
                        />
                      )}
                    </Mutation>
                  )}
                </Mutation>
              </ApolloProvider>
            )}
          </AuthContext.Consumer>
        )}
      </SelectedDateContext.Consumer>
    );
  }
}

CompletionWrapped.propTypes = {
  goal: GoalModel,
  button: PropTypes.bool,
  className: PropTypes.string
};
