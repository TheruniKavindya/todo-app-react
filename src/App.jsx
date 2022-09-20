import Todo from "./components/Todo";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useRef, useState } from "react";
import { TodoContext } from "./Context";

import axios from "./axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [deleteTodo, setDeleteTodo] = useState({});
  const [input, setInput] = useState(""); // Initially Empty String
  const [createdTodo, setCreatedTodo] = useState(false);
  const modalRef = useRef(null);
  const createTodoRef = useRef(null);

  const dispatchEvent = (actionType, payload) => {
    switch (actionType) {
      case "DELETE_TODO":
        setDeleteTodo(payload);
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    async function fetchAllTodos() {
      await axios.get("/todos").then((response) => {
        setTodos(response.data);
      });
    }
    fetchAllTodos();
  }, [deleteTodo, createdTodo]);

  useEffect(() => {
    if (deleteTodo?.id) {
      modalRef.current.classList.remove("hidden");
      modalRef.current.classList.add("flex");
      console.log(deleteTodo);
    } else {
      modalRef.current.classList.remove("flex");
      modalRef.current.classList.add("hidden");
    }
  }, [deleteTodo]); //Keep Listening on changes

  function closeModal() {
    modalRef.current.classList.toggle("flex");
    modalRef.current.classList.toggle("hidden");
  }

  async function removeTodo(id) {
    await axios.delete(`/todos/${id}`).then((response) => {
      console.log(response);
      setDeleteTodo(null); // Clear deleteTodo
    });
  }

  function openCreateTodoModal() {
    createTodoRef.current.classList.remove("hidden");
    createTodoRef.current.classList.add("flex");
    createdTodo(false);
  }

  async function createTodo(msg) {
    await axios
      .post("/todos", {
        msg, //msg: msg
      })
      .then((response) => {});
  }

  async function onKeyDownHandler(e) {
    if (e.key === "Enter") {
      await createTodo(input);
      createTodoRef.current.classList.remove("flex");
      createTodoRef.current.classList.add("hidden");
      setInput("");
      setCreatedTodo(true);
    }
  }

  return (
    <div className="App h-screen w-screen">
      <TodoContext.Provider value={{ deleteTodo, dispatchEvent }}>
        <h1 className="text-4xl my-10 flex items-center justify-center">
          My Todo
        </h1>
        <section className="max-w-[50vw] mx-auto h-full bg-todo-gray flex flex-col space-y-5 items-center py-10 rounded-lg relative">
          {todos.map((item) => (
            <Todo key={item.id} id={item.id} text={item.msg} />
          ))}
        </section>

        <button
          type="button"
          onClick={openCreateTodoModal}
          className="fixed bottom-5 right-5 z-40"
        >
          <i className="bi bi-plus-circle text-5xl"></i>
        </button>

        <div
          ref={createTodoRef}
          className="hidden w-full h-full fixed top-0 left-0 right-0 bottom-0 justify-center items-center backdrop-blur-sm bg-white/30 z-50"
        >
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={async (e) => await onKeyDownHandler(e)}
            type="text"
            autoFocus
            className="placeholder:text-black/30 text-5xl px-6 py-4 rounded-2xl bg-transparent border border-gray-900"
            placeholder="Remember to..."
          />
        </div>

        <div
          ref={modalRef}
          id="popup-modal"
          tabIndex={1}
          className=" overflow-y-auto hidden items-center justify-center overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full backdrop-blur-sm bg-white/30"
        >
          <div className="relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow ">
              <button
                onClick={closeModal}
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="popup-modal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <svg
                  aria-hidden="true"
                  className="mx-auto mb-4 w-14 h-14 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                  Are you sure you want to delete {deleteTodo?.text}?
                </h3>
                <button
                  onClick={() => removeTodo(deleteTodo?.id)}
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={closeModal}
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </TodoContext.Provider>
    </div>
  );
}

export default App;
