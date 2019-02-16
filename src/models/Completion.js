import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number.isRequired,
  completedAt: PropTypes.string.isRequired
})
