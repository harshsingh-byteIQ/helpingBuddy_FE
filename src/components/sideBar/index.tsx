import { Icon } from "@iconify/react";
import { ReactNode, useState } from "react";
import styles from "./sideBar.module.scss";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  interface menuListType {
    title: string;
    lable: string;
    Icon: ReactNode;
    className: string;
  }
  const navigate = useNavigate();

  const [menuList, setMenuList] = useState<menuListType[]>([
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
  ]);

  const handlePageChange = (title: string) => {
    const newMenuList: menuListType[] = menuList.map((ele: menuListType) => {
      console.log(title, ele?.title?.split(" ")?.[0]);
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
    navigate(`/${title}`);
  };

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
        <div className={`${styles.menuItem}`}>
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
