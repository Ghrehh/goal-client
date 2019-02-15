import PropTypes from 'prop-types';

export default PropTypes.shape({
  userId: PropTypes.number.isRequired,
  rememberToken: PropTypes.string.isRequired,
})
