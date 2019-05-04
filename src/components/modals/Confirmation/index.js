import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/modals/Modal';
import Button from 'components/Button';
import styles from './styles.module.css';

class ConfirmationModal extends Component {
  render() {
    return (
      <Modal>
        <p className={styles.text}>{this.props.text}</p>

        <Button
          onClick={this.props.onConfirm}
          className={styles.confirm}
        >
          Confirm
        </Button>

        <Button
          onClick={this.props.onCancel}
          className={styles.cancel}
        >
          Cancel
        </Button>
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
