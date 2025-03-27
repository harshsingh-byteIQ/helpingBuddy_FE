import styles from "./meetingDetails.module.scss";
import img from "../../assets/appointment_profile.png";

const MeetingDetails = () => {
  return (
    <div className="container_margin">
      <div className={styles.meeting_details_wrapper}>
        <div className={styles.user_info}>
          <div className={styles.first_div}>
            <img src={img}></img>
            <div>
              <h4>Mitun Sahu</h4>
              <p>RDV : Jan 26th 2025</p>
            </div>
          </div>
          <div className={styles.third_div}>
            <button>Join the meeting</button>
          </div>
        </div>
        <div className={styles.user_questions}></div>
        <div className={styles.footer_wrapper}>
          <p> Keep Growing!</p>
          <p>
            Want to make a bigger impact? Join special mentorship programs and
            help more people.  Upcoming sVolunteering Events: [View
            Opportunities] Your efforts matter. Keep making a difference! ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
