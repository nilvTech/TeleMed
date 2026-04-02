import { useState } from "react";
import styles from "./Orders.module.css";

type Order = {
  id: string;
  orderType: string;
  description: string;
  provider: string;
  date: string;
  status: string;
};

function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      orderType: "Lab",
      description: "Complete Blood Count (CBC)",
      provider: "Dr. Michael Chen",
      date: "04/01/2026",
      status: "Pending",
    },
    {
      id: "ORD-002",
      orderType: "Imaging",
      description: "Chest X-Ray",
      provider: "Dr. Sarah Lee",
      date: "03/31/2026",
      status: "Completed",
    },
    {
      id: "ORD-003",
      orderType: "Procedure",
      description: "ECG Test",
      provider: "Dr. Robert Kim",
      date: "03/30/2026",
      status: "Cancelled",
    },
  ]);

  const handleDelete = (id: string) => {
    const updated = orders.filter(
      (order) => order.id !== id
    );

    setOrders(updated);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <h2>Orders</h2>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Order ID</th>
              <th>Order Type</th>
              <th>Description</th>
              <th>Provider</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>

                <td>{order.id}</td>

                <td>{order.orderType}</td>

                <td>{order.description}</td>

                <td>{order.provider}</td>

                <td>{order.date}</td>

                <td>
                  <span
                    className={`${styles.status} ${
                      styles[
                        order.status.toLowerCase()
                      ]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      handleDelete(order.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={8}>
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;