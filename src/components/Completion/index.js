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

class Completion extends Component {
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

  get tickCoverClass() {
    return (
      `
        ${styles.box}
        ${styles.tickCover}
        ${this.checked() && styles.tickCoverChecked}
      `
    );
  }

  renderTick = () => (
    <svg
      width="630px"
      height="630px"
      viewBox="0 0 630 630"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <rect
          className={styles.box}
          fill="#8D5687"
          x="0"
          y="0"
          width="630"
          height="630"
          rx="8"
        />
        <polyline
          className={styles.tick}
          stroke="none"
          strokeWidth="100"
          points="109 293.646424 229.186565 440 529 152"
        />
        <rect
          className={this.tickCoverClass}
          fill="#8D5687"
          x="0"
          y="0"
          width="630"
          height="630"
          rx="8"
        />
      </g>
    </svg>
  )

  renderTickBox = () => (
    <React.Fragment>
      <input
        name="completed"
        type="checkbox"
        onChange={this.toggle}
        checked={this.checked()}
      />
      {this.renderTick()}
    </React.Fragment>
  )

  renderButton = () => (
    <React.Fragment>
      <Button className={styles.button}>
        <p className={styles.buttonText}>
          {this.checked() ? 'Uncomplete Goal' : 'Complete Goal' }
        </p>

        {this.renderTick()}
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

export { Completion };

class CompletionWrapped extends Component {
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

export default CompletionWrapped;
