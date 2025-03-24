import styles from "./tabs.module.scss";
import img from "../../assets/appointment_profile.png";

const Tabs = () => {
  return (
    <div className={styles.tabs_wrapper}>
      <div className={styles.first_div}>
        <img src={img}></img>
      </div>
      <div className={styles.second_div}>
        <div>
          <h4>Mitun Sahu</h4>
          <p>RDV : Jan 26th 2025</p>
          <div className={styles.btn_style_postponded}>Postponded</div>
        </div>
      </div>
      <div className={styles.third_div}></div>
    </div>
  );
};

export default Tabs;
