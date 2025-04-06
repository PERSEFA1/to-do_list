import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://127.0.0.1:8000";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [discr, setDiscr] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error("Ошибка при получении задач:", err);
    }
  };

  const addTask = async () => {
    const newTask = {
      name,
      discr,
      done: false,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(`${API_URL}/tasks`, newTask, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchTasks();
      setName("");
      setDiscr("");
    } catch (err) {
      console.error("Ошибка при добавлении задачи:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Ошибка при удалении задачи:", err);
    }
  };

  const toggleDone = async (task) => {
    try {
      await axios.put(
        `${API_URL}/tasks/${task.id}`,
        {
          ...task,
          done: !task.done,
          date: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error("Ошибка при обновлении задачи:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>To-Do List</h2>
      <TextField
        label="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <TextField
        label="Описание"
        value={discr}
        onChange={(e) => setDiscr(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <Button variant="contained" onClick={addTask}>
        Добавить
      </Button>

      <List>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <Checkbox checked={task.done} onChange={() => toggleDone(task)} />
            <ListItemText
              primary={task.name}
              secondary={task.discr}
              style={{
                textDecoration: task.done ? "line-through" : "none",
              }}
            />
            <IconButton onClick={() => deleteTask(task.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default App;
