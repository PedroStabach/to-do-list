import { Header } from "../Header";
import styles from "./index.module.css";
import { NewTask } from "../NewTask";
import { useState, useEffect } from "react";
import { TaskList } from "../TaskList";
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

  // Função para buscar tarefas do usuário
  async function fetchTasks() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar tarefas");
      const data = await response.json();
      setTasks(data);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Função para atualizar lista ao criar nova tarefa
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
        <TaskList />
      </div>
    </>
  );
}
