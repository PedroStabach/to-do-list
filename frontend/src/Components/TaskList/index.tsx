import { useState, useEffect } from "react";
import { FiCheck } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import styles from "./index.module.css";
import { UpdateTask } from "../UpdateTask";

type Task = {
  id: number;
  titulo: string;
  descricao?: string;
  status: string;
  data_criacao: string;
  data_conclusao?: string | null;
  [key: string]: any;
};

export function TaskList() {
  const [showUpdateTask, setShowUpdateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<
    "todas" | "concluido" | "andamento" | "vencido"
  >("todas");
  const [loading, setLoading] = useState(false);

  // busca do backend e aplicação do filtro no frontend
  async function loadTasks() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      const res = await fetch("http://localhost:3000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao carregar tarefas");
      }

      let data: Task[] = await res.json();

      // atualizar status para 'vencido' localmente quando necessário
      const agora = new Date();
      data = data.map((t) => {
        if (
          t.status !== "concluido" &&
          t.data_conclusao &&
          new Date(t.data_conclusao) < agora
        ) {
          return { ...t, status: "vencido" };
        }
        return t;
      });

      // aplicar filtro
      let filtered = data;
      if (filter === "concluido")
        filtered = data.filter((t) => t.status === "concluido");
      else if (filter === "andamento")
        filtered = data.filter(
          (t) => t.status !== "concluido" && t.status !== "vencido"
        );
      else if (filter === "vencido")
        filtered = data.filter((t) => t.status === "vencido");

      setTasks(filtered);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConcluir(id: number) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "concluido" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao concluir tarefa");
      }

      await loadTasks();
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleOpenUpdate(task: Task) {
    setSelectedTask(task);
    setShowUpdateTask(true);
  }

  function handleCloseUpdate() {
    setShowUpdateTask(false);
    setSelectedTask(null);
    loadTasks();
  }

  function handleFilterChange(
    next: "todas" | "concluido" | "andamento" | "vencido"
  ) {
    setFilter(next);
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className={styles.taskListWrapper}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.filterButtons}>
        <button
          className={filter === "todas" ? styles.activeFilter : ""}
          onClick={() => handleFilterChange("todas")}
        >
          Todas
        </button>
        <button
          className={filter === "andamento" ? styles.activeFilter : ""}
          onClick={() => handleFilterChange("andamento")}
        >
          Em andamento
        </button>
        <button
          className={filter === "concluido" ? styles.activeFilter : ""}
          onClick={() => handleFilterChange("concluido")}
        >
          Concluídas
        </button>
        <button
          className={filter === "vencido" ? styles.activeFilter : ""}
          onClick={() => handleFilterChange("vencido")}
        >
          Vencidas
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <div className={styles.taskHeader}>
                <h3>{task.titulo}</h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                  <FaPencilAlt
                    size={16}
                    color="#2d8cff"
                    style={{ cursor: "pointer", marginLeft: 6 }}
                    onClick={() => handleOpenUpdate(task)}
                  />
                </div>
              </div>

              <p>{task.descricao}</p>

              <div className={styles.taskFooter}>
                <span>
                  Criação:{" "}
                  {new Date(task.data_criacao).toLocaleDateString("pt-BR")}
                </span>
                <span>
                  Vencimento:{" "}
                  {task.data_conclusao
                    ? new Date(task.data_conclusao).toLocaleDateString("pt-BR")
                    : "-"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showUpdateTask && selectedTask && (
        <UpdateTask onClose={handleCloseUpdate} task={selectedTask} />
      )}
    </div>
  );
}
