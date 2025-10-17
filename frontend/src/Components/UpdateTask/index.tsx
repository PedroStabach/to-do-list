import { ReactElement, useState } from "react";
import { FaTimes , FaTrash} from "react-icons/fa";
import styles from "./index.module.css";

interface UpdateTaskProps {
  onClose: () => void;   // função para fechar o componente
  task: any;             // tarefa a ser editada (vem da lista)
}

export function UpdateTask({ onClose, task }: UpdateTaskProps) {
  const [title, setTitle] = useState(task?.titulo || "");
  const [description, setDescription] = useState(task?.descricao || "");
  const [deadline, setDeadline] = useState(task?.data_conclusao?.slice(0, 10) || "");
  const [status, setStatus] = useState(task?.status || "");
  const [error, setError] = useState("");
  async function handleDelete() {
    try {
      const token = localStorage.getItem('token');
      if(!token) throw new Error("Usuário não autenticado.");

      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro inesperado" }));
        throw new Error(errorData.error || "Erro ao atualizar tarefa");
      }

      alert("Tarefa apagada com sucesso!");
      onClose();
      window.location.reload();
    } catch(err : any) {
      setError(err.message);
    }
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      const deadlineDate = new Date(deadline);
      if (deadlineDate.getTime() < Date.now()) {
        return alert("A data final precisa ser maior que a atual.");
      }

      const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PATCH", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: title,
          descricao: description,
          status,
          data_conclusao: deadlineDate.toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro inesperado" }));
        throw new Error(errorData.error || "Erro ao atualizar tarefa");
      }

      alert("Tarefa atualizada com sucesso!");
      onClose();
      window.location.reload();

    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FaTimes size={30} className={styles.closeButton} onClick={onClose} />
        
        <h2 className={styles.title}>Editar Tarefa</h2>

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
        <label>Status</label>
        <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        >
        <option value="pendente">Pendente</option>
        <option value="concluido">Concluído</option>
      </select>


        <button type="submit">Salvar Alterações</button>
        <FaTrash size={30} className={styles.trashButton} style={{color:"#f00"}} onClick={handleDelete}/>
        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
}
