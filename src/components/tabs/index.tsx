import styles from "./tabs.module.scss";
import img from "../../assets/appointment_profile.png";
import { TabsPropsType } from "../../utils/Types";
import { MeetingTypes } from "../../utils/Enums";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { Modal } from "antd";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Tabs = (Props: TabsPropsType) => {
  const { goTo } = useAppNavigation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


  const handleDelete = async (id: any) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8002/delete-appointment/${id}`);

      if (response.status === 200) {
        toast.success("Appointment deleted successfully!");
      } else {
        toast.warning("Something went wrong while deleting.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the appointment.");
    }
  };

  const handleAllocateStudent = async (id: any) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8002/update-appointments`, {
        id: id,
        requested_to: "14",
      });

      if (response.status === 200) {
        toast.success("Appointment deleted successfully!");
        goTo("/profile")
      } else {
        toast.warning("Something went wrong while deleting.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the appointment.");
    }
  }

  const handleDeleteUser = async (id: any) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8002/delete-user/${id}`);

      if (response.status === 200) {
        toast.success("user deleted successfully!");
        setIsModalOpen(false);
        Props?.setReload()
      } else {
        toast.warning("Something went wrong while deleting.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the user.");
    }

  }

  const getButtonStatusClassName = () => {
    switch (Props?.meeting_status_type) {
      case MeetingTypes?.Postponed:
        return styles?.btn_style_postponded;
      case MeetingTypes?.Scheduled:
        return styles?.btn_style_scheduled;
      case MeetingTypes?.Cancelled:
        return styles?.btn_style_cancelled;
      case MeetingTypes?.None:
        return styles?.btn_style_none;
      default:
        return styles?.btn_style_postponded;
    }
  };

  const getButtonOptions = () => {
    console.log(Props?.button_types)
    switch (Props?.button_types) {
      case "student":
        return <>
          <button className={styles.cancleBtn}>cancel</button>
          <button className={styles.viewProfileBtn} onClick={manageOnClick}>View Profile</button>
        </>

      case "patient":
        return (
          <>
            <button className={styles.viewProfileBtn}>View Request</button>
          </>
        );
      case "admin":
        return (
          <>
            <button className={styles.cancleBtn} onClick={() => {
              setIsModalOpen(true)
            }}>Revoke Access</button>
            <button className={styles.viewProfileBtn} onClick={manageOnClick}>View Profile</button>
          </>
        );
      case "request":
        return (
          <>
            <button className={styles.viewProfileBtn} onClick={() => {
              handleAllocateStudent(Props?.id)
            }}>Confirm</button>
            <button className={styles.cancleBtn} onClick={() => {
              handleDelete(Props?.id)
            }}>Reject Request</button>
          </>
        );
      default:
        return styles?.btn_style_student;
    }
  };



  const manageOnClick = () => {
    goTo("/profile", { "id": Props?.id });
  };

  return (
    <div className={styles.tabs_wrapper}>
      <div className={styles.first_div}>
        <img src={img}></img>
      </div>
      <div className={styles.second_div}>
        <h4>{Props?.name}</h4>
        <p>{Props?.time}</p>
        <div className={getButtonStatusClassName()}>
          <p>
            Postponded
          </p>
        </div>
      </div>
      <div className={styles.third_div}>{getButtonOptions()}</div>
      <Modal
        open={isModalOpen}

        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        onOk={() => handleDeleteUser(Props?.id)}
      >
        Are you sure you want to remove this user from the platform ?
      </Modal>
    </div>
  );
};

export default Tabs;
