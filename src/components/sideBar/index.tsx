import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import styles from "./sideBar.module.scss";
import { menuListType } from "../../utils/Types";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { clearRole } from "../../redux/authSlice";


const StudentSideBarOption: menuListType[] = [
  {
    title: "Profile",
    lable: "Profile",
    Icon: (
      <Icon
        className={styles.icon}
        icon="iconamoon:profile-fill"
        width="24"
        height="24"
      />
    ),
    className: `${styles.active}`,
  },
  {
    title: "Appointments",
    lable: "Appointments",
    Icon: (
      <Icon
        className={styles.icon}
        icon="teenyicons:appointments-outline"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Certificates",
    lable: "Certificates",
    Icon: (
      <Icon
        className={styles.icon}
        icon="ph:certificate"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "About us",
    lable: "About",
    Icon: (
      <Icon className={styles.icon} icon="ix-about" width="24" height="24" />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Contact us",
    lable: "Contact",
    Icon: (
      <Icon
        className={styles.icon}
        icon="material-symbols:contact-support-outline-rounded"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Settings",
    lable: "Settings",
    Icon: (
      <Icon
        className={styles.icon}
        icon="material-symbols:settings-outline-rounded"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
]
const PatientsSideBarOption: menuListType[] = [
  {
    title: "Profile",
    lable: "Profile",
    Icon: (
      <Icon
        className={styles.icon}
        icon="iconamoon:profile-fill"
        width="24"
        height="24"
      />
    ),
    className: `${styles.active}`,
  },
  {
    title: "Appointments",
    lable: "Appointments",
    Icon: (
      <Icon
        className={styles.icon}
        icon="teenyicons:appointments-outline"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Meet someone",
    lable: "meet",
    Icon: (
      <Icon
        className={styles.icon}
        icon="ph:certificate"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Explore Students",
    lable: "Explore",
    Icon: (
      <Icon
        className={styles.icon}
        icon="ph:certificate"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "About us",
    lable: "About",
    Icon: (
      <Icon className={styles.icon} icon="ix-about" width="24" height="24" />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Contact us",
    lable: "Contact",
    Icon: (
      <Icon
        className={styles.icon}
        icon="material-symbols:contact-support-outline-rounded"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Settings",
    lable: "Settings",
    Icon: (
      <Icon
        className={styles.icon}
        icon="material-symbols:settings-outline-rounded"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
]
const AdminSideBarOption: menuListType[] = [
  {
    title: "Profile",
    lable: "Profile",
    Icon: (
      <Icon
        className={styles.icon}
        icon="iconamoon:profile-fill"
        width="24"
        height="24"
      />
    ),
    className: `${styles.active}`,
  },
  {
    title: "Manage users",
    lable: "Manage",
    Icon: (
      <Icon
        className={styles.icon}
        icon="teenyicons:appointments-outline"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Requests",
    lable: "Requests",
    Icon: (
      <Icon
        className={styles.icon}
        icon="ph:certificate"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "About us",
    lable: "About",
    Icon: (
      <Icon className={styles.icon} icon="ix-about" width="24" height="24" />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Contact us",
    lable: "Contact",
    Icon: (
      <Icon
        className={styles.icon}
        icon="material-symbols:contact-support-outline-rounded"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
  {
    title: "Settings",
    lable: "Settings",
    Icon: (
      <Icon
        className={styles.icon}
        icon="material-symbols:settings-outline-rounded"
        width="24"
        height="24"
      />
    ),
    className: `${styles.menuItem}`,
  },
]


const SideBar = () => {
  const { goTo } = useAppNavigation();
  const dispatch = useDispatch();


  const [menuList, setMenuList] = useState<menuListType[]>(AdminSideBarOption);

  const role = useSelector((state: RootState) => state?.auth?.role);


  const handlePageChange = (title: string) => {
    try {
      const newMenuList: menuListType[] = menuList.map((ele: menuListType) => {
        console.log(ele?.title , title , )

        if (ele?.title?.split(" ")?.[0] === title) {
          return {
            ...ele,

            className: `${styles.active}`,
          };
        }
        return {
          ...ele,
          className: `${styles.menuItem}`,
        };
      });
      setMenuList(newMenuList);
    } catch (error) {
      console.error(error)
    } finally {
      console.log(title, "heyy")
      goTo(`/${title}`);
    }

  };

  useEffect(() => {
    if (role === "admin") {
      setMenuList(AdminSideBarOption)
    } else if (role === "patient") {
      setMenuList(PatientsSideBarOption);
    } else {
      setMenuList(StudentSideBarOption);
    }
  }, [role])


  const handleLogout = () => {
    dispatch(clearRole())
    goTo("/");
  }

  return (
    <div className={styles.sideBar}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.titleFirst}>Helping</h2>
        <h2 className={styles.titleSecond}>BUDDY</h2>
      </div>
      <div className={styles.menuList}>
        {menuList.map((ele: menuListType) => {
          return (
            <div
              className={ele?.className}
              onClick={() => {
                handlePageChange(ele?.lable);
              }}
            >
              {ele?.title}
              {ele?.Icon}
            </div>
          );
        })}
      </div>
      <div className={styles.menuList}>
        <div className={`${styles.menuItem}`} onClick={handleLogout}>
          {"Logout"}
          {
            <Icon
              className={styles.icon}
              icon="ant-design:logout-outlined"
              width="24"
              height="24"
            />
          }
        </div>
      </div>
    </div>
  );
};

export default SideBar;
