import { useState, useEffect } from "react";
import styles from "./index.module.css";

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  // Função para carregar todas as tarefas
  async function loadTasks() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      const response = await fetch("http://localhost:3000/tasks", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao carregar tarefas");
      }

      const data = await response.json();

      const updated = data.map((task: any) => {
        if (task.status !== "concluido" && new Date(task.data_conclusao) < new Date()) {
          return { ...task, status: "vencido" };
        }
        return task;
      });

      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // ✅ Atualiza status da tarefa para concluído
  async function handleConcluir(id: number) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "concluido" }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao concluir tarefa");
      }

      // Atualiza a lista sem precisar reload
      await loadTasks();
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className={styles.taskListWrapper}>
      {error && <div className={styles.error}>{error}</div>}
      <ul className={styles.taskList}>
        {tasks.map((task: any) => (
          <li key={task.id} className={styles.taskItem}>
            <div className={styles.taskHeader}>
              <h3>{task.titulo}</h3>
              <span
                className={styles.status}
                style={{
                  backgroundColor:
                    task.status === "concluido"
                      ? "green"
                      : task.status === "vencido"
                      ? "red"
                      : "orange",
                }}
              >
                {task.status}
              </span>
            </div>

            <p>{task.descricao}</p>
            <div className={styles.taskFooter}>
              <span>Data: {new Date(task.data_conclusao).toLocaleDateString()}</span>

              {/* 🔥 Só mostra o botão se o status for diferente de "concluido" e "vencido" */}
              {task.status !== "concluido" && task.status !== "vencido" && (
                <button onClick={() => handleConcluir(task.id)}>
                  Concluir
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
