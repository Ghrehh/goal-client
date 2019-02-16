import PropTypes from 'prop-types';
import CompletionModel from 'models/Completion';
import CompletionsModel from 'models/Completions';

export default PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  latestCompletion: CompletionModel,
  completions: CompletionsModel
})
