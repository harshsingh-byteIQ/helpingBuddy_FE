import { ReactNode } from "react";
import Profile from "../components/profile";
import Login from "../components/auth/login";
import Register from "../components/auth/register";
import RoleSelect from "../components/auth/roleSelect";
import Question from "../components/auth/collectInfo";
import Contact from "../components/contact";
import Appointments from "../components/appointments";

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
    element: <Profile></Profile>,
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
];

export const globalRoutes: RouterBase[] = [
  
  {
    path: "/",
    element: <Login></Login>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/roles",
    element: <RoleSelect></RoleSelect>,
  },
  {
    path: "/questions",
    element: <Question></Question>,
  },
];
