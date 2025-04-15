import { useEffect, useState } from "react";
import styles from "./scheduleyourself.module.scss";
import useFetch from "../../hooks/useFetch";
import { UpdateAppointmentPayload, UpdateAppointmentResponse, userDataManageuser, userDataWithQNA } from "../../utils/Types";
import { Spin, Input, Select, Button, Modal } from "antd";
import img from "../../assets/appointment_profile.png";
import usePost from "../../hooks/usePost";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from 'react-toastify';

const { Search } = Input;
const { Option } = Select;

const ScheduleYourself = () => {
    const current_id = useSelector((state: RootState) => state.auth.id)
    const [filteredData, setFilteredData] = useState<userDataManageuser[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [genderFilter, setGenderFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
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

    const { data, loading , refetch } = useFetch<userDataManageuser[]>(`/get-all-user-by-roles/student`, true);
    const { data: modalData, loading: modalLoading } = useFetch<userDataWithQNA>(`/user-details-with-description/${currentId}`, true);
    const { loading: appointmentSubmitLoading, error: appointmentSubmitError, postData: appointmentSchedule } = usePost<UpdateAppointmentResponse, UpdateAppointmentPayload>('/create-appointments');

    useEffect(() => {
        if (!data) return;
        const newData = data.filter((ele: userDataManageuser) => {
            const nameMatch = `${ele.first_name} ${ele.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
            const emailMatch = ele.email?.toLowerCase().includes(searchTerm.toLowerCase());
            return (nameMatch || emailMatch);
        });

        setFilteredData(newData);
    }, [data, searchTerm, genderFilter, statusFilter]);


    const handleAppointmentSubmit = async (id: number) => {
        if (selectedSlots[`${id}`] === undefined) {
            toast.warning("Please select the slot first")
        }
        try {
            const AppointmentPayload: UpdateAppointmentPayload = {
                "requested_by": `${current_id}`,
                "requested_to": `${id}`,
                "time_slot": selectedSlots[`${id}`]
            }
            const result = await appointmentSchedule(AppointmentPayload);
            if(result){
                refetch()
            }
            toast.success("Your Appointment Request Had Been Successfully submitted");
        } catch (error) {
            console.log(appointmentSubmitError)
        }

    }

    const handleReset = () => {
        setSearchTerm("");
        setGenderFilter("");
        setStatusFilter("");
    };

    const handleShowMore = (id: number) => {
        setIsModalOpen(true);
        setCurrentId(id)
    }

    useEffect(() => {
        if (modalData) {
            setCurrentModalData(modalData?.data.q_n_a_data)
        }
    }, [modalData])

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
                        placeholder="Filter by Gender"
                        allowClear
                        value={genderFilter || undefined}
                        onChange={(value) => setGenderFilter(value)}
                        style={{ width: 180 }}
                    >
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                    <Select
                        placeholder="Filter by Status"
                        allowClear
                        value={statusFilter || undefined}
                        onChange={(value) => setStatusFilter(value)}
                        style={{ width: 180 }}
                    >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
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
                                                {upcoming.map((slot : any, index) => (
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


                                </div>
                                <div className={styles.third_div}>
                                    <Button onClick={() => handleShowMore(ele?.id)} className={styles.btn_style_postponded}>Show more details</Button>
                                    <Button onClick={() => handleAppointmentSubmit(ele?.id)} className={styles.btn_style_scheduled}>Schedule Meeting</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredData?.length === 0 && (
                    <h1>Oops, no users found</h1>
                )}

            </Spin>
            <Modal
                title="Q&A Data"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false)
                }}
                footer={null}
                width={600}
            >
                <Spin spinning={modalLoading}>
                    <div className={styles.modalTop}>
                        {currentModalData?.map((item: any) => (
                            <div
                                key={item.question_id}
                                className={styles.modal_internal_styles}
                            >
                                <h4 className={styles.h4styles}>
                                    Q: {item.content}
                                </h4>
                                <p className={styles.pstyles}>
                                    <strong >Answer:</strong>{' '}
                                    <span >{item.answer}</span>
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
