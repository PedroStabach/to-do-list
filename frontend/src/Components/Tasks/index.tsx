import { Header } from '../Header';
import styles from './index.module.css';
import { NewTask } from '../NewTask/index';
import { useState } from 'react';

export function Task() {
  const [showNewTask, setShowNewTask] = useState(false);

  return (
    <>
      <Header />
      <div className={styles.newTask} onClick={() => setShowNewTask(true)}>
        +
      </div>

      {showNewTask && <NewTask onClose={() => setShowNewTask(false)} />}
    </>
  );
}
