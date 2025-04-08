import styles from "./header.module.scss";
import { Icon } from "@iconify/react";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { manageChange } from "../../redux/sidebarSlice";


const HeaderComponent = () => {

  const pageName = useSelector((state: RootState) => state?.sidebar?.name)
  const { goTo } = useAppNavigation();
  const dispatch = useDispatch();


  const handleNavigation = () => {
    dispatch(manageChange({ name: "Profile", isReload: true }));
    goTo("Profile")
  }

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.navigationBar}> {` < ${pageName} `}</div>
      <div className={styles.iconContainer}>
        <Icon icon="basil:notification-outline" width="28" height="28" />
        <Icon icon="iconamoon:profile-fill" width="28" height="28" onClick={handleNavigation} />
      </div>
    </div>
  );
};

export default HeaderComponent;
