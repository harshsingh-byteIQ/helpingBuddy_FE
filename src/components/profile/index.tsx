import { useState } from "react";
import styles from "./profile.module.scss";
import profileImage from "../../assets/profile_image.png";
import { Button, Col, Form, Input, Row } from "antd";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Kevin",
    lastName: "Pietersen",
    email: "kevin@gmail.com",
    phone: "+1 55446734",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleSubmit = () => {
    console.log("Updated Profile Data:", formData);
    setIsEditing(false);
  };

  return (
    <div className={`${styles.t} container_margin`}>
      <div className={styles.profile_page_wrapper}>
        <div className={styles.img_wrapper}>
          <img src={profileImage} alt="Profile" />
          <div className={styles.detail_container}>
            <p>David Pietersen</p>
            <p>Student</p>
            <p className={styles.smallCap}>Hey it's David</p>
          </div>
        </div>

        <div className={styles.edit_button_wrapper}>
          {isEditing ? (
            <>
              <Button onClick={handleCancel} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>Edit Profile</Button>
          )}
        </div>
      </div>

      <div className={styles.hrWrapper}>
        <hr />
      </div>

      <div className={styles.authContent}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="First Name">
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name">
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email">
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone Number">
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Address">
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="City">
                <Input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="State">
                <Input
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Zip Code">
                <Input
                  value={formData.zip}
                  onChange={(e) =>
                    setFormData({ ...formData, zip: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
