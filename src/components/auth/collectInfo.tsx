import styles from "./auth.module.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import usePost from "../../hooks/usePost";
import { toast } from "react-toastify";
import { AnswerSubmitPayload, AnswerSubmitResponse,getQuestionResponse } from "../../utils/Types";
import useFetch from "../../hooks/useFetch";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { Button, Form, Input, Select, Spin } from "antd";
import img from "../../assets/authPage.png";

const Question = () => {
  const { goTo } = useAppNavigation();
  const [form] = Form.useForm();

  const { data, loading, error } = useFetch<[getQuestionResponse]>("/questions")

  const { postData, error: submitError, loading: answerSubmitLoading } = usePost<AnswerSubmitResponse, AnswerSubmitPayload>("/answers/")

  const [filteredData, setFilteredData] = useState<getQuestionResponse[]>();

  const role = useSelector((state: RootState) => state.auth.role)
  const id = useSelector((state: RootState) => state.auth.id)

  const handleSubmit = async (data: any) => {
    const newData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => key !== "additionalInfo" && value !== null)
    );

    // Step 2: Map filtered object to AnswerType[]
    const mapped:any = Object.entries(newData).map(([key, value]) => ({
      question_id: Number(key),
      user_id: id !== null ? Number(id) : 0,
      answer: value
    }));
    try {
      const result = await postData({
        "answer": mapped
      });

      if (result.status_code === 200) {
        toast.success(result?.message);
        goTo("/profile")
      } else {
        toast.warning("please check email or password")
      }
    } catch (err) {
      console.error(submitError , error)
      toast.warning("wrong email or password")
    }
  }

  useEffect(() => {
    console.log("role in effect:", role);
    const newData = data?.filter((ele: getQuestionResponse) => {
      console.log("Filtering:", ele, "question_for:", ele?.question_for, "vs role:", role);
      return ele?.question_for === "both";
    });
  
    
    setFilteredData(newData);
    
  }, [data, role]); 
  

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
          <h1 className={styles.heading}>Help us get to know you better</h1>
          <div style={{ width: "70%", height: "60vh", overflowY: "scroll" }}>
            <Spin spinning={loading || answerSubmitLoading}>
              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                style={{ maxWidth: 600, margin: "0 auto" }}
              >
                {filteredData?.map((ele: getQuestionResponse, index: number) => (
                  <Form.Item
                    key={index}
                    name={ele?.question_id}
                    label={ele.content}
                    rules={[{ required: true, message: "This field is required" }]}
                  >
                    {ele.options ? (
                      <Select placeholder={`Select ${ele.content}`} className={styles.input}>
                        {ele.options?.map((option, idx) => (
                          <Select.Option key={idx} value={option}>
                            {option}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <Input placeholder={ele.content} className={styles.input} />
                    )}
                  </Form.Item>
                ))}

                <Form.Item
                  label="Anything else you want to share"
                  name="additionalInfo"
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Enter anything else you want to share"
                    className={styles.input_last}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.button}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Spin>

          </div>
        </div>
      </div >
      <img className={styles.imgStyle} src={img}></img>

    </>
  );
};

export default Question;
