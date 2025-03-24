import styles from "./auth.module.scss";
import img from "../../assets/authPage.png";
import { Button, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import "../../styles/variable.scss";
import { useNavigate } from "react-router-dom";

const stylesInline = {
  container: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "400",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    height: "30px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "16px",
  },
  button: {
    width: "30%",
    height: "30px",
    borderRadius: "5px",
    background: "linear-gradient(to right, #BB6EFF, #704299)",
    border: "none",
    fontSize: "14px",
    fontWeight: "light",
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

const Question = () => {

  const navigation = useNavigate();
  
  const handleSubmit = () => {
    navigation('/profile')
  }

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
            <h1 style={stylesInline.heading}>Help us get to know you better</h1>

            <Input
              placeholder="Please provide your hobbies"
              style={stylesInline.input}
            />
            <Input
              placeholder="Please provide your fav songs"
              style={stylesInline.input}
            />
            <Input placeholder="Your interest's" style={stylesInline.input} />
            <Input placeholder="Political view" style={stylesInline.input} />
            <Input placeholder="Gaming type" style={stylesInline.input} />
            <Input
              placeholder="Fav Football Player"
              style={stylesInline.input}
            />
            <Input
              placeholder="Anything else you want to share"
              style={stylesInline.input}
            />

            <Button onClick={handleSubmit} type="primary" style={stylesInline.button}>
              Submit
            </Button>
          </div>
        </div>
      </div>
      <img className={styles.imgStyle} src={img}></img>
    </>
  );
};

export default Question;
