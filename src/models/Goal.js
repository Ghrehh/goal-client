import PropTypes from 'prop-types';
import CompletionModel from 'models/Completion';
import CompletionsModel from 'models/Completions';

export default PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  latestCompletion: CompletionModel,
  completions: CompletionsModel
})

export const goalCompletionForDate = ({ goal, dateString }) => {
  const date = new Date(dateString);
  let foundCompletion;

  goal.completions.forEach(completion => {
    const completionDate = new Date(completion.completedAt)
    if (
      completionDate.getFullYear() === date.getFullYear() &&
      completionDate.getMonth() === date.getMonth() &&
      completionDate.getDate() === date.getDate()
    ) { foundCompletion = completion }
  });

  return foundCompletion
};
