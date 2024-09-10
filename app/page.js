"use client";
import {
  FaEdit,
  FaPlus,
  FaStickyNote,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Todo from "@/components/Todo";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [todoData, setTodoData] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api");
      setTodoData(response.data.todos);
      localStorage.setItem("todoData", JSON.stringify(response.data.todos));
    } catch (error) {
      toast.error("Failed to load todos.");
    }
  };

  useEffect(() => {
    // Fetch todos from localStorage first (if available)
    const storedTodos = localStorage.getItem("todoData");
    if (storedTodos) {
      setTodoData(JSON.parse(storedTodos));
    } else {
      // Fetch from API if no localStorage data exists
      fetchTodos();
    }
  }, []);

  useEffect(() => {
    // Store todos in localStorage whenever todoData changes
    if (todoData.length > 0) {
      localStorage.setItem("todoData", JSON.stringify(todoData));
    }
  }, [todoData]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api", formData);
      toast.success(response.data.msg);
      setFormData({ title: "", description: "" });
      fetchTodos();
    } catch (error) {
      toast.error("An error occurred while adding the todo.");
    }
  };

  const deleteTodo = async (mongoId) => {
    try {
      console.log(`Sending delete request for ID: ${mongoId}`);
      const response = await axios.delete("/api", { params: { id: mongoId } });
      console.log('Delete response:', response);
      if (response.status === 200) {
        setTodoData((prevTodoData) =>
          prevTodoData.filter((todo) => todo._id !== mongoId)
        );
        toast.success("Todo deleted successfully.");
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error("An error occurred while deleting the todo.");
    }
  };
  

  

  const completeTodo = async (mongoId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Toggle status
      const response = await axios.put(
        "/api",
        { completed: updatedStatus },
        { params: { id: mongoId } }
      );
      if (response.status === 200) {
        const updatedTodo = response.data.todo;
        setTodoData((prevTodoData) =>
          prevTodoData.map((todo) =>
            todo._id === mongoId ? updatedTodo : todo
          )
        );
        toast.success("Todo status updated successfully.");
      }
    } catch (error) {
      toast.error("Failed to update todo status.");
    }
  }
  

  const editTodo = async (mongoId, updatedTitle, updatedDescription) => {
    try {
      const response = await axios.put(
        `/api`, // Endpoint for editing todos
        { title: updatedTitle, description: updatedDescription },
        { params: { id: mongoId } } // Passing the ID as a query parameter
      );
      if (response.status === 200) {
        const updatedTodo = response.data.todo;
        setTodoData((prevTodoData) =>
          prevTodoData.map((todo) =>
            todo._id === mongoId ? updatedTodo : todo
          )
        );
        toast.success('Todo updated successfully.');
      } else {
        toast.error('Failed to update todo.');
      }
    } catch (error) {
      toast.error('Failed to update todo.');
    }
  };
  
  
  
  
  

  const sortedTodos = [...todoData].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <div className="min-h-screen py-10 font-playfair px-4 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <ToastContainer />

      <div className="flex items-center justify-center mb-12">
        <form
          className="flex flex-col gap-6 w-full max-w-3xl p-8 bg-white rounded-lg shadow-xl transition-transform duration-300 hover:scale-[1.01] dark:bg-gray-800 dark:border-gray-700"
          onSubmit={onSubmitHandler}
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            Add a New Todo
          </h1>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="font-semibold text-gray-600 dark:text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              onChange={onChangeHandler}
              value={formData.title}
              placeholder="Enter Todo Title"
              className="border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition duration-300 ease-in-out"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="font-semibold text-gray-600 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter Todo Description"
              onChange={onChangeHandler}
              value={formData.description}
              rows="4"
              className="border border-gray-300 rounded-lg py-3 px-4 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition duration-300 ease-in-out"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <FaPlus className="inline-block mr-2" /> Add Todo
          </button>
        </form>
      </div>

      <div className="flex items-center justify-center mb-6">
        <label
          htmlFor="sort"
          className="font-semibold mr-2 text-gray-600 dark:text-gray-300"
        >
          Sort by Title:
        </label>
        <select
          id="sort"
          className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          onChange={(e) => setSortDirection(e.target.value)}
          value={sortDirection}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="flex items-center justify-center">
        <table className="w-[60%] bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                #
              </th>
              <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                Title
              </th>
              <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                Description
              </th>
              <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTodos.length > 0 ? (
              sortedTodos.map((todo, index) => (
                <Todo
                  key={todo._id}
                  id={index}
                  mongoId={todo._id}
                  title={todo.title}
                  description={todo.description}
                  completed={todo.completed}
                  deleteTodo={deleteTodo}
                  completeTodo={completeTodo}
                  editTodo={editTodo}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-600 dark:text-gray-300"
                >
                  No todos available. Please add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};  
