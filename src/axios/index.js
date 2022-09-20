import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/todo-application/api",
});

export default instance;
