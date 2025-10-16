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

        const data = await response.json();
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
      <h2>Minhas Tarefas</h2>

      {error && <div className={styles.error}>{error}</div>}

      {tasks.length === 0 ? (
        <p>Nenhuma tarefa cadastrada ainda.</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <div className={styles.taskHeader}>
                <h3>{task.titulo}</h3>
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
                  <strong>Criação:</strong> {formatarData(task.data_criacao)}
                </span>
                <span>
                  <strong>Conclusão:</strong>{" "}
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
