import styles from "./tabs.module.scss";
import img from "../../assets/appointment_profile.png";
import { TabsPropsType } from "../../utils/Types";
import { MeetingTypes } from "../../utils/Enums";
import { useAppNavigation } from "../../hooks/useAppNavigation";

const Tabs = (Props: TabsPropsType) => {
  const { goTo } = useAppNavigation();

  const getButtonStatusClassName = () => {
    switch (Props?.meeting_status_type) {
      case MeetingTypes?.Postponed:
        return styles?.btn_style_postponded;
      case MeetingTypes?.Scheduled:
        return styles?.btn_style_scheduled;
      case MeetingTypes?.Cancelled:
        return styles?.btn_style_cancelled;
      default:
        return styles?.btn_style_postponded;
    }
  };

  const getButtonOptions = () => {
    switch (Props?.button_types) {
      case "student":
        return <button className={styles.cancleBtn}>cancel</button>;
      case "patient":
        return (
          <>
            <button className={styles.cancleBtn}>cancel</button>;
            <button className={styles.cancleBtn}>cancel</button>;
          </>
        );
      case "admin":
        return (
          <>
            <button className={styles.cancleBtn}>Revoke Access</button>;
            <button className={styles.cancleBtn}>View Profile</button>;
          </>
        );
      default:
        return styles?.btn_style_student;
    }
  };

  const manageOnClick = () => {
    goTo("/meeting-details");
  };

  return (
    <div className={styles.tabs_wrapper} onClick={manageOnClick}>
      <div className={styles.first_div}>
        <img src={img}></img>
      </div>
      <div className={styles.second_div}>
        <h4>Mitun Sahu</h4>
        <p>RDV : Jan 26th 2025</p>
        <div className={getButtonStatusClassName()}>Postponded</div>
      </div>
      <div className={styles.third_div}>{getButtonOptions()}</div>
    </div>
  );
};

export default Tabs;
