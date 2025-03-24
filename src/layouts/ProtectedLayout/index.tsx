import { Layout } from "antd";
import styles from "../layout.module.scss";
import { useOutlet } from "react-router-dom";
import SideBar from "../../components/sideBar";
import HeaderComponent from "../../components/header";

const { Content, Header, Sider } = Layout;

const ProtectedLayout = () => {
  const outlet = useOutlet();

  return (
    <Layout className={styles.layoutWrapper}>
      <Sider width={"18%"}>
        <div className={styles.sideBarWrapper}>
          <SideBar></SideBar>
        </div>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerWrapper}>
            <HeaderComponent></HeaderComponent>
          </div>
        </Header>
        <Content className={styles.content_wrapper_protected}>
          <div className={styles.template}>{outlet}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProtectedLayout;
