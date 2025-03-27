import { ReactNode } from "react";
import { ButtonType, MeetingTypes } from "../utils/Enums";

export interface TabsPropsType {
  meeting_status_type: MeetingTypes;
  button_types: ButtonType;
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
  manageTabChange?: () => void;
  activeTab?: number;
  setActiveTab?: (index: number) => void;
}

export interface TabsProps {
  tabs: tabs[];
}
