import { ReactNode } from 'react';
import styles from './index.module.css';
import { FiSearch } from 'react-icons/fi';

function HandleLogin() {
    if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.href = '/'; // redireciona para a página de login
    } else {
        window.location.href = '/login';
    }
    
}
export function Header ( ) {
    return (
        <>
            <div className={styles.Header}>
                <h1>Tasks</h1>
                <div>
                    <form className={styles.SearchArea}>
                     <FiSearch size={30} className={styles.FiIcon} />
                     <input type="text" />
                    </form>
                    <button onClick={HandleLogin}>{localStorage.getItem("token") 
                    ? "Logout" 
                    : "Login"}
                    </button>
                </div>
            </div>
        </>
    );
}