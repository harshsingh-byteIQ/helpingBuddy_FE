import { ButtonType, MeetingTypes } from "../../utils/Enums";
import Tabs from "../tabs";
import styles from "./appointments.module.scss";

const Appointments = () => {
  return (
    <div className={`${styles.appointment_wrapper} container_margin`}>
      <h1>Appointment</h1>
      {[1, 1, 1, 1, 1].map((ele: any, idx: number) => {
        return (
          <div className={styles.tabs}>
            <Tabs
              meeting_status_type={
                idx === 0 ? MeetingTypes?.Postponed : MeetingTypes?.Scheduled
              }
              button_types={ButtonType?.Student}
            ></Tabs>
          </div>
        );
      })}
    </div>
  );
};

export default Appointments;
