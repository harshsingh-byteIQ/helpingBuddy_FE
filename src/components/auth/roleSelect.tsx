import styles from "./auth.module.scss";
import img from "../../assets/authPage.png";
import { Button, Col, Form, InputNumber, Row, Select, Spin, TimePicker } from "antd";
import { useState } from "react";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import usePost from "../../hooks/usePost";
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

interface RegisterPayload {
  first_name: string,
  last_name: string,
  email: string,
  contact_no: string,
  password: string,
  role: string,
  selected_slots: JSON
}

interface RegisterResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

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

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const RoleSelect = ({ data }: any) => {
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const { goTo } = useAppNavigation();
  const { Option } = Select;

  const [form] = Form.useForm();

  const handleTabClick = (option: number) => {
    setSelectedOption(option);
    console.log(data);
  };

  const { loading, error, postData } = usePost<RegisterPayload, RegisterResponse>('/register');
  const [slotCount, setSlotCount] = useState<number | null>(null);



  const handleRoleSubmit = async () => {
    const role = selectedOption === 0 ? "student" : selectedOption === 1 ? "patient" : "caretaker";
    try {
      const result = await postData({ ...data, role });
      console.log(result)
      toast.success("Registration successful!");
      goTo("/questions")
    } catch (err: any) {
      console.log(error)
      toast.error("something went wrong , please try again ");
    }
  }

  const onFinish = async (values: any) => {
    const role = selectedOption === 0 ? "student" : selectedOption === 1 ? "patient" : "caretaker";
    const slots = values.slots.map((slot: any) => {
      const start = slot.time.format('HH:mm');
      const end = dayjs(slot.time).add(1, 'hour').format('HH:mm');
      return {
        day: slot.day,
        startTime: start,
        endTime: end,
      };
    });

    try {
      const result = await postData({ ...data, role, selected_slots: slots });
      console.log(result)
      toast.success("Registration successful!");
      goTo("/questions")
    } catch (err: any) {
      console.log(error)
      toast.error("something went wrong , please try again ");
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

            <h1 style={stylesInline.heading}>Choose your role</h1>
            <Spin spinning={loading}>
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
            </Spin>
            {selectedOption === 0 &&
              <>
                <div className={styles.selectSlotOption}>
                  <p>Please enter how many 1-hour slots you want to provide in a week (max 3):</p>
                  <InputNumber
                    min={1}
                    max={3}
                    value={slotCount || undefined}
                    onChange={(value) => setSlotCount(value)}
                    placeholder="Number of slots"
                    style={{ marginBottom: 16 }}
                  />

                  {slotCount && (
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                      {Array.from({ length: slotCount }).map((_, index) => (
                        <Row gutter={16} key={index}>
                          <Col span={12}>
                            <Form.Item
                              name={['slots', index, 'day']}
                              label={`Slot ${index + 1} - Day`}
                              rules={[{ required: true, message: 'Select a day' }]}
                            >
                              <Select placeholder="Select a day">
                                {daysOfWeek.map(day => (
                                  <Option key={day} value={day}>{day}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['slots', index, 'time']}
                              label={`Slot ${index + 1} - Time`}
                              rules={[{ required: true, message: 'Select a time' }]}
                            >
                              <TimePicker
                                format="HH:00"
                                minuteStep={60}
                                style={{ width: '100%' }}
                                placeholder="Select time"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      ))}
                      {
                        selectedOption === 0 && <Form.Item>
                          <Button type="primary" style={stylesInline.button} htmlType="submit">
                            Next
                          </Button>
                        </Form.Item>
                      }

                    </Form>
                  )}
                </div>
              </>
            }

            {
              selectedOption !== 0 && <Button type="primary" style={stylesInline.button} onClick={handleRoleSubmit}>
                Next
              </Button>
            }

          </div>
        </div>


      </div>
      <img className={styles.imgStyle} src={img}></img>
    </>
  );
};

export default RoleSelect;
