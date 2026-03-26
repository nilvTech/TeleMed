import styles from "../CSS/RightSectionCSS/QuickActions.module.css";
const QuickActions = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Quick Actions</div>

      <button className={styles.button}>View Patient Profile</button>
      <button className={styles.button}>Schedule Appointment</button>
      <button className={styles.button}>Start Video Call</button>
    </div>
  );
};
export default QuickActions;
