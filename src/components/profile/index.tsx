import styles from "./profile.module.scss";
import profileImage from "../../assets/profile_image.png";
import { Button, Input } from "antd";

const Profile = () => {
  const stylesInline = {
    container: {
      width: "100%",
      marginTop: "2vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "400",
      marginBottom: "20px",
    },
    input: {
      width: "95%",
      height: "40px",
      borderRadius: "5px",
      marginBottom: "15px",
      fontSize: "16px",
    },
    button: {
      width: "100%",
      height: "45px",
      borderRadius: "5px",
      background: "linear-gradient(to right, #BB6EFF, #704299)",
      border: "none",
      fontSize: "16px",
      fontWeight: "bold",
      fontFamily: `$font-stack-primary`,
    },
    footerText: {
      marginTop: "10px",
      fontSize: "14px",
      color: "#666",
    },
    span: {
      color: "#BB6EFF",
      cursor: "pointer",
    },
  };
  return (
    <div className={`${styles.t} container_margin`}>
      <div className={styles.profile_page_wrapper}>
        <div className={styles.img_wrapper}>
          <img src={profileImage}></img>
          <div className={styles.detail_container}>
            <p>Mitun Kumar Sahu</p>
            <p>Student</p>
            <p className={styles.smallCap}>Hey it mitun The gandu</p>
          </div>
        </div>
        <div className={styles.edit_button_wrapper}>
          <Button>Edit Profile</Button>
        </div>
      </div>
      <div className={styles.hrWrapper}>
        <hr></hr>
      </div>
      <div className={styles.authContent}>
        <div >
          <Input placeholder="text" style={stylesInline.input} />
          <Input placeholder="text" style={stylesInline.input} />
          <Input placeholder="text" style={stylesInline.input} />
          <Input placeholder="text" style={stylesInline.input} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
