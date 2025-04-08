import styles from "./auth.module.scss";
import img from "../../assets/authPage.png";
import { Button, Col, Form, Input, Row } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useState } from "react";
import RoleSelect from "./roleSelect";

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
  tabs: {
    backgroundColor: "#D9D9D9",
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
    background: "linear-gradient(to right, #BB6EFF, #704299)",
    borderRadius: "2vh",
    height: "90%",
    color: "white",
  },
};

const Login = () => {

  const [form] = Form.useForm();

  const [isRoleOption, setisRoleOption] = useState<boolean>(false);
  const [data , setData] = useState<any>();

  const { goTo } = useAppNavigation();
  const handleSpanClick = () => {
    goTo("/");
  };

  const handleSubmit = (data: any) => {
    console.log(data)
    setisRoleOption(true)
    setData(data);
  }

  return (
    <>
      {!isRoleOption ?
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

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  autoComplete="off"
                >
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="First Name"
                          name="first_name"
                          rules={[{ required: true, message: 'Please enter your first name' }]}
                        >
                          <Input placeholder="Enter your first name" style={stylesInline.input} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Last Name"
                          name="last_name"
                          rules={[{ required: true, message: 'Please enter your last name' }]}
                        >
                          <Input placeholder="Enter your last name" style={stylesInline.input} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row align="top">
                      <Col span={6}>
                        <p>Your Email</p>
                      </Col>
                      <Col span={18}>
                        <Form.Item
                          name="email"
                          rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Enter a valid email address' },
                          ]}
                        >
                          <Input placeholder="Enter your email ID" style={stylesInline.input} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={6}>
                        <p>Contact No.</p>
                      </Col>
                      <Col span={18}>
                        <Form.Item
                          name="contact_no"
                          rules={[{ required: true, message: 'Please enter your contact number' }]}
                        >
                          <Input placeholder="Enter your contact number" style={stylesInline.input} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={6}>
                        <p>Password</p>
                      </Col>
                      <Col span={18}>
                        <Form.Item
                          name="password"
                          rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                          <Input.Password
                            placeholder="Enter your password"
                            iconRender={(visible) =>
                              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            }
                            style={stylesInline.input}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={6}>
                        <p>Confirm Pass.</p>
                      </Col>
                      <Col span={18}>
                        <Form.Item
                          name="confirmPassword"
                          dependencies={['password']}
                          rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                              },
                            }),
                          ]}
                        >
                          <Input.Password
                            placeholder="Re-enter your password"
                            iconRender={(visible) =>
                              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            }
                            style={stylesInline.input}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item>
                      <Button type="primary" htmlType="submit"style={stylesInline.button}>
                        Next
                      </Button>
                    </Form.Item>
                  </>
                </Form>
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
        </> : <>
          <RoleSelect data={data}></RoleSelect>
        </>
      }
    </>
  );
};

export default Login;
