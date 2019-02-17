import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from "react-apollo";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import client from 'client';
import LocalStorage from 'util/LocalStorage'
import AuthContext from 'components/context/Auth';
import SelectedDateContext from 'components/context/SelectedDate';
import LoadingAndErrorHandler from 'components/LoadingAndErrorHandler';
import AuthModel from 'models/Auth';
import GoalModel, { goalCompletionForDate } from 'models/Goal';

const CREATE_COMPLETION_MUTATION = gql`
  mutation CreateCompletion(
    $auth: AuthInput!,
    $goalId: Int!,
    $completedAt: ISO8601DateTime!
  ){
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
  mutation DeleteCompletion($auth: AuthInput!, $completionId: Int!){
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
  completion = () => goalCompletionForDate({
    goal: this.props.goal, 
    dateString: this.props.selectedDate
  })

  checked = () => !!this.completion()

  toggle = () => {
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
  }

  render() {
    return (
      <LoadingAndErrorHandler
        loading={this.props.loading}
        error={this.props.error}
      >
        <form>
          <label>
            Completed:
            <input
              name="completed"
              type="checkbox"
              checked={this.checked()}
              onChange={this.toggle}
            />
          </label>
        </form>
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
  selectedDate: PropTypes.string.isRequired
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
                <Mutation
                  mutation={CREATE_COMPLETION_MUTATION}
                >
                  {(createCompletion, create) => (
                    <Mutation
                      mutation={DELETE_COMPLETION_MUTATION}
                    >
                      {(deleteCompletion, remove) => (
                        <Completion
                          loading={create.loading || remove.loading}
                          error={create.error || remove.error}
                          createCompletion={createCompletion}
                          deleteCompletion={deleteCompletion}
                          auth={auth}
                          goal={this.props.goal}
                          selectedDate={selectedDate}
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
  goal: GoalModel
}

export default CompletionWrapped;
