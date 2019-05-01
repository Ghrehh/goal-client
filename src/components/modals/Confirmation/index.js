import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modals/Modal';

class ConfirmationModal extends Component {
  render() {
    return (
      <Modal>
        <p>{this.props.text}</p>
        <button onClick={this.props.onConfirm}>Confirm</button>
        <button onClick={this.props.onCancel}>Cancel</button>
      </Modal>
    );
  }
}

ConfirmationModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default ConfirmationModal;
