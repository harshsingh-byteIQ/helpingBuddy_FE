
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import img from "../../assets/appointment_profile.png";
import styles from "./requests.module.scss";
import { Modal, Spin } from "antd";
import { requestDataRequest, UpdateAppointmentPayload, UpdateAppointmentResponse } from "../../utils/Types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { toast } from "react-toastify";
import { baseURL } from "../../utils/axios";
import usePost from "../../hooks/usePost";



const ManageRequests = () => {

  const id = useSelector((state: RootState) => state.auth.id)

  const [selectedCandidateId, setSelectedCandidateId] = useState<any>(null);

  const handleSelection = (id: any) => {
    setSelectedCandidateId(id);
  };

  const { data, loading } = useFetch<[requestDataRequest]>(`/get-appointment-requests/${id}`);

  const [isModalOpen, setModalOpen] = useState(false);

  const [matchData, setMatchData] = useState<any>();

  const [optionLoading, setOptionLoading] = useState(false);

  const [filteredData, setFilteredData] = useState<any>();

  const [requestedBy, setRequestedBy] = useState<any>();

  const {
    loading: appointmentSubmitLoading,
    error: appointmentSubmitError,
    postData: appointmentSchedule,
  } = usePost<UpdateAppointmentResponse, UpdateAppointmentPayload>("/create-appointments");


  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const handleDelete = async (id: any) => {
    console.log(appointmentSubmitLoading)
    try {
      const response = await axios.delete(`${baseURL}delete-appointment/${id}`);

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

  const handleAllocateStudent = async () => {
    try {
      const AppointmentPayload: UpdateAppointmentPayload = {
        "requested_by": `${requestedBy}`,
        "requested_to": `${selectedCandidateId.id}`,
        "time_slot": `${selectedCandidateId?.selected_slots?.[0]?.next_available_date} ${selectedCandidateId?.selected_slots?.[0]?.startTime} - ${selectedCandidateId?.selected_slots?.[0]?.endTime}`
      }

      console.log(AppointmentPayload)
      const result = await appointmentSchedule(AppointmentPayload);
      if (result) {
        toast.success("Your Appointment Request Had Been Successfully submitted");
      }
    } catch (error) {
      console.log(appointmentSubmitError)
    }

  }

  const getMatchData = async (id: string) => {
    try {
      setOptionLoading(true)
      setModalOpen(true);
      setRequestedBy(id)
      const response = await axios.get(`${baseURL}get-perfect-candidate/${id}`)
      setMatchData(response?.data);
    } catch (error) {
      console.error(error)
    } finally {
      setOptionLoading(false)
    }
  }
  function formatDateTime(isoString: string) {
    const date = new Date(isoString);

    const options: any = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  }


  return (
    <Spin spinning={loading}>
      <div className="container_margin">
        <div className={styles.control_text_styles}>
          <p>{
            filteredData?.length <= 0 ? <>Oops , No request for Now</> : <>Request Panal</>
          }</p>
        </div>
        <div className={styles.manageUser_users}>
          {filteredData?.map((ele: requestDataRequest) => {
            return (
              <div className="tabs">
                <div className={styles.tabs_wrapper}>
                  <div className={styles.first_div}>
                    <img src={img}></img>
                  </div>
                  <div className={styles.second_div}>
                    <h4>{`${ele?.first_name} ${ele?.last_name}`}</h4>
                    <p>{`Requested at :  ${formatDateTime(ele?.date)}`}</p>
                  </div>
                  <div className={styles.third_div}>{
                    <>
                      <button className={styles.viewProfileBtn} onClick={() => {
                        getMatchData(ele?.requested_by)
                      }}>Confirm</button>
                      <button className={styles.cancleBtn} onClick={() => {
                        handleDelete(ele?.id)
                      }}>Reject Request</button>
                    </>}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
        onCancel={() => {
          setModalOpen(false)
        }}
        onOk={() => {
          handleAllocateStudent()
        }}
        loading={optionLoading}
      >
        <div style={{ fontFamily: "sans-serif" }}>
          <h2 style={{ marginBottom: "24px" }}>
            Here are top {matchData?.length} Recommendation{matchData?.length > 1 ? "s" : ""} for You
          </h2>

          <div style={{ display: "grid", gap: "16px" }}>
            {matchData?.map((candidate: any, index: number) => (
              <div
              
                style={{
                  border: selectedCandidateId?.id === candidate.id ? "2px solid #00338d" : "1px solid #ccc",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: selectedCandidateId?.id === candidate.id ? "0 0 10px rgba(0, 51, 141, 0.3)" : "0 0 5px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  backgroundColor: selectedCandidateId?.id === candidate.id ? "#f0f6ff" : "#fff"
                }}
              >
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="recommended_candidate"
                    value={candidate.id}
                    checked={selectedCandidateId?.id === candidate.id}
                    onChange={() => handleSelection(candidate)}
                    style={{ marginTop: "6px" }}
                  />

                  <div>
                    <h3 style={{ margin: "0 0 8px 0", color: "#00338d" }}>
                      {index + 1}. {candidate.first_name} {candidate.last_name}
                    </h3>
                    <p style={{ margin: "4px 0" }}><strong>Match Score:</strong> {candidate.score}%</p>
                    <p style={{ margin: "4px 0" }}><strong>Email:</strong> {candidate.email}</p>
                    <p style={{ margin: "4px 0" }}><strong>Contact:</strong> {candidate.contact_no}</p>

                    {candidate.selected_slots?.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <strong>Available Slot{candidate.selected_slots.length > 1 ? "s" : ""}:</strong>
                        <ul style={{ marginTop: "4px", paddingLeft: "16px" }}>
                          {candidate.selected_slots.map((slot: any, i: number) => (
                            <li key={i}>
                              {slot.day}: {slot.startTime} – {slot.endTime} <br />
                              <em>Next available: {slot.next_available_date}</em>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

      </Modal>
    </Spin>
  );
};

export default ManageRequests;
