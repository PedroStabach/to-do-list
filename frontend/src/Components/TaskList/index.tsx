import { useState, useEffect } from "react";
import { FiCheck } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import styles from "./index.module.css";
import { UpdateTask } from "../UpdateTask";

export function TaskList() {
  const [showUpdateTask, setShowUpdateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  // Carregar tarefas
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
        if (
          task.status !== "concluido" &&
          new Date(task.data_conclusao) < new Date()
        ) {
          return { ...task, status: "vencido" };
        }
        return task;
      });

      setTasks(updated);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Concluir tarefa
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

      await loadTasks();
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Abrir modal de edição
  function handleOpenUpdate(task: any) {
    setSelectedTask(task);
    setShowUpdateTask(true);
  }

  // Fechar modal e recarregar lista
  function handleCloseUpdate() {
    setShowUpdateTask(false);
    setSelectedTask(null);
    loadTasks();
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
              <h2>{task.titulo}</h2>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {task.status !== "concluido" && task.status !== "vencido" && (
                  <FiCheck
                    size={20}
                    color="#2d8cff"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleConcluir(task.id)}
                  />
                )}
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
            </div>

            <p>{task.descricao}</p>

            <div className={styles.taskFooter}>
              <span>Criação: {new Date(task.data_criacao).toLocaleDateString()}</span>
              <span>Vencimento: {new Date(task.data_conclusao).toLocaleDateString()}</span>
            </div>
            <div className={styles.taskFooter}>
              <FaPencilAlt
                  size={17}
                  color="#2d8cff"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenUpdate(task)}
            />
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de edição */}
      {showUpdateTask && selectedTask && (
        <UpdateTask onClose={handleCloseUpdate} task={selectedTask} />
      )}
    </div>
  );
}
