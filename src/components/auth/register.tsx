import styles from "./auth.module.scss";
import img from "../../assets/authPage.png";
import { Button, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "../../styles/_variable.scss";
import { useAppNavigation } from "../../hooks/useAppNavigation";

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

const Register = () => {
  const { goTo } = useAppNavigation();

  const handleSpanClick = () => {
    goTo("/register");
  };

  const handleLoginClick = () => {
    goTo("/profile");
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
            <h1 style={stylesInline.heading}>Login</h1>

            <Input placeholder="Email Id" style={stylesInline.input} />

            <Input.Password
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={stylesInline.input}
            />

            <Button
              type="primary"
              style={stylesInline.button}
              onClick={handleLoginClick}
            >
              Login
            </Button>

            <p style={stylesInline.footerText}>
              Don't have an account?{" "}
              <span style={stylesInline.span} onClick={handleSpanClick}>
                {" "}
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
      <img className={styles.imgStyle} src={img}></img>
    </>
  );
};

export default Register;
