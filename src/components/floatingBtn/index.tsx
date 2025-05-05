// ChatbotTrigger.tsx
import styles from "./floatingbtn.module.scss"
import  { useState } from 'react';
import { Button, FloatButton, Input, Modal, Table } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import usePost from "../../hooks/usePost";
import { ChatBotPayload, ChatBotResponse, musicResponse } from "../../utils/Types";
import { toast } from 'react-toastify';
import { MusicCols, QuestionAnswerCols } from "../../utils/string";

const MUSIC_URL = `/ytMusic`
const QUESTION_URL = `question`




const ChatbotTrigger = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const musicPost = usePost<ChatBotResponse, ChatBotPayload>(MUSIC_URL);
  const questionPost = usePost<any, ChatBotPayload>(QUESTION_URL);


  const [selectedTab, setSelectedTab] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<musicResponse[] | any>()

  const showChatbot = () => {
    setIsModalVisible(true);
  };

  const hideChatbot = () => {
    setIsModalVisible(false);
    setSelectedTab("")
    setIsDataFetched(false)
  };

  const handleSubmit = async () => {
    try {
      const payload = selectedTab === "music" ? { song: inputValue } : { keyword: inputValue };
      const result = selectedTab === "music" ? await musicPost.postData(payload) : await questionPost.postData(payload);

      if (result?.status_code === 200) {
        toast.success("Data fetched successful!");
        setIsDataFetched(true);

        if (selectedTab === "questions") {
          const tableData = result.data?.questions.map((question: string, index: number) => ({
            key: index,
            question,
            answer: result.data?.answers[index]
          }));
          setDataSource(tableData);
        } else {
          setDataSource(result?.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        onClick={showChatbot}
        style={{ right: 24, bottom: 24 }}
      />

      <Modal
        title={
          <div className={styles.title_Styles}>
            Chat Bot
          </div>
        }
        open={isModalVisible}
        onCancel={hideChatbot}
        footer={null}
        width={"60vw"}
        loading={musicPost?.loading || questionPost.loading}
      >
        {
          selectedTab === "" ? <div className={styles.select_mode}>
            <p>
              What you are looking for ?
            </p>
            <div className={styles.btn_wrapper}>
              <Button onClick={() => setSelectedTab("music")}>Music Recommendation</Button>
              <Button onClick={() => setSelectedTab("questions")}>Question Generation</Button>
            </div>
          </div> : <div className={styles.select_mode}>
            <p>
              {
                selectedTab === "music" ? "Please proive us the song name" : "Please provide a key word related to you topic"
              }
            </p>
            <div className={styles.btn_wrapper}>
              {isDataFetched == false ? <>
                <Input onChange={(e) => setInputValue(e.target.value)} type="text"></Input>
                <Button onClick={handleSubmit}> Submit</Button>
              </> : <>
                <Table

                  dataSource={dataSource}
                  columns={selectedTab === "music" ? MusicCols : QuestionAnswerCols}
                ></Table>
              </>
              }
            </div>
          </div>
        }

      </Modal>
    </>
  );
};

export default ChatbotTrigger;
