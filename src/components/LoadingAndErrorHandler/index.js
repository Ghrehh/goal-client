import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LoadingAndErrorHandler extends Component {
  render() {
    if (this.props.loading) return <p>Loading...</p>;
    if (this.props.error) return <p>Error :(</p>;

    return this.props.children
  }
}

LoadingAndErrorHandler.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  children: PropTypes.node
};

export default LoadingAndErrorHandler;
