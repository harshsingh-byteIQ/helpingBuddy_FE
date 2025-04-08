
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { ButtonType, MeetingTypes } from "../../utils/Enums";
import Tabs from "../tabs";
import styles from "./requests.module.scss";
import { Spin } from "antd";
import axios from "axios";

interface requestData {
  requested_by: string,
  requested_to: string,
  time_slot: string,
  id: number,
  date: string,
  status: string,
  last_name: string,
  first_name: string,
  user_id:number
}

const ManageRequests = () => {

  const { data, loading, error, refetch } = useFetch<[requestData]>(`/get-appointments`);

  const [filteredData, setFilteredData] = useState<any>();

  useEffect(() => {
    if (data) {
      console.log(data)
      const newData = data?.filter((ele: requestData) => {
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
          {filteredData?.map((ele: requestData, idx: number) => {

            return (
              <div className="tabs">
                <Tabs
                  meeting_status_type={MeetingTypes?.None}
                  button_types={ButtonType?.Request}
                  name={`${ele?.first_name} ${ele?.last_name}`}
                  time={`${ele?.date?.split(".")[0]?.split("T")[0]} ${ele.time_slot}`}
                  id={ele?.id}
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
