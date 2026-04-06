import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

import {
  MdAccountCircle,
  MdNotificationsNone,
} from "react-icons/md";

import { useEffect, useRef, useState } from "react";

import { LuLogOut } from "react-icons/lu";
import { ImProfile } from "react-icons/im";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ---------------- MENU TOGGLE ---------------- */

  const toggleMenu = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    setShowMenu((prev) => !prev);
  };

  /* ---------------- OUTSIDE CLICK ---------------- */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (!menuRef.current) return;

      if (
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setShowMenu(false);
        setShowConfirm(false);
      }
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  /* ---------------- LOGOUT CONFIRMATION ---------------- */

  const handleLogoutClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    setShowMenu(false);
    setShowConfirm(true);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  const confirmLogout = () => {
    handleLogout();
    setShowConfirm(false);
  };

  return (
    <header>
      <div className={styles.header}>
        {/* Search */}
        <div className={styles.searchcontainer}>
          {/* <input
            type="text"
            placeholder="Search patients, appointments..."
            className={styles.searchInput}
            style={{ width: "400px" }}
          /> */}
        </div>

        {/* Right Section */}
        <div className={styles.headerRight}>
          <MdNotificationsNone
            className={styles.notificationIcon}
          />

          {/* Profile Area */}
          <div
            className={styles.profileArea}
            ref={menuRef}
          >
            {/* Profile Button */}
            <div
              className={styles.profileButton}
              onClick={toggleMenu}
            >
              <MdAccountCircle
                className={styles.profileLogo} 
              />

              <span className={styles.profile}>
                Michael Chen
              </span>
            </div>

            {/* Dropdown Menu */}
            {showMenu && (
              <div
                className={styles.dropdown}
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <div
                  className={styles.menuItem}
                >
                  Profile
                  <ImProfile
                    className={
                      styles.menuProfileLogo
                    }
                  />
                </div>

                <div
                  className={styles.menuItem}
                  onClick={
                    handleLogoutClick
                  }
                >
                  Logout
                  <LuLogOut
                    className={
                      styles.logoutLogo
                    }
                  />
                </div>
              </div>
            )}

            {/* Logout Confirmation Modal */}
            {showConfirm && (
              <div
                className={
                  styles.modalOverlay
                }
              >
                <div
                  className={styles.modal}
                >
                  <h3>
                    Confirm Logout
                  </h3>

                  <p>
                    Are you sure you want to
                    logout of your account?
                  </p>

                  <div
                    className={
                      styles.modalActions
                    }
                  >
                    <button
                      className={
                        styles.cancelBtn
                      }
                      onClick={
                        cancelLogout
                      }
                    >
                      Cancel
                    </button>

                    <button
                      className={
                        styles.confirmBtn
                      }
                      onClick={
                        confirmLogout
                      }
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;