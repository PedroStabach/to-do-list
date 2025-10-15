import { FaCalendarCheck, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import styles from "./index.module.css";

export function NewTask () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    //funcao login
    async function handleSubmit (e : React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("auth/login", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({email, password})
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({error: "erro inesperado"}));
                throw new Error(errorData.error || "erro ao logar");
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
        } catch (e : any) {
            setError(e.message);
        }
    }
    return (
        <>
            <div className={styles.AccountArea}>
                <form onSubmit={handleSubmit}>
                    <label>Titulo</label>
                    <input type="text" />
                    <label>Descrição</label>
                    <input type="text" />
                    <label>Data Limite</label>
                    <input type="date" />
                    <label>Prioridade</label>
                    <select name="Prioridade" id="carros">
                    <option value="Baixo">Baixo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                    </select>

                    <button type="submit">Adicionar Tarefa</button>
                    {error && <div className={styles.error}>{error}</div>}
                </form>  
            </div>
        </>
    )
}