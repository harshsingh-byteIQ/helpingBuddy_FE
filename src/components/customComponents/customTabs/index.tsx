import { useState } from "react";
import { tabs, TabsProps } from "../../../utils/Types";
import styles from "./customTabs.module.scss";

const CustomTabs = (props: TabsProps) => {

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabs_header}>
        {props?.tabs.map((tab: tabs, index) => (
          <div
            key={index}
            className={`${styles.tab_Items} ${
              activeTab === index ? `${styles.active}` : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className={styles.tabs_content}>
        {props?.tabs[activeTab].content}
      </div>
    </div>
  );
};

export default CustomTabs;
