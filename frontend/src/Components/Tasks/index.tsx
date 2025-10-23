import { Header } from "../Header";
import styles from "./index.module.css";
import { NewTask } from "../NewTask";
import { useState, useEffect } from "react";
import { TaskList } from "../TaskList";
import { useAuth } from "../../contexts/AuthContext";

interface TaskType {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  data_criacao: string;
  data_conclusao: string | null;
}

export function Task() {
  const [showNewTask, setShowNewTask] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const { token, logout } = useAuth();

  async function fetchTasks() {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) throw new Error("Erro ao buscar tarefas");

      const data = await response.json();
      setTasks(data);
    } catch (err: any) {
      console.error("Erro ao carregar tarefas:", err.message);
    }
  }

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  function handleNewTaskClose() {
    setShowNewTask(false);
    fetchTasks();
  }

  return (
    <>
      <Header />
      <div className={styles.newTask} onClick={() => setShowNewTask(true)}>
        +
      </div>

      {showNewTask && <NewTask onClose={handleNewTaskClose} />}

      <div className={styles.tasks}>
        {/* Corrigido: estava 'tasksType', deve ser 'tasks' */}
        <TaskList tasks={tasks} />
      </div>
    </>
  );
}
