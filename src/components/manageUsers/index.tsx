import { useEffect, useState } from "react";
import { ButtonType, MeetingTypes } from "../../utils/Enums";
import CustomTabs from "../customComponents/customTabs";
import Tabs from "../tabs";
import styles from "./manageUser.module.scss";
import useFetch from "../../hooks/useFetch";
import { Spin } from "antd";
import { userDataManageuser } from "../../utils/Types";


const ManageUsers = () => {

  const [activeTab, setActiveTab] = useState(0);
  const [filteredData, setFilteredData] = useState<any>();
  const { data, loading, refetch } = useFetch<[userDataManageuser]>(`/all-user`, true);


  useEffect(() => {
    const newData = data?.filter((ele: userDataManageuser) => {
      return ele?.role === (activeTab === 0 ? "patient" : "student")
    })
    setFilteredData(newData);
  }, [activeTab, data])




  return (
    <Spin spinning={loading}>
      <div className="container_margin">
        <div className={styles.control_text_styles}>
          <p>User Control Panel</p>
        </div>
        <div style={{ width: "30%" }}>
          <CustomTabs
            setActiveTab={setActiveTab}
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
          {filteredData?.map((ele: userDataManageuser) => {
            return (
              <div className="tabs">
                <Tabs
                  meeting_status_type={
                    MeetingTypes.None
                  }
                  button_types={ButtonType?.Admin}
                  name={`${ele?.first_name} ${ele?.last_name}`}
                  time={`${ele?.created_at?.split("T")[0]} - ${ele?.email}`}
                  
                  id={ele?.id}
                  setReload={() => {
                    refetch()
                  }}
                ></Tabs>
              </div>
            );
          })}
          {
            filteredData?.length <= 0 && (
              <h1>
                Oops , No users found
              </h1>
            )
          }
        </div>
      </div>
    </Spin>
  );
};

export default ManageUsers;
