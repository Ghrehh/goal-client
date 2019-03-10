import PropTypes from 'prop-types';

const note = PropTypes.shape({
  id: PropTypes.number.isRequired,
  body: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
})

export default PropTypes.arrayOf(note)
