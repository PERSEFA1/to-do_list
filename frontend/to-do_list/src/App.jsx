import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const API_URL = "http://127.0.0.1:8000";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [discr, setDiscr] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDiscr, setEditDiscr] = useState("");

  const jsonHeaders = { "Content-Type": "application/json" };

  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks`);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!name.trim() || !discr.trim()) return;
    const newTask = {
      name,
      discr,
      done: false,
      date: new Date().toISOString(),
    };

    await axios.post(`${API_URL}/tasks`, newTask, { headers: jsonHeaders });
    fetchTasks();
    setName("");
    setDiscr("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    fetchTasks();
  };

  const toggleDone = async (task) => {
    await axios.put(
      `${API_URL}/tasks/${task.id}`,
      { ...task, done: !task.done, date: new Date().toISOString() },
      { headers: jsonHeaders }
    );
    fetchTasks();
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditName(task.name);
    setEditDiscr(task.discr);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditName("");
    setEditDiscr("");
  };

  const updateTask = async (id) => {
    const updatedTask = {
      name: editName,
      discr: editDiscr,
      done: tasks.find((t) => t.id === id)?.done || false,
      date: new Date().toISOString(),
    };

    await axios.put(`${API_URL}/tasks/${id}`, updatedTask, {
      headers: jsonHeaders,
    });
    cancelEditing();
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Box className="funSection">
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
          Добавить задачу
        </Button>
      </Box>
      <h1 className="name">To-Do List</h1>
      <List className="list">
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <Checkbox checked={task.done} onChange={() => toggleDone(task)} />
            {editingTaskId === task.id ? (
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <TextField
                  label="Название"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  margin="dense"
                />
                <TextField
                  label="Описание"
                  value={editDiscr}
                  onChange={(e) => setEditDiscr(e.target.value)}
                  margin="dense"
                />
              </Box>
            ) : (
              <ListItemText
                primary={task.name}
                secondary={task.discr}
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                }}
              />
            )}
            {editingTaskId === task.id ? (
              <Box>
                <IconButton onClick={() => updateTask(task.id)}>
                  <SaveIcon color="primary" />
                </IconButton>
                <IconButton onClick={cancelEditing}>
                  <CancelIcon color="error" />
                </IconButton>
              </Box>
            ) : (
              <Box>
                <IconButton onClick={() => startEditing(task)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default App;
