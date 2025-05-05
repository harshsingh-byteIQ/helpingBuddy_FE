// ChatbotTrigger.tsx
import styles from "./floatingbtn.module.scss";
import { useState, useEffect } from 'react';
import { Button, FloatButton, Input, Modal, Table, Avatar, List, Space } from 'antd';
import { MessageOutlined, UserOutlined, RobotOutlined, PlayCircleOutlined } from '@ant-design/icons';
import usePost from "../../hooks/usePost";
import { ChatBotPayload, ChatBotResponse, musicResponse } from "../../utils/Types";
import { toast } from 'react-toastify';
import { MusicCols, QuestionAnswerCols } from "../../utils/string";

const MUSIC_URL = `/ytMusic`;
const QUESTION_URL = `question`;

interface Message {
  type: 'bot' | 'user';
  content: string | React.ReactNode;
  options?: string[];
}

const ChatbotTrigger = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [dataSource, setDataSource] = useState<musicResponse[] | any>();
  const [isVideoModalVisible, setIsVideoModalVisible] = useState<boolean>(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");

  const musicPost = usePost<ChatBotResponse, ChatBotPayload>(MUSIC_URL);
  const questionPost = usePost<any, ChatBotPayload>(QUESTION_URL);

  useEffect(() => {
    if (isModalVisible && messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          content: 'Hello! How can I help you today?',
          options: ['Music Recommendation', 'Question Generation']
        }
      ]);
    }
  }, [isModalVisible, messages.length]);

  const showChatbot = () => {
    setIsModalVisible(true);
  };

  const hideChatbot = () => {
    setIsModalVisible(false);
    setMessages([]);
    setSelectedTab("");
    setInputValue("");
  };

  const handleOptionSelect = (option: string) => {
    const optionMap: Record<string, string> = {
      'Music Recommendation': 'music',
      'Question Generation': 'questions'
    };
    
    const selectedOption = optionMap[option];
    setSelectedTab(selectedOption);
    
    setMessages(prev => [...prev, {
      type: 'user',
      content: option
    }]);
    
    const promptMessage = selectedOption === 'music' 
      ? 'Please provide a song name, and I\'ll recommend similar music:' 
      : 'Please provide a keyword related to your topic, and I\'ll generate relevant questions:';
    
    setMessages(prev => [...prev, {
      type: 'bot',
      content: promptMessage
    }]);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      toast.warning("Please enter some text");
      return;
    }

    setMessages(prev => [...prev, {
      type: 'user',
      content: inputValue
    }]);

    try {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Looking for results...'
      }]);

      const payload = selectedTab === "music" ? { song: inputValue } : { keyword: inputValue };
      const result = selectedTab === "music" 
        ? await musicPost.postData(payload) 
        : await questionPost.postData(payload);

      if (result?.status_code === 200) {
        setMessages(prev => prev.slice(0, -1));
        
        if (selectedTab === "questions") {
          const tableData = result.data?.questions.map((question: string, index: number) => ({
            key: index,
            serial: index + 1,
            question,
            answer: result.data?.answers[index]
          }));
          
          setDataSource(tableData);
          
          setMessages(prev => [...prev, {
            type: 'bot',
            content: (
              <div className={styles.results_container}>
                <p>Here are the questions and answers based on your keyword:</p>
                <Table 
                  dataSource={tableData}
                  columns={QuestionAnswerCols}
                  pagination={{ pageSize: 5 }}
                  size="small"
                />
              </div>
            )
          }]);
        } else {
          // Handle the actual API response format which only has title and url
          const musicData = result?.data.map((item: any, index: number) => ({
            key: index,
            serial: index + 1,
            title: item.title,
            url: item.url, // Use the correct property 'url' from the API response
            // Add placeholders for missing fields
            thumbnail: `https://i.ytimg.com/vi/${extractVideoId(item.url)}/default.jpg`, // Generate thumbnail from YouTube video ID
            artist: '',
            duration: ''
          }));
          
          setDataSource(musicData);
          
          setMessages(prev => [...prev, {
            type: 'bot',
            content: (
              <div className={styles.results_container}>
                <p>Here are some music recommendations for you:</p>
                <List
                  itemLayout="horizontal"
                  dataSource={musicData}
                  renderItem={(item: any, index: number) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="primary" 
                          icon={<PlayCircleOutlined />}
                          onClick={() => playVideo(item.url)}
                        >
                          Play
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          item.thumbnail ? 
                          <Avatar src={item.thumbnail} /> : 
                          <Avatar icon={<PlayCircleOutlined />} />
                        }
                        title={`${index + 1}. ${item.title}`}
                        description="YouTube video"
                      />
                    </List.Item>
                  )}
                />
              </div>
            )
          }]);
        }
      
        setInputValue("");
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev.slice(0, -1), {
        type: 'bot',
        content: 'Sorry, there was an error processing your request. Please try again.'
      }]);
    }
  };

  // Helper function to extract YouTube video ID from different URL formats
  const extractVideoId = (url: string): string => {
    if (!url) return '';
    
    try {
      // Handle youtube.com/watch?v= format
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v') || '';
      } 
      // Handle youtu.be/ format
      else if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        if (parts.length > 1) {
          return parts[1].split('?')[0].split('&')[0];
        }
      }
    } catch (e) {
      console.error("Error extracting video ID:", e);
    }
    
    return '';
  };

  const playVideo = (url: string) => {
    if (!url) {
      toast.error("Video URL is missing");
      return;
    }

    try {
      const videoId = extractVideoId(url);
      
      if (!videoId) {
        toast.error("Could not process video URL");
        return;
      }
      
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      console.log("Playing video:", embedUrl);
      setCurrentVideoUrl(embedUrl);
      setIsVideoModalVisible(true);
    } catch (error) {
      console.error("Error processing video URL:", error);
      toast.error("Failed to play video");
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
            <RobotOutlined /> Chat Bot
          </div>
        }
        open={isModalVisible}
        onCancel={hideChatbot}
        footer={null}
        style={{ top: 'auto', right: 0, bottom: 10, margin: 0, position: 'fixed', maxHeight:"70vh", overflowY:"scroll" }}
      >
        <div className={styles.chat_container}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`${styles.message} ${message.type === 'bot' ? styles.bot_message : styles.user_message}`}
            >
              <div className={styles.message_avatar}>
                {message.type === 'bot' ? <RobotOutlined /> : <UserOutlined />}
              </div>
              <div className={styles.message_content}>
                {typeof message.content === 'string' ? message.content : message.content}
                
                {message.options && (
                  <Space direction="vertical" style={{ width: '100%', marginTop: '12px' }}>
                    {message.options.map((option, idx) => (
                      <Button 
                        key={idx} 
                        onClick={() => handleOptionSelect(option)}
                        block
                      >
                        {option}
                      </Button>
                    ))}
                  </Space>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedTab && !musicPost.loading && !questionPost.loading && (
          <div className={styles.input_container}>
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={selectedTab === "music" ? "Enter song name..." : "Enter keyword..."}
              onPressEnter={handleSubmit}
            />
            <Button type="primary" onClick={handleSubmit}>
              Send
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        title="Video Player"
        open={isVideoModalVisible}
        onCancel={() => setIsVideoModalVisible(false)}
        footer={null}
        width="800px"
        centered
        destroyOnClose={true}
      >
        <div className={styles.video_container}>
          {currentVideoUrl && (
            <iframe
              src={currentVideoUrl}
              width="100%"
              height="450"
              allowFullScreen
              frameBorder="0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ChatbotTrigger;