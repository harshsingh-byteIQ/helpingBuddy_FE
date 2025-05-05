import { useEffect, useState } from "react";
import styles from "./scheduleyourself.module.scss";
import useFetch from "../../hooks/useFetch";
import {
  UpdateAppointmentPayload,
  UpdateAppointmentResponse,
  userDataManageuser,
  userDataWithQNA,
} from "../../utils/Types";
import { Spin, Input, Select, Button, Modal } from "antd";
import img from "../../assets/appointment_profile.png";
import usePost from "../../hooks/usePost";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";

const { Search } = Input;
const { Option } = Select;

const ScheduleYourself = () => {
  const current_id = useSelector((state: RootState) => state.auth.id);

  const [filteredData, setFilteredData] = useState<userDataManageuser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortType, setSortType] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentModalData, setCurrentModalData] = useState<any>();
  const [currentId, setCurrentId] = useState<number>();
  const [selectedSlots, setSelectedSlots] = useState<any>({});

  const handleSlotChange = (userId: any, selectedSlot: any) => {
    setSelectedSlots((prevSlots: any) => ({
      ...prevSlots,
      [userId]: selectedSlot,
    }));
  };

  const {
    data,
    loading,
    refetch,
  } = useFetch<userDataManageuser[]>(`/get-all-user-by-roles/student/${current_id}`, true);

  const {
    data: modalData,
    loading: modalLoading,
    refetch: detailRefetch,
  } = useFetch<userDataWithQNA>(`/user-details-with-description/${currentId}`, false);

  const {
    loading: appointmentSubmitLoading,
    error: appointmentSubmitError,
    postData: appointmentSchedule,
  } = usePost<UpdateAppointmentResponse, UpdateAppointmentPayload>("/create-appointments");

  // Filter + Sort logic
  useEffect(() => {
    if (!data) return;

    let updatedData = data.filter((ele: userDataManageuser) => {
      const nameMatch = `${ele.first_name} ${ele.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const emailMatch = ele.email?.toLowerCase().includes(searchTerm.toLowerCase());
     
      return (nameMatch || emailMatch);
    });

    // Sorting logic
    if (sortType === "scoreHigh") {
      updatedData.sort((a, b) => b.score - a.score);
    } else if (sortType === "scoreLow") {
      updatedData.sort((a, b) => a.score - b.score);
    } else if (sortType === "slotsHigh") {
      updatedData.sort((a, b) => (b.selected_slots?.length || 0) - (a.selected_slots?.length || 0));
    } else if (sortType === "slotsLow") {
      updatedData.sort((a, b) => (a.selected_slots?.length || 0) - (b.selected_slots?.length || 0));
    }

    setFilteredData(updatedData);
  }, [data, searchTerm, genderFilter, statusFilter, sortType]);

  const handleAppointmentSubmit = async (id: number) => {
    if (selectedSlots[`${id}`] === undefined) {
      toast.warning("Please select the slot first");
      return;
    }
    try {
      const AppointmentPayload: UpdateAppointmentPayload = {
        requested_by: `${current_id}`,
        requested_to: `${id}`,
        time_slot: selectedSlots[`${id}`],
      };
      const result = await appointmentSchedule(AppointmentPayload);
      if (result) {
        refetch();
        toast.success("Your Appointment Request Has Been Successfully Submitted");
      }
    } catch (error) {
      console.error(appointmentSubmitError);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setGenderFilter("");
    setStatusFilter("");
    setSortType("");
  };

  const handleShowMore = (id: number) => {
    setIsModalOpen(true);
    setCurrentId(id);
    detailRefetch();
  };

  useEffect(() => {
    if (modalData) {
      setCurrentModalData(modalData?.data.q_n_a_data);
    }
  }, [modalData]);

  return (
    <div className={`container_margin ${styles.sex}`}>
      <Spin spinning={loading || appointmentSubmitLoading}>
        <div
          className={styles.filterSection}
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Search
            placeholder="Search by name or email"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Sort By"
            allowClear
            value={sortType || undefined}
            onChange={(value) => setSortType(value)}
            style={{ width: 300 }}
          >
            <Option value="scoreHigh">Match Score: High to Low</Option>
            <Option value="scoreLow">Match Score: Low to High</Option>
            <Option value="slotsHigh">Available Slots: More to Less</Option>
            <Option value="slotsLow">Available Slots: Less to More</Option>
          </Select>
          <Button onClick={handleReset}>Reset Filters</Button>
        </div>

        <div className={styles.tabs_wrapper}>
          {filteredData?.map((ele: userDataManageuser) => {
            const upcoming = ele?.selected_slots;
            return (
              <div className={styles.tabs} key={ele.id}>
                <div className={styles.first_div}>
                  <img src={img} alt="User" />
                </div>
                <div className={styles.second_div}>
                  <h4>{`${ele?.first_name} ${ele?.last_name}`}</h4>
                  <p>{`${ele?.created_at?.split("T")[0]} - ${ele?.email}`}</p>

                  {upcoming && upcoming.length > 0 && (
                    <div className={styles.availability_wrapper}>
                      <label htmlFor={`availability-select-${ele.id}`} className={styles.availability_label}>
                        🟢 Available Slots:
                      </label>
                      <select
                        id={`availability-select-${ele.id}`}
                        className={styles.availability_select}
                        onChange={(e) => handleSlotChange(ele.id, e.target.value)}
                      >
                        <option value="">Select a slot</option>
                        {upcoming.map((slot: any, index) => (
                          <option
                            key={index}
                            value={`${slot.next_available_date} ${slot.startTime} - ${slot.endTime}`}
                          >
                            {slot.day}, {slot.next_available_date} at {slot.startTime} - {slot.endTime}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <p>
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "2px",
                        marginRight: "5px",
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor:
                          ele?.score >= 75 ? "lightgreen" : ele?.score < 30 ? "red" : "yellow",
                      }}
                      title={
                        ele?.score >= 75
                          ? "Great match"
                          : ele?.score < 30
                          ? "Low match"
                          : "Average match"
                      }
                    ></span>
                    {"Match Score"}: {ele?.score} %
                  </p>
                </div>
                <div className={styles.third_div}>
                  <Button onClick={() => handleShowMore(ele?.id)} className={styles.btn_style_postponded}>
                    Show more details
                  </Button>
                  <Button onClick={() => handleAppointmentSubmit(ele?.id)} className={styles.btn_style_scheduled}>
                    Schedule Meeting
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredData?.length === 0 && <h1>Oops, no users found</h1>}
      </Spin>

      <Modal
        title="Q&A Data"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Spin spinning={modalLoading}>
          <div className={styles.modalTop}>
            {currentModalData?.map((item: any) => (
              <div key={item.question_id} className={styles.modal_internal_styles}>
                <h4 className={styles.h4styles}>Q: {item.content}</h4>
                <p className={styles.pstyles}>
                  <strong>Answer:</strong> <span>{item.answer}</span>
                </p>
              </div>
            ))}
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default ScheduleYourself;
