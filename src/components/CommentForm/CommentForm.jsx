
import { useState, useEffect } from 'react';

const CommentForm = ({handleAddComment, handleUpdateComment, editingComment, setEditingComment,}) => {
  
  const [formData, setFormData] = useState({ text: '' });

  // Fill form when editing a comment
  useEffect(() => {
    if (editingComment) {
      setFormData({ text: editingComment.comment_text || '' });
    } else {
      setFormData({ text: '' });
    }
  }, [editingComment]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!formData.text.trim()) return; // prevent empty submission

    try {
      if (editingComment) {
        // Edit mode
        await handleUpdateComment({
          ...editingComment,
          comment_text: formData.text,
        });
        setEditingComment(null);
      } else {
        // Add mode
        await handleAddComment(formData);
        setFormData({ text: '' });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save comment. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingComment(null);
    setFormData({ text: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text-input">Your comment:</label>
      <textarea
        required
        name="text"
        id="text-input"
        value={formData.text}
        onChange={handleChange}
        placeholder="Describe your workout: weights, reps, sets..."
        rows={6}
        cols={50}
      />
      <div>
        <button type="submit">
          {editingComment ? 'Update' : 'Add'}
        </button>
        {editingComment && (
          <button type="button" onClick={handleCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
