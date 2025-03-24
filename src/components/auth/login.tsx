import styles from "./auth.module.scss";
import img from "../../assets/authPage.png";
import { Button, Col, Input, Row } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const stylesInline = {
  container: {
    width: "60%",
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
    height: "40px",
    borderRadius: "5px",
    background: "linear-gradient(to right, #BB6EFF, #704299)",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
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

const Login = () => {
  const navigate = useNavigate();

  const handleSpanClick = () => {
    navigate("/register");
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
            <h1 style={stylesInline.heading}>Create Account</h1>

            <Row gutter={16}>
              <Col span={12}>
                <Input placeholder="First Name" style={stylesInline.input} />
              </Col>
              <Col span={12}>
                <Input placeholder="Last Name" style={stylesInline.input} />
              </Col>
            </Row>

            <Input placeholder="Email Id" style={stylesInline.input} />
            <Input placeholder="Contact No." style={stylesInline.input} />

            <Input.Password
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={stylesInline.input}
            />

            <Input.Password
              placeholder="Confirm Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={stylesInline.input}
            />

            <Button type="primary" style={stylesInline.button}>
              Create Account
            </Button>

            <p style={stylesInline.footerText}>
              Already have an account?{" "}
              <span style={stylesInline.span} onClick={handleSpanClick}>
                {" "}
                Log in
              </span>
            </p>
          </div>
        </div>
      </div>
      <img className={styles.imgStyle} src={img}></img>
    </>
  );
};

export default Login;
