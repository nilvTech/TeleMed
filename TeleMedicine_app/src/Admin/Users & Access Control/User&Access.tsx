import styles from "./User&Access.module.css";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";

interface Users {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  mfa: string;
}
const users: Users[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Provider",
    status: "Active",
    lastLogin: "2023-10-01",
    mfa: "Enabled",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    email: "s.jenkins@clinic.org",
    role: "Admin",
    status: "Inactive",
    lastLogin: "2023-08-15",
    mfa: "Enabled",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "mchen@healthnet.com",
    role: "Practitioner",
    status: "Pending",
    lastLogin: "N/A",
    mfa: "Disabled",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.r@medstaff.io",
    role: "Staff",
    status: "Active",
    lastLogin: "2023-10-24",
    mfa: "Enabled",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "dwilson@provider.net",
    role: "Practitioner",
    status: "Inactive",
    lastLogin: "2023-09-12",
    mfa: "Disabled",
  },
  {
    id: 6,
    name: "Lisa Thompson",
    email: "l.thompson@clinic.org",
    role: "Staff",
    status: "Pending",
    lastLogin: "N/A",
    mfa: "Disabled",
  },
  {
    id: 7,
    name: "Robert Miller",
    email: "rmiller@admin-portal.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-10-25",
    mfa: "Enabled",
  },
];

interface ModulePermissions {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
}

interface UserPermissions {
  key: number;
  module: string;
  permissions: ModulePermissions;
  specialActions: Record<string, boolean>;
}

export default function AccessControl() {
  const [userPermissions, setUserPermissions] = useState<UserPermissions[]>([
    {
      key: 1,
      module: "Patients",
      permissions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        approve: false,
        export: true,
      },
      specialActions: {
        viewSensitiveData: true,
        mergeRecords: true,
      },
    },
    {
      key: 2,
      module: "Appointments",
      permissions: {
        view: true,
        create: true,
        update: true,
        delete: true,
        approve: false,
        export: false,
      },
      specialActions: {
        reschedule: true,
        cancel: true,
        assignProvider: true,
      },
    },
    {
      key: 3,
      module: "Prescriptions",
      permissions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        approve: true,
        export: true,
      },
      specialActions: {
        eSign: true,
        sendToPharmacy: true,
        refill: true,
      },
    },
    {
      key: 4,
      module: "Medical Records",
      permissions: {
        view: true,
        create: true,
        update: true,
        delete: false,
        approve: false,
        export: true,
      },
      specialActions: {
        download: true,
        share: true,
        lockRecord: true,
      },
    },
    {
      key: 5,
      module: "Billing",
      permissions: {
        view: true,
        create: true,
        update: false,
        delete: false,
        approve: true,
        export: true,
      },
      specialActions: {
        processRefund: true,
        adjustInvoice: true,
      },
    },
    {
      key: 6,
      module: "Users/Admin",
      permissions: {
        view: true,
        create: true,
        update: true,
        delete: true,
        approve: false,
        export: false,
      },
      specialActions: {
        assignRoles: true,
        resetPassword: true,
        deactivate: true,
      },
    },
  ]);

  const perPage = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users>();

  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [mfa, setMFA] = useState("All");
  const [date, setDate] = useState("");

  const handleRowClick = (user: Users) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  // const [selectedActions, setSelectedActions] = useState<string[]>([]);

  // const handleCheckboxChange = (action: string) => {
  //   setSelectedActions((prev) =>
  //     prev.includes(action)
  //       ? prev.filter((a) => a !== action)
  //       : [...prev, action],
  //   );
  // };

  const toggleSpecialAction = (moduleIndex: any, actionKey: any) => {
    setUserPermissions((prev) => {
      const updated = [...prev];
      updated[moduleIndex] = {
        ...updated[moduleIndex],
        specialActions: {
          ...updated[moduleIndex].specialActions,
          [actionKey]: !updated[moduleIndex].specialActions[actionKey],
        },
      };
      return updated;
    });
  };
  const togglePermission = (
    moduleIndex: number,
    key: keyof ModulePermissions,
  ) => {
    setUserPermissions((prev) => {
      const updated = [...prev];
      updated[moduleIndex] = {
        ...updated[moduleIndex],
        permissions: {
          ...updated[moduleIndex].permissions,
          [key]: !updated[moduleIndex].permissions[key],
        },
      };
      return updated;
    });
  };
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole =
      role === "All" || role.toLowerCase() === user.role.toLowerCase();
    const matchStatus =
      status === "All" || status.toLowerCase() === user.status.toLowerCase();
    const matchMFA =
      mfa === "All" || mfa.toLowerCase() === user.mfa.toLowerCase();
    const matchDate =
      date === "" || date.toLowerCase() === user.lastLogin.toLowerCase();
    console.log(date);

    return matchRole && matchStatus && matchMFA && matchSearch && matchDate;
  });
  const totalPages = Math.ceil(filteredUsers.length / perPage);

  return (
    <div className={styles.UsersAccessControlPage}>
      {!showDetails && (
        <div className={styles.UsersPage}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              Users <span className={styles.ampersand}>&</span> Access Control
            </h1>
            <p className={styles.pageSubtitle}>
              Manage users system access permissions{" "}
            </p>
          </div>

          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search name, email..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              name="role"
              id="role"
              className={styles.roleSelect}
              onChange={(e) => {
                setRole(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">Role</option>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
              <option value="practitioner">Practitioner</option>
              <option value="staff">Staff</option>
            </select>
            <select
              name="status"
              id="status"
              className={styles.statusSelect}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select
              name="mfa"
              id="mfa"
              className={styles.mfaSelect}
              onChange={(e) => {
                setMFA(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">MFA</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>

            <input
              type="date"
              onChange={(e) => {
                setDate(e.target.value);
              }}
              aria-label="last login"
            />
          </div>

          <div className={styles.Usertable}>
            <table>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>MFA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {filteredUsers
                  .slice((currentPage - 1) * perPage, currentPage * perPage)
                  .map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                      <td>{user.lastLogin}</td>
                      <td>{user.mfa}</td>
                      <td>
                        <button
                          className={styles.viewButton}
                          onClick={() => handleRowClick(user)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                showing{" "}
                {Math.min((currentPage - 1) * perPage + 1, users.length)} -
                {Math.min(currentPage * perPage, filteredUsers.length)} of{" "}
                {filteredUsers.length}
              </span>
              <div className={styles.paginationControls}>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <div className={styles.userDetails}>
          <span className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              <IoArrowBack
                className={styles.backArrow}
                onClick={() => setShowDetails(false)}
              />
              Roles <span className={styles.ampersand}>&</span> Permissions
            </h1>
          </span>
          <div>
            {selectedUser && (
              <div className={styles.userCard}>
                <div className={styles.userItem}>
                  <span>Name:</span>
                  <p>{selectedUser.name}</p>
                </div>
                <div className={styles.userItem}>
                  <span>Email:</span>
                  <p>{selectedUser.email}</p>
                </div>
                <div className={styles.userItem}>
                  <span>Role:</span>
                  <p>{selectedUser.role}</p>
                </div>
              </div>
            )}
          </div>
          <table className={styles.permissionTable}>
            <thead>
              <tr>
                <td>Module</td>
                <td>View</td>
                <td>Create</td>
                <td>Update</td>
                <td>Delete</td>
                <td>Approve</td>
                <td>Special Actions</td>
              </tr>
            </thead>
            <tbody>
              {userPermissions.map((row, moduleIndex) => (
                <tr key={row.key}>
                  <td>{row.module}</td>

                  {/* View */}
                  <td>
                    <input
                      type="checkbox"
                      checked={row.permissions.view}
                      onChange={() => togglePermission(moduleIndex, "view")}
                       id={`action-View`} 
                    />
                  </td>

                  {/* Create */}
                  <td>
                    <input
                      type="checkbox"
                      checked={row.permissions.create}
                      onChange={() => togglePermission(moduleIndex, "create")}
                       id={`action-Create`} 
                    />
                  </td>

                  {/* Update */}
                  <td>
                    <input
                      type="checkbox"
                      checked={row.permissions.update}
                      onChange={() => togglePermission(moduleIndex, "update")}
                       id={`action-Update`} 
                    />
                  </td>

                  {/* Delete */}
                  <td>
                    <input
                      type="checkbox"
                      checked={row.permissions.delete}
                      onChange={() => togglePermission(moduleIndex, "delete")}
                       id={`action-Delete`} 
                    />
                  </td>

                  {/* Approve */}
                  <td>
                    <input
                      type="checkbox"
                      checked={row.permissions.approve}
                      onChange={() => togglePermission(moduleIndex, "approve")}
                       id={`action-Approve`} 
                    />
                  </td>

                  {/* Special Actions */}
                  <td>
                    {Object.entries(row.specialActions).map(
                      ([actionKey, value]) => (
                        <div 
                        key={actionKey}
                        className={styles.specialActionscheckBox}
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() =>
                              toggleSpecialAction(moduleIndex, actionKey)
                            }
                              id={`action-${actionKey}`}
                          />
                           <label htmlFor={`action-${actionKey}`}>{actionKey}</label>
                        </div>
                      ),
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

{
  /* <tbody>
                {userPermissions.map((Row, index) => (
                  <tr key={index}>
                    <td>{Row.module}</td>
                    <td>
                      <input 
                      type="checkbox" 
                      id={`action-View`} 
                      checked={Row.permissions.view}
                      
                      />
                    </td>
                    <td>
                      <input type="checkbox" id={`action-Create`} />
                    </td>
                    <td>
                      <input type="checkbox" id={`action-Update`} />
                    </td>
                    <td>
                      <input type="checkbox" id={`action-Delete`} />
                    </td>
                    <td>
                      <input type="checkbox" id={`action-Approve`} />
                    </td>

                    <td>
                      {Row.specialActions.map((action, index) => (
                        <div
                          key={index}
                          className={styles.specialActionscheckBox}
                        >
                          <input
                            type="checkbox"
                            id={`action-${index}`}
                            checked={selectedActions.includes(action)}
                            onChange={() => handleCheckboxChange(action)}
                          />
                          <label htmlFor={`action-${index}`}>{action}</label>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody> */
}
