import Tabs from "../tabs";
import styles from "./appointments.module.scss";

const Appointments = () => {
  return (
    <div className={`${styles.appointment_wrapper} container_margin`}>
      <h1>Appointment</h1>
      {[1, 1, 1, 1].map((ele: any) => {
        return (
          <div className={styles.tabs}>
            <Tabs></Tabs>
          </div>
        );
      })}
    </div>
  );
};

export default Appointments;
