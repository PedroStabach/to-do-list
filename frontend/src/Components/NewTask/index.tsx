import { useState } from "react";
import { FaCalendarCheck, FaCheckCircle, FaTimes } from "react-icons/fa";
import styles from "./index.module.css";

export function NewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Baixo");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("auth/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: title, password: description }), // ajuste conforme backend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro inesperado" }));
        throw new Error(errorData.error || "Erro ao logar");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <body>
        <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>
            <FaTimes size={30}/>
            Nova Tarefa
          </h2>

          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título"
            required
          />

          <label>Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição"
            required
          />

          <label>Data Limite</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />

          <label>Prioridade</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Baixo">Baixo</option>
            <option value="Medio">Médio</option>
            <option value="Alto">Alto</option>
          </select>

          <button type="submit">
            <FaCheckCircle style={{ marginRight: "8px" }} />
            Adicionar
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </body>
  );
}
