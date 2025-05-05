import { useEffect, useState } from "react";
import styles from "./appointments.module.scss";
import useFetch from "../../hooks/useFetch";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Spin } from "antd";
import { requestData } from "../../utils/Types";
import img from "../../assets/appointment_profile.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { baseURL } from "../../utils/axios";



const Appointments = () => {


  const { goTo } = useAppNavigation();
  const id = useSelector((state: RootState) => state.auth.id)
  const role = useSelector((state: RootState) => state.auth.role)
  const { data, loading, refetch } = useFetch<[requestData]>(`/appointment-by-role/${role}`);
  const [createRoomLoading, setCreateRoomLoading] = useState(false);
  const [joinRoomLoading, setJoinRoomLoading] = useState(false);
  const [filteredData, setFitleredData] = useState<any>();
  const [roomCodeError, setRoomCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${baseURL}/delete-appointment/${id}`);
      if (response.status === 200) {
        refetch()
        toast.success("user deleted successfully!");
      } else {
        toast.warning("Something went wrong while deleting.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the user.");
    }
  }

  useEffect(() => {
    console.log(roomCodeError,passwordError,setJoinRoomLoading)
    if (data) {
      const newData = data?.filter((ele: requestData) => {
        return ele?.time_slot !== "" && `${id}` === (role === "patient" ? ele?.requested_by : ele?.requested_to)
      })
      setFitleredData(newData);
    }
  }, [data]);


  const callLoading = createRoomLoading || joinRoomLoading;

  const handleCreateRoom = async (roomCode: string, password: string, id: any) => {
    try {
      setRoomCodeError("");
      setPasswordError("");
      setCreateRoomLoading(true);

      const response = await fetch(`https://video-call-be-6eie.onrender.com/room/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomCode, password }),
      });

      const data = await response.json();
      if (!data.status) {
        if (data.errors) {
          Object.keys(data.errors).forEach((error) => {
            if (error === "roomCode") setRoomCodeError(data.errors[error]);
            if (error === "password") setPasswordError(data.errors[error]);
          });

          setCreateRoomLoading(false);
          return;
        }

        throw new Error(data.message);
      }

      localStorage.setItem("password", password);
      goTo(`/room/${roomCode}`, { "id": id });
    } catch (error: any) {
      setPasswordError(error.message);
    }

    setCreateRoomLoading(false);
  };

  function isNowInTimeslot(timeslot: string) {
    // const [startStr, endStr] = timeslot.split(" - ");
    // const date = startStr.split(" ")?.[0];
    // const start = new Date(startStr.trim());
    // const end = new Date(`${date} ${endStr.trim()}`);
    // const now = new Date();
    // console.log(start, ",", end, now)
    // return now >= start && now <= end;
    console.log(timeslot)
    return true
  }

  const verifySlots = async (roomCode: string, slot: string, id: any) => {
    if (isNowInTimeslot(slot)) {
      handleCreateRoom(roomCode, roomCode, id)
    } else {
      toast.error("Yon can only join the meeting in the allocated time .")
    }
  }


  return (
    <Spin spinning={loading || callLoading}>
      <div className={`${styles.appointment_wrapper} container_margin`}>
        <h1>
          {
            filteredData?.length <= 0 ? <>Oops , you dont have any  upcoming appointments</> : <>Appointment</>
          }
        </h1>
        <div className={styles.tabs_wrapper}>
          {filteredData?.map((ele: requestData) => {
            return (
              <div className={styles.tabs} key={ele.id}>
                <div className={styles.first_div}>
                  <img src={img} alt="User" />
                </div>
                <div className={styles.second_div}>
                  <h4>{`${ele?.first_name} ${ele?.last_name}`}</h4>
                  <p>{`${ele?.time_slot?.split("T")[0]}`}</p>
                </div>
                <div className={styles.third_div}>
                  <Button className={styles.btn_style_postponded}>Show more details</Button>
                  <Button className={styles.btn_style_scheduled} onClick={() => {
                    const passCode = `${ele?.requested_by} ${ele.requested_to}`
                    verifySlots(passCode, ele?.time_slot?.split("T")[0], ele?.id)
                  }}>Join The Meeting</Button>
                  <Button onClick={() => handleDelete(ele?.id)} className={styles.btn_style_cancelled}>Cancel Meeting</Button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Spin>
  );
};

export default Appointments;
