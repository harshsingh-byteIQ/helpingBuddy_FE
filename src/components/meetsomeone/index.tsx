import { Button, Col, Input, Row, Spin } from "antd";
import styles from "./meetsomeone.module.scss";
import someoneImage from "../../assets/meetosome_img.png"
import usePost from "../../hooks/usePost";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState } from "react";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { toast } from "react-toastify";
import { UpdateAppointmentPayload, UpdateAppointmentResponse } from "../../utils/Types";

const questions = [
    "What was your favorite thing to do when you were a child?",
    "Can you tell us about your first school or teacher?",
    "What kind of music do you like to listen to?",
    "Do you remember a special holiday or celebration with your family?",
    "What was your first job, and what did you do?",
    "Do you have a favorite food or dish you love?",
    "Have you ever traveled somewhere that you really loved?",
    "Who has been someone important in your life?",
    "What advice would you give to someone young like a student?",
    "What makes you happy or brings you peace these days?"
];

const styles_inline: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "70vw",
        margin: "0 auto",
        padding: 24,
        borderRadius: 16,
        backgroundColor: "#fff",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        marginTop: "5vh"
    },
    content: {
        flex: 1,
        padding: "0 24px",
    },
    question: {
        color: "#8e44ad",
        fontSize: 20,
        marginBottom: 12,
    },
    textarea: {
        width: "100%",
        borderRadius: 8,
        borderColor: "#000",
        marginBottom: 16,
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        gap: 8,
        marginTop: 8,
    },
    pageIndicator: {
        width: 32,
        height: 32,
        borderRadius: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 500,
        cursor: "pointer",
    },
    navigationButton: {
        fontSize: 24,
        cursor: "pointer",
        padding: "0 12px",
        userSelect: "none",
    },
};

const MeetSomeone = () => {

    const id = useSelector((state: RootState) => state.auth.id);

    const { goTo } = useAppNavigation();

    const { TextArea } = Input;

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

    const handleNext = () => {
        if (current < questions.length - 1) setCurrent(current + 1);
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newAnswers = [...answers];
        newAnswers[current] = e.target.value;
        setAnswers(newAnswers);
    };

    const { loading, error, postData } = usePost<UpdateAppointmentResponse , UpdateAppointmentPayload>('/create-appointments');

    const handleSubmit = async () => {
        try {
            const res = await postData({ requested_by: `${id}` || "", time_slot: "9AM" })
            console.log(res)
            toast.success("Your appointment had be submitted please wait till the admin approves it");
            goTo("/profile")

        } catch (e) {
            console.log(error);
        }
    }

    return <div className="container_margin">
        <Spin spinning={loading}>
            <Row justify={"center"} align={"middle"} >
                <Col span={10} className={styles.MeetingSomeOneFirstRow}>
                    <img className={styles.someOneImage} src={someoneImage} alt="image"></img>
                </Col>
                <Col span={12} className={styles.meetSomeOneHeaderText}>
                    <p className={styles.text_one}>Hey There</p>
                    <p className={styles.text_two}>Reconnect. Relive. Rejoice.✨ </p>
                    <p className={styles.text_three}>Schedule a Moment That Matters!</p>
                </Col>
            </Row>
            <Row justify={"center"} align={"middle"} className={styles.line_wrapper}>
                <div className={styles.line}>

                </div>
            </Row>
            <Row justify={"center"} align={"middle"}>
                <p>Please provide the answer to the question below to get a perfect candidate to talk</p>
            </Row>

            <Row className={styles.question_section}>
                <div style={styles_inline.container}>
                    <div style={styles_inline.navigationButton} onClick={handlePrev}>
                        {current > 0 && "<"}
                    </div>

                    <div style={styles_inline.content}>
                        <h3 style={styles_inline.question}>
                            {current + 1}. {questions[current]}
                        </h3>
                        <TextArea
                            rows={5}
                            placeholder="Please provide your answer here......"
                            value={answers[current]}
                            onChange={handleChange}
                            style={styles_inline.textarea}
                        />
                        <div style={styles_inline.pagination}>
                            {questions.map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...styles_inline.pageIndicator,
                                        backgroundColor: index === current ? "#8e44ad" : "#ccc",
                                        color: index === current ? "#fff" : "#000",
                                    }}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles_inline.navigationButton} onClick={handleNext}>
                        {current < questions.length - 1 && ">"}
                    </div>
                </div>

            </Row>
            <Row justify={"center"} align={"middle"} className={styles.submit_button_wrapper}>
                <Button onClick={handleSubmit}>Submit Request</Button>
            </Row>
        </Spin>
    </div>

}

export default MeetSomeone;