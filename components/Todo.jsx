import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import toast from 'react-toastify';

const Todo = ({ id, title, description, mongoId, completed, deleteTodo, completeTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [isCompleted, setIsCompleted] = useState(completed);

  useEffect(() => {
    setIsCompleted(completed);
  }, [completed]);

  const handleEdit = () => {
    setUpdatedTitle(title);
    setUpdatedDescription(description);
    setIsEditing(true);
  };

  const saveEdit = async () => {
    try {
      await editTodo(mongoId, updatedTitle, updatedDescription);
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing todo:', error);
      toast.error('Failed to edit todo.');
    }
  };

  const closeEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(mongoId);
        toast.success('Todo deleted successfully.');
      } catch (error) {
        console.error('Error deleting todo:', error);
        toast.error('Failed to delete todo.');
      }
    }
  };

  const handleComplete = async () => {
    const updatedStatus = !isCompleted;
    setIsCompleted(updatedStatus);

    try {
      await completeTodo(mongoId, updatedStatus);
    } catch (error) {
      console.error('Error updating todo status:', error);
      setIsCompleted(!updatedStatus); // Revert status if error occurs
      toast.error('Failed to update todo status.');
    }
  };

  return (
    <>
      <tr className="border-b border-gray-300 dark:border-gray-700">
        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 border-r">{id + 1}</td>
        <td className="px-6 py-4 text-gray-800 dark:text-gray-100 border-r">{title}</td>
        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 border-r">{description}</td>
        <td className={`px-6 py-4 font-semibold border-r ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}`}>
          {isCompleted ? 'Completed' : 'Pending'}
        </td>
        <td className="px-6 py-4 space-x-2 flex">
          <button onClick={handleEdit} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 flex items-center justify-center transition duration-300 ease-in-out">
            <FaEdit className="mr-2" /> Edit
          </button>
          <button onClick={handleComplete} disabled={isCompleted} className={`py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out ${isCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}>
            <FaCheckCircle className="mr-2" />
            {isCompleted ? 'Completed' : 'Complete'}
          </button>
          <button onClick={handleDelete} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 flex items-center justify-center transition duration-300 ease-in-out">
            <FaTrashAlt className="mr-2" /> Delete
          </button>
        </td>
      </tr>

      {/* Modal for editing */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeEdit}></div>

          {/* Modal content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-50 max-w-lg w-full relative">
            <h2 className="text-lg font-bold mb-4 text-white">Edit Todo</h2>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Title</label>
              <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-3 w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Description</label>
              <textarea value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} className="border border-gray-300 rounded-lg py-2 px-3 w-full"></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={saveEdit} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center transition duration-300 ease-in-out">
                <FaCheckCircle className="mr-2" /> Save
              </button>
              <button onClick={closeEdit} className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 flex items-center justify-center transition duration-300 ease-in-out">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Todo;
