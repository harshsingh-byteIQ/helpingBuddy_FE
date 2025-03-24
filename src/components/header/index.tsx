import { useLocation } from "react-router-dom";
import styles from "./header.module.scss";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const HeaderComponent = () => {
  const location = useLocation();
  const [pageName, setPageName] = useState("Profile");

  useEffect(() => {
    setPageName(location?.pathname?.substring(1, location?.pathname?.length));
  }, [location?.pathname]);

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.navigationBar}> {` < ${pageName} `}</div>
      <div className={styles.iconContainer}>
        <Icon icon="basil:notification-outline" width="28" height="28" />
        <Icon icon="iconamoon:profile-fill" width="28" height="28" />
      </div>
    </div>
  );
};

export default HeaderComponent;
