import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  // 백엔드 주소 (로컬 테스트용)
  const API_URL = 'http://localhost:5000/api/todos';

  // 1. Todo 목록 가져오기 (Read)
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(API_URL);
        setTodos(res.data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };

    fetchTodos();
  }, []);
  
  // 2. Todo 추가하기 (Create)
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title) return;
    const res = await axios.post(API_URL, { title });
    setTodos([...todos, res.data]);
    setTitle('');
  };

  // 3. Todo 완료 체크 (Update)
  const toggleTodo = async (id, completed) => {
    const res = await axios.put(`${API_URL}/${id}`, { completed: !completed });
    setTodos(todos.map(t => t._id === id ? res.data : t));
  };

  // 4. Todo 삭제하기 (Delete)
  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">My Todo List</h1>
        
        {/* 입력 폼 */}
        <form onSubmit={addTodo} className="flex mb-4">
          <input
            type="text"
            className="flex-grow border-b-2 border-gray-300 focus:border-blue-500 outline-none px-2 py-1"
            placeholder="할 일을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">추가</button>
        </form>

        {/* 목록 보기 */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li key={todo._id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <span className={todo.completed ? "line-through text-gray-400" : "text-gray-800"}>
                  {todo.title}
                </span>
              </div>
              <button 
                onClick={() => deleteTodo(todo._id)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;