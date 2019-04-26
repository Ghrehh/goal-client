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
  renderTickBox = () => (
    <React.Fragment>
      <input
        name="completed"
        type="checkbox"
        checked={this.props.checked}
        onChange={this.props.onClick}
      />
      <Tick checked={this.props.checked} />
    </React.Fragment>
  )

  renderButton = () => (
    <Button className={styles.button}>
      <p className={styles.buttonText}>
        {this.props.checked ? 'Uncomplete Goal' : 'Complete Goal' }
      </p>

      <Tick checked={this.props.checked} />
    </Button>
  )

  render() {
    return (
      <LoadingAndErrorHandler
        loading={false}
        error={this.props.error}
      >
        <div
          className={`${styles.tickBox} ${this.props.className}`}
          onClick={this.props.loading ? () => {} : this.props.onClick}
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
  onClick: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
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
                  {(createCompletion, createPayload) => (
                    <Mutation mutation={DELETE_COMPLETION_MUTATION}>
                      {(deleteCompletion, deletePayload) => {
                        const completion = goalCompletionForDate({
                          goal: this.props.goal,
                          dateString: selectedDate
                        });

                        const checked = !!completion;

                        const create = event => {
                          event.preventDefault();

                          createCompletion({
                            variables: {
                              auth,
                              completedAt: new Date(selectedDate).toISOString(),
                              goalId: this.props.goal.id
                            }
                          });
                        };

                        const remove = event => {
                          event.preventDefault();

                          deleteCompletion({
                            variables: {
                              auth,
                              completionId: completion.id
                            }
                          });
                        };

                        return (
                          <Completion
                            loading={createPayload.loading || deletePayload.loading}
                            error={createPayload.error || deletePayload.error}
                            onClick={checked ? remove : create }
                            checked={checked}
                            button={this.props.button}
                            className={this.props.className}
                          />
                        )
                      }}
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
