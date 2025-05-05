import { Layout } from "antd";
import styles from "../layout.module.scss";
import { useLocation, useOutlet } from "react-router-dom";
import SideBar from "../../components/sideBar";
import HeaderComponent from "../../components/header";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { manageChange } from "../../redux/sidebarSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { toast } from "react-toastify";
import ChatbotTrigger from "../../components/floatingBtn";

const { Content, Header, Sider } = Layout;

const ProtectedLayout = () => {
  const outlet = useOutlet();
  const location = useLocation();
  const dispatch = useDispatch();

  const role = useSelector((state: RootState) => state.auth.role)
  const access_token = useSelector((state: RootState) => state.auth.access_token)
  const { goTo } = useAppNavigation();

  const handleSecureRoutes = () => {
    if (role === null || access_token === null) {
      toast.warning("Please login before moving inside the application")
      goTo("/")
    }
  }

  useEffect(() => {
    handleSecureRoutes();
  }, [role, access_token])


  if (!role || !access_token) return null;


  useEffect(() => {
    dispatch(manageChange({ name: location?.pathname?.substring(1, location?.pathname?.length), isReload: false }));
    console.log("texting")
  }, [location?.pathname])

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
      <ChatbotTrigger />
    </Layout>
  );
};

export default ProtectedLayout;
