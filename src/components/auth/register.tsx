import styles from "./auth.module.scss";
import img from "../../assets/authPage.png";
import { Button, Input, message, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "../../styles/_variable.scss";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setRole } from "../../redux/authSlice";
import usePost from "../../hooks/usePost";
import { toast } from "react-toastify";

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

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    access_token: string
    role : string
    id : number
  };
  status_code: number
}

const Register = () => {
  const { goTo } = useAppNavigation();
  const dispatch = useDispatch();

  const [password, setPassWord] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { loading, error, postData } = usePost<LoginResponse, LoginPayload>('/login');

  const handleLogin = async () => {

    try {
      const result = await postData({ email: email, password: password });
      if (result.status_code === 200) {
        toast.success(result?.message);
        dispatch(setRole(result.data))
        goTo("/profile")
      } else {
        toast.warning("please check email or password")
      }
    } catch (err) {
      console.error(error)
      toast.warning("wrong email or password")
    } finally {
    }
  };

  const handleSpanClick = () => {
    goTo("/register");
  };

  const handleLoginClick = () => {
    if (password === "" || email === "") {
      message.warning("Please provide proper email and password");
    } else {
      handleLogin()
    }
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
            <Spin spinning={loading}>
              <Input placeholder="Email Id" style={stylesInline.input} onChange={(e) => setEmail(e?.target?.value)} />

              <Input.Password
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                style={stylesInline.input}
                onChange={(e) => setPassWord(e?.target?.value)}
              />

              <Button
                type="primary"
                style={stylesInline.button}
                onClick={handleLoginClick}
              >
                Login
              </Button>
            </Spin>

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
