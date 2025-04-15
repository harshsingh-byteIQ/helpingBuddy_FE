
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { ButtonType, MeetingTypes } from "../../utils/Enums";
import Tabs from "../tabs";
import styles from "./requests.module.scss";
import { Spin } from "antd";
import { requestDataRequest } from "../../utils/Types";



const ManageRequests = () => {

  const { data, loading } = useFetch<[requestDataRequest]>(`/get-appointments`);

  const [filteredData, setFilteredData] = useState<any>();

  useEffect(() => {
    if (data) {
      console.log(data)
      const newData = data?.filter((ele: requestDataRequest) => {
        return ele?.status === "initiated"
      })
      setFilteredData(newData);
    }
  }, [data]);



  return (
    <Spin spinning={loading}>

      <div className="container_margin">
        <div className={styles.control_text_styles}>
          <p>{
            filteredData?.length <= 0 ? <>Oops , No request for Now</> : <>Request Panal</>
          }</p>
        </div>

        <div className={styles.manageUser_users}>
          {filteredData?.map((ele: requestDataRequest, idx: number) => {

            return (
              <div className="tabs">
                <Tabs
                  meeting_status_type={MeetingTypes?.None}
                  button_types={ButtonType?.Request}
                  name={`${ele?.first_name} ${ele?.last_name}`}
                  time={`${ele?.date?.split(".")[0]?.split("T")[0]} ${ele.time_slot}`}
                  id={ele?.id}
                  setReload={() => {}}
                ></Tabs>
              </div>
            );
          })}
        </div>
      </div>
    </Spin>
  );
};

export default ManageRequests;
