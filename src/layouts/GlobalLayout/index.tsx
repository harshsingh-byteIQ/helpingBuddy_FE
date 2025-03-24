import { Layout } from "antd";
import styles from "../layout.module.scss";
import { useOutlet } from "react-router-dom";

const GlobalLayout = () => {
  const outlet = useOutlet();
  const { Content } = Layout;

  return (
    <Layout>
      <Content className={styles.content_wrapper_global}>
        <div className={styles.template}>{outlet}</div>
      </Content>
    </Layout>
  );
};

export default GlobalLayout;
