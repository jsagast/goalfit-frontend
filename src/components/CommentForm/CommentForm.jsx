import { useState } from 'react';

const CommentForm = ({ handleAddComment }) => {
  const [formData, setFormData] = useState({ text: '' });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    // add handleAddComment
    handleAddComment(formData)
    setFormData({ text: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='text-input'>How did it go?:</label>
      <textarea
        required
        type='text'
        name='text'
        id='text-input'
        value={formData.text}
        onChange={handleChange}
        placeholder="Describe your workout: weights, reps, sets..."
        rows={6}   // height
        cols={50}  // width
      />
      <button type='submit'>Submit</button>
    </form>
  );
};

export default CommentForm;

