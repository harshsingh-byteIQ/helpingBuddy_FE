import { ReactNode } from "react";
import { ButtonType, MeetingTypes } from "../utils/Enums";

export interface TabsPropsType {
  meeting_status_type: MeetingTypes;
  button_types: ButtonType;
  name: string;
  time: string;
  id?: number;
  setReload: () => void
}

export interface menuListType {
  title: string;
  lable: string;
  Icon: ReactNode;
  className: string;
}

export interface tabs {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: tabs[];
  activeTab?: number;
  setActiveTab?: (index: number) => void;
  manageTabChange?: () => void;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    access_token: string
    role: string
    id: number
  };
  status_code: number
}

export interface RegisterPayload {
  first_name: string,
  last_name: string,
  email: string,
  contact_no: string,
  password: string,
  role: string,
  selected_slots: JSON
}

export interface RegisterResponse {
  message: string;
  data: {
    access_token: string
    role: string
    id: number
  };
  status_code: number
}

export interface RouterBase {
  path: string;
  element: ReactNode;
}

export interface AuthState {
  role: string | null;
  access_token: string | null
  id: number | null
}


export interface initialStateData {
  name: string,
  isReload: boolean,
}

export interface data_object {
  first_name: string,
  last_name: string,
  email: string,
  contact_no: string,
  role: string,
}

export interface userData {
  message: string,
  data: data_object,
  status_code: number,
}

export interface userDataManageuser {
  first_name: string,
  id: number,
  contact_no: string,
  created_at: string,
  last_name: string,
  email: string,
  role: string,
  selected_slots: []
}

export interface requestData {
  requested_by: string,
  requested_to: string,
  time_slot: string,
  id: number,
  date: string,
  status: string,
  last_name: string,
  first_name: string,
}

export interface requestDataRequest {
  requested_by: string,
  requested_to: string,
  time_slot: string,
  id: number,
  date: string,
  status: string,
  last_name: string,
  first_name: string,
  user_id: number
}

export interface UpdateAppointmentPayload {
  requested_by: string,
  time_slot: string,
  requested_to?: string
}

export interface UpdateAppointmentResponse {

}

export interface getQuestionResponse {
  question_id: number,
  content: string
  question_for: string
  question_type: string,
  options?: string[]
}

export interface getQuestionPayload {

}

export interface AnswerSubmitResponse {
  message: string,
  status_code: number,
  data: []
}

export interface AnswerType {
  question_id: number,
  user_id: number
  answer: string
}

export interface AnswerSubmitPayload {
  answer: AnswerType[]
}

export interface SendEmailPayload {
  username: string,
  email: string,
  password: string
}

export interface SendEmailResponse {
  message: string
}

export interface q_n_a {
  question_id: number,
  answer: string,
  user_id: number,
  content: string,
}

export interface userDataWithQNAData {
  first_name: string,
  last_name: string,
  email: string,
  contact_no: string,
  role: string,
  q_n_a_data: q_n_a[]
}

export interface userDataWithQNA {
  status_code: number,
  message: string,
  data: userDataWithQNAData
}