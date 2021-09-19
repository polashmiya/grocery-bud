import { useState, useEffect } from "react";
import "./App.css";

//get the data from localStorage
const data = JSON.parse(localStorage.getItem("todos"));

function App() {
  //declare the essential state
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(data);
  const [editID, setEditID] = useState(null);
  const [isediting, setIsEditing] = useState(false);
  const [totalDone, setTotalDone] = useState(0);
  const [search, setSearch] = useState("");
  //handle the submit button and edit button
  const submitHandler = (e) => {
    e.preventDefault();
    if (!todo) {
      alert("Please Add Something");
    } else if (todo && isediting) {
      setTodos(
        todos.map((item) => {
          if (item.id === editID) {
            return { ...item, todo };
          }
          return item;
        })
      );
      setTodo("");
      setIsEditing(false);
      setEditID(null);
    } else {
      const newTodo = { todo, id: Math.random().toString(), complete: false };
      setTodos([...todos, newTodo]);
      setTodo("");
    }
  };

  //set item to the localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  //remove item handler
  const removeHandler = (id) => {
    const filterTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filterTodos);
    localStorage.setItem("todos", JSON.stringify(filterTodos));
  };

  //edit item handler
  const editHandler = (id) => {
    const editItem = todos.find((todo) => todo.id === id);
    setIsEditing(true);
    setEditID(id);
    setTodo(editItem.todo);
  };

  //complete item handler
  const completeHandler = (id) => {
    const tempTodos = [...todos];
    const updatedTodos = tempTodos.map((todo) => {
      if (todo.id === id) {
        const updatedTodo = { ...todo, complete: !todo.complete };
        return updatedTodo;
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  //calculate the total number of complete
  const totalComplete = () => {
    let total = 0;
    todos.map((todo) => {
      if (todo.complete === true) {
        total++;
      }
      return todo;
    });
    setTotalDone(total);
  };

  //dispaling the total number of complete
  useEffect(() => {
    totalComplete();
  });
  //main jsx
  return (
    <section className="App">
      <form onSubmit={submitHandler}>
        <div className="form">
          <input
            type="text"
            autoComplete="off"
            name="todo"
            placeholder=" Write Here"
            id="todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button type="submit" className={isediting ? "editBtn" : null}>
            {isediting ? "Edit" : "Submit"}
          </button>

          <div className="total">
            <p className="totalTodo">Total Todo : {todos.length} </p>
            <p className="completedTodo">Completed Todo : {totalDone} </p>
          </div>
          <input
            type="text"
            placeholder="Serach Here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
      <article className="todoList">
        {todos.length > 0 ? (
          <>
            {todos
              .filter((val) => {
                if (val === "") {
                  return val;
                } else if (
                  val.todo.toLowerCase().includes(search.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((todo, i) => {
                return (
                  <div className="todo" key={todo.id}>
                    <p className={todo.complete ? "complete" : "notComplete"}>
                      {i + 1}. {todo.todo}
                    </p>
                    <div className="btnGroup">
                      <button
                        className="completeBtn"
                        onClick={() => completeHandler(todo.id)}
                      >
                        {todo.complete ? "Undo" : "Completed"}
                      </button>
                      <button
                        className="editBtn"
                        onClick={() => editHandler(todo.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="deleteBtn"
                        onClick={() => {
                          if (window.confirm("Are you sure to delete this?")) {
                            removeHandler(todo.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
          </>
        ) : (
          <p className="noData">Opps! No Todo Available. Please Add.</p>
        )}
      </article>
    </section>
  );
}

export default App;
