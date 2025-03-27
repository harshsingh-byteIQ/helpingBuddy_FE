import styles from "./auth.module.scss";
import img from "../../assets/authPage.png";
import { Button } from "antd";
import { useState } from "react";

const RoleSelect = () => {
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const handleTabClick = (option: number) => {
    setSelectedOption(option);
  };

  const stylesInline = {
    container: {
      width: "55%",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "400",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      height: "40px",
      borderRadius: "5px",
      marginBottom: "15px",
      fontSize: "16px",
    },
    button: {
      width: "100%",
      height: "35px",
      borderRadius: "10px",
      background: "linear-gradient(to right, #BB6EFF, #704299)",
      border: "none",
      fontSize: "16px",
      fontWeight: "bold",
      fontFamily: `$font-stack-primary`,
      marginTop: "5vh",
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
    tabs: {
      backgroundColor: "gray",
      width: "100%",
      height: "8vh",
      borderRadius: "3vh",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      cursor: "pointer",
      padding: "5px 8px",
    },
    tabs_options: {
      flex: "1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "2vh",
      height: "90%",
      color: "black",
    },
    selected_tabs_options: {
      flex: "2",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(101, 68, 132, 1)",
      borderRadius: "2vh",
      height: "90%",
      color: "white",
    },
  };

  return (
    <>
      <div className={styles.auth_Wrapper}>
        <div className={styles.authDetails}>
          <div className={styles.joinUs}>
            <p>Join us</p>
            <p className={styles.longertext}>
              Bridging Smiles, Connecting Hearts – Empowering Students,
              Uplifting Patients!
            </p>
          </div>
        </div>
        <div className={styles.authContent}>
          <div style={stylesInline.container}>
            <h1 style={stylesInline.heading}>Choose your role</h1>

            <div style={stylesInline.tabs}>
              <div
                style={
                  selectedOption === 0
                    ? stylesInline.selected_tabs_options
                    : stylesInline.tabs_options
                }
                onClick={() => handleTabClick(0)}
              >
                Student
              </div>
              <div
                style={
                  selectedOption === 1
                    ? stylesInline.selected_tabs_options
                    : stylesInline.tabs_options
                }
                onClick={() => handleTabClick(1)}
              >
                Patient
              </div>
              <div
                style={
                  selectedOption === 2
                    ? stylesInline.selected_tabs_options
                    : stylesInline.tabs_options
                }
                onClick={() => handleTabClick(2)}
              >
                Caretaker
              </div>
            </div>

            <Button type="primary" style={stylesInline.button}>
              Submit
            </Button>
          </div>
        </div>
      </div>
      <img className={styles.imgStyle} src={img}></img>
    </>
  );
};

export default RoleSelect;
