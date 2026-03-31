import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
//import { Bell } from "lucide-react";
import { MdAccountCircle, MdNotificationsNone } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { ImProfile } from "react-icons/im";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      
      document.addEventListener("mousedown", handleClickOutside);
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    };
  }, []);
  
  
  //Logout Confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  }
  
  const cancelLogout = () =>{
    setShowConfirm(false);
  } 

  const confirmLogout = () =>{
    handleLogout();
    setShowConfirm(false);
  }
  return (
    <header>
      <div className={styles.header}>
        <div className={styles.searchcontainer}>
          <input
            type="text"
            placeholder="Search patients, appointments..."
            className={styles.searchInput}
            style={{ width: "400px" }}
          />
        </div>
        <div className={styles.headerRight}>
          <MdNotificationsNone className={styles.notificationIcon} />
          <div
            className={styles.profileArea}
            ref={menuRef}
            onClick={toggleMenu}
          >
            <MdAccountCircle className={styles.profileLogo} />
            <span className={styles.profile}>Michael Chen</span>
            {showMenu && (
              <div className={styles.dropdown}>
                <div className={styles.menuItem}>Profile <ImProfile className={styles.profileLogo}/></div>

                <div className={styles.menuItem}>Settings <IoMdSettings className={styles.settingLogo}/></div>

                <div className={styles.menuItem} onClick={handleLogoutClick}>
                  Logout <LuLogOut className={styles.logoutLogo} />
                </div>
              </div>
            )}

            {/* Logout Confirmation */}
            {
              showConfirm &&  
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <h3>Confirm Logout</h3>
                  <p>Are you sure you want to logout of your account?</p>
                  <div className={styles.modalActions}> 
                    <button className={styles.cancelBtn} onClick={cancelLogout}>Cancel</button>
                    <button className={styles.confirmBtn} onClick={confirmLogout}>Logout</button>
                    
                  </div>
                  
                </div>
                
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
