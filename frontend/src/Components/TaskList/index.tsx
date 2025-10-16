import { useEffect, useState } from "react";
import styles from "./index.module.css";

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  data_criacao: string;
  data_conclusao?: string;
  prioridade?: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
  async function fetchTasks() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      const response = await fetch("http://localhost:3000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao carregar tarefas");
      }

      let data: Task[] = await response.json();
      
      const agora = new Date();
      data = data.map((task) => {
        if (
          task.data_conclusao &&
          new Date(task.data_conclusao) < agora &&
          task.status !== "concluída"
        ) {
          return { ...task, status: "vencido" };
        }
        return task;
      });

      setTasks(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  fetchTasks();
}, []);

  function formatarData(dataISO?: string) {
    if (!dataISO) return "-";
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
  }

  function statusColor(status: string) {
    switch (status) {
        case "pendente":
            return "#f1c40f";
        case "em andamento":
            return "#3498db";
        case "concluída":
            return "#2ecc71";
        case "vencida":
            return "rgba(163, 39, 39, 1)"
        default:
            return "#aaa";
    }
  }

  return (
    <div className={styles.taskListWrapper}>
      {error && <div className={styles.error}>{error}</div>}

      {tasks.length === 0 ? (
        <p>Nenhuma tarefa cadastrada ainda.</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <div className={styles.taskHeader}>
                <h2>{task.titulo}</h2>
                <span
                  className={styles.status}
                  style={{ backgroundColor: statusColor(task.status) }}
                >
                  {task.status}
                </span>
              </div>
              <p>{task.descricao}</p>

              <div className={styles.taskFooter}>
                <span>
                  <strong>Data Limite:</strong>{" "}
                  {formatarData(task.data_conclusao)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
