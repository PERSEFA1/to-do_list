import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://127.0.0.1:8000";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Ошибка при получении задач:", error);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        title: newTaskTitle,
      });

      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Container>
      <h1>To-Do List</h1>
      <TextField
        label="Новая задача"
        variant="outlined"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <Button variant="contained" color="primary" onClick={addTask}>
        Добавить задачу
      </Button>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteTask(task.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={task.title} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
