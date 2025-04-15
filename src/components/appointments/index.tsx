import { useEffect, useState } from "react";
import { ButtonType, MeetingTypes } from "../../utils/Enums";
import Tabs from "../tabs";
import styles from "./appointments.module.scss";
import useFetch from "../../hooks/useFetch";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Spin } from "antd";
import { requestData } from "../../utils/Types";




const Appointments = () => {

  const { data, loading, refetch } = useFetch<[requestData]>(`/get-appointments`);

  const id = useSelector((state: RootState) => state.auth.id)
  const role = useSelector((state: RootState) => state.auth.role)

  const [filteredData, setFitleredData] = useState<any>();

  useEffect(() => {
    if (data) {
      console.log(data)
      const newData = data?.filter((ele: requestData) => {
        return `${id}` === (role === "patient" ? ele?.requested_by : ele?.requested_to)
      })
      setFitleredData(newData);
    }
  }, [data]);



  return (
    <Spin spinning={loading}>
      <div className={`${styles.appointment_wrapper} container_margin`}>
        <h1>
          {
            filteredData?.length <= 0 ? <>Oops , you dont have any  upcoming appointments</> : <>Appointment</>
          }
        </h1>
        {filteredData?.map((ele: requestData) => {
          return (
            <div className={styles.tabs}>
              <Tabs
                meeting_status_type={MeetingTypes.None}
                button_types={ButtonType?.Student}
                name={`${ele?.first_name} ${ele?.last_name}`}
                time={`${ele?.date?.split(".")[0]?.split("T")[0]} ${ele.time_slot}`}
                setReload={() => {
                  refetch()
                }}
              ></Tabs>
            </div>
          );
        })}

      </div>
    </Spin>
  );
};

export default Appointments;
