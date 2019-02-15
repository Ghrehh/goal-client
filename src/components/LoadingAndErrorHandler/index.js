import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LoadingAndErrorHandler extends Component {
  renderError = () => (
    <div>
      <h2>Error</h2>
      <p>{this.props.error.message}</p>
    </div>
  )

  render() {
    if (this.props.loading) return <p>Loading...</p>;
    if (this.props.error) return this.renderError();

    return this.props.children
  }
}

LoadingAndErrorHandler.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({ message: PropTypes.string.isRequired }),
  children: PropTypes.node
};

export default LoadingAndErrorHandler;
