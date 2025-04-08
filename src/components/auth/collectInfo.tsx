import styles from "./auth.module.scss";
import img from "../../assets/authPage.png";
import { Button, Form, Input } from "antd";
import { useAppNavigation } from "../../hooks/useAppNavigation";

const stylesInline = {
  container: {
    display: "flex",
    flexDirection: "column",
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
  const { goTo } = useAppNavigation();
  const [form] = Form.useForm();

  const handleSubmit = () => {
    goTo('/')
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
          <div style={{ width: "60%" }}>
            <h1 style={stylesInline.heading}>Help us get to know you better</h1>

            <Form
              form={form}

              onFinish={handleSubmit}
              style={{ maxWidth: 600, margin: '0 auto' }}
            >
              <Form.Item label="Your city" name="city">
                <Input placeholder="Enter your City" style={stylesInline.input} />
              </Form.Item>

              <Form.Item label="Your Address" name="address">
                <Input placeholder="Your Address" style={stylesInline.input} />
              </Form.Item>

              <Form.Item label="Your state" name="state">
                <Input placeholder="Enter your State Name" style={stylesInline.input} />
              </Form.Item>

              <Form.Item label="Your zip code" name="zip code">
                <Input placeholder="Enter your zip code" style={stylesInline.input} />
              </Form.Item>

              <Form.Item label="Fav Football Player" name="favoriteFootballPlayer">
                <Input placeholder="Enter your favorite football player" style={stylesInline.input} />
              </Form.Item>

              <Form.Item label="Anything else you want to share" name="additionalInfo">
                <Input.TextArea
                  rows={4}
                  placeholder="Enter anything else you want to share"
                  style={{ ...stylesInline.input, resize: 'none' }}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={stylesInline.button}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <img className={styles.imgStyle} src={img}></img>
    </>
  );
};

export default Question;
