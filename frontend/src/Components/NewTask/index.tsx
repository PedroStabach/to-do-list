import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./index.module.css";

interface NewTaskProps {
  onClose: () => void; // função para fechar o componente
}

export function NewTask({ onClose }: NewTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      const deadlineDate = new Date(deadline);
      if(deadlineDate.getTime() < Date.now()) {
        return alert("data final precisa ser maior que a atual");
      }
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // O token JWT do login
        },
        body: JSON.stringify({
          titulo: title,
          descricao: description,
          status: "pendente",
          data_criacao: new Date().toISOString(),
          data_conclusao: deadlineDate.toISOString()
        })
      });


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro inesperado" }));
        throw new Error(errorData.error || "Erro ao criar tarefa");
      }

      // Limpa campos
      setTitle("");
      setDescription("");
      setDeadline("");

      // Fecha o NewTask
      onClose();
      alert("Nova Tarefa criada com sucesso!");
      window.location.reload();

    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FaTimes size={30} className={styles.closeButton} onClick={onClose} />

        <h2 className={styles.title}>Nova Tarefa</h2>

        <label>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título"
          required
        />

        <label>Descrição</label>
        <textarea
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

        <button type="submit">Adicionar Tarefa</button>

        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
}
