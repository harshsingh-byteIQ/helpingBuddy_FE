import { ReactNode } from "react";
import Profile from "../components/profile";
import Login from "../components/auth/login";
import Register from "../components/auth/register";
import RoleSelect from "../components/auth/roleSelect";
import Question from "../components/auth/collectInfo";
import Contact from "../components/contact";
import Appointments from "../components/appointments";
import Certificates from "../components/certificates";
import MeetingDetails from "../components/meetingDetails";
import ManageUsers from "../components/manageUsers";
import Home from "../components/videoCall/home";
import Room from "../components/videoCall/rome";
import ManageRequests from "../components/requests";
import MeetSomeone from "../components/meetsomeone";
import RequestDetails from "../components/requestDetails";

interface RouterBase {
  path: string;
  element: ReactNode;
}

export const proctectedRoutes: RouterBase[] = [
  {
    path: "/profile",
    element: <Profile></Profile>,
  },
  {
    path: "/Appointments",
    element: <Appointments></Appointments>,
  },
  {
    path: "/Certificates",
    element: <Certificates></Certificates>,
  },
  {
    path: "/Settings",
    element: <Profile></Profile>,
  },
  {
    path: "/profile",
    element: <Profile></Profile>,
  },
  {
    path: "/contact",
    element: <Contact></Contact>,
  },
  {
    path: "/about",
    element: <Contact></Contact>,
  },
  {
    path: "/meeting-details",
    element: <MeetingDetails></MeetingDetails>,
  },
  {
    path: "/Manage",
    element: <ManageUsers></ManageUsers>,
  },
  {
    path: "/video",
    element: <Home />,
  },
  {
    path: "/room/:roomCode",
    element: <Room />,
  },
  {
    path: "requests",
    element: <ManageRequests></ManageRequests>
  },
  {
    path: "meet",
    element: <MeetSomeone></MeetSomeone>
  },
  {
    path: "request-details",
    element: <RequestDetails></RequestDetails>
  }
];

export const globalRoutes: RouterBase[] = [
  {
    path: "/",
    element: <Register></Register>,
  },
  {
    path: "/register",
    element: <Login></Login>,
  },
  {
    path: "/questions",
    element: <Question></Question>,
  },
];
