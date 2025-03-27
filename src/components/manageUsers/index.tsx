import { useState } from "react";
import { ButtonType, MeetingTypes } from "../../utils/Enums";
import CustomTabs from "../customComponents/customTabs";
import Tabs from "../tabs";
import styles from "./manageUser.module.scss";

const ManageUsers = () => {

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="container_margin">
      <div style={{ width: "30%" }}>
        <CustomTabs
            
          tabs={[
            {
              label: "Patients",
              content: <></>,
            },
            {
              label: "Students",
              content: <></>,
            },
          ]}
        ></CustomTabs>
      </div>
      <div className={styles.manageUser_users}>
        {[1, 1, 1, 1, 1].map((ele: any, idx: number) => {
          return (
            <div className="tabs">
              <Tabs
                meeting_status_type={
                  idx === 0 ? MeetingTypes?.Postponed : MeetingTypes?.Scheduled
                }
                button_types={ButtonType?.Admin}
              ></Tabs>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageUsers;
