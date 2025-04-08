import { ReactNode } from "react";
import { ButtonType, MeetingTypes } from "../utils/Enums";

export interface TabsPropsType {
  meeting_status_type: MeetingTypes;
  button_types: ButtonType;
  name : string;
  time : string;
  id ? : number;
  setReload : () =>  void
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
