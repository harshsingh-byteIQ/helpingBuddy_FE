import { Button, Col, Input, Row } from "antd";
import styles from "./contact.module.scss";

const Contact = () => {
  return (
    <div className={`container_margin`}>
      <div className={styles.contact_wrapper}>
        <div className={styles.contact_wrapper_items_first}>
          <p className={styles.heading}>Let's get in touch now !</p>
          <p>This will help know you better and make your experience great </p>
        </div>
        <div className={styles.contact_wrapper_items_second}>
          <Row style={{width:"100%"}}>
            <Col span={12}>
              <Input placeholder="First Name" className={styles.input} />
            </Col>
            <Col span={12}>
              <Input placeholder="Last Name" className={styles.input} />
            </Col>
          </Row>

          <Input placeholder="Email Id" className={styles.input} />
          <Input placeholder="Contact No." className={styles.input} />

          <Input placeholder="your message here" className={styles.input} />
          <Button className={styles.btn}>Submit</Button>
        </div>
        <div className={styles.contact_wrapper_items_third}>
          <div className={styles.inner_child}>
            <p>Address</p>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </div>
          </div>
          <div className={styles.inner_child}>
            <p>Email</p>
            <div>xyz@gmail.com</div>
            <p>Phone Number</p>
            <div>+1 123456789</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
