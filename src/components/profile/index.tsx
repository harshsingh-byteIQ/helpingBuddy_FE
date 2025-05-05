// Profile.tsx
import { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import profileImage from "../../assets/profile_image.png";
import { Button, Col, Form, Input, Row, Spin } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useFetch from "../../hooks/useFetch";
import { useLocation } from "react-router-dom";
import { userData } from "../../utils/Types";

const Profile = () => {
  const id = useSelector((state: RootState) => state?.auth.id)
  const location = useLocation();
  const user_id = location?.state?.id;
  const [isEditing, setIsEditing] = useState(false);
  const new_id = user_id ? user_id : id
  const { data, loading, refetch } = useFetch<userData>(`/get-user-data/${new_id}`, false);


  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleSubmit = () => {
    console.log("Updated Profile Data:", formData);
    setIsEditing(false);
  };

  const [formData, setFormData] = useState({
    firstName: "Kevin",
    lastName: "Pietersen",
    email: "kevin@gmail.com",
    phone: "+1 55446734",
    address: "",
    city: "",
    state: "",
    zip: "",
    role : ""
  });


  useEffect(() => {
    if (id) {
      refetch();
    }
  }, []);

  useEffect(() => {
    if (data) {
      data.data.first_name;
      setFormData({ ...formData, "firstName": data.data.first_name, "lastName": data.data.last_name, "email": data.data.email, "phone": data.data.contact_no , "role" : data?.data.role })
    }
  }, [data]);

  return (
    <Spin spinning={loading}>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <img src={profileImage} alt="Profile" className={styles.profileImage} />
          <div className={styles.details}>
            <h2>{formData.firstName} {formData.lastName}</h2>
            <p className={styles.role}>{formData.role}</p>
            <p className={styles.caption}>Hey, it's {formData.firstName}</p>
            <div className={styles.buttonGroup}>
              {isEditing ? (
                <>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" onClick={handleSubmit}>Submit</Button>
                </>
              ) : (
                <Button onClick={handleEdit}>Edit Profile</Button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <Form layout="vertical" style={{ width: '100%'}}>
            <Row gutter={20}>
              <Col span={12}><Form.Item label="First Name"><Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} disabled={!isEditing} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Last Name"><Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} disabled={!isEditing} /></Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}><Form.Item label="Email"><Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Phone Number"><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!isEditing} /></Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}><Form.Item label="Address"><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} disabled={!isEditing} /></Form.Item></Col>
              <Col span={12}><Form.Item label="City"><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} disabled={!isEditing} /></Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}><Form.Item label="State"><Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} disabled={!isEditing} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Zip Code"><Input value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} disabled={!isEditing} /></Form.Item></Col>
            </Row>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default Profile;
