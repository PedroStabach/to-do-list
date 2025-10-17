import { FaCalendarCheck, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

export function Account () {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    //funcao login
    async function handleSubmit (e : React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:3000/auth/signin", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({email, password})
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => ({error: "erro inesperado"}));
                throw new Error(errorData.error || "erro ao logar");
            }
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            navigate("/");
        } catch (e : any) {
            setError(e.message);
        }
    }
    async function handleRegister () {
        return navigate("/Register")
    }
    return (
        <>
            <div className={styles.AccountArea}>
                <div className={styles.container}>
                <h1>MyTasks</h1>
                <h2>Organize seu dia, conquiste seus objetivos.</h2>
                <FaCalendarCheck className={styles.FaCalendarCheck} size={150}/>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <button type="submit">Entrar</button>
                    <button type="button" className={styles.CriarConta} onClick={handleRegister}>Criar Conta</button>
                    {error && <div className={styles.error}>{error}</div>}
                </form>
                
                </div>
                <div className={styles.container}>
                    <FaCheckCircle size={150} color="#344c64"/>
                    <h1>Fique organizado </h1>
                    <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</span>
                </div>
            </div>
            
        </>
    )
}