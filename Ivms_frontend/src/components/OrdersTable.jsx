import axios from 'axios';

export default function OrdersTable({ orders, loading, onRefresh }) {

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm(`Mark order ${id} as ${newStatus}?`)) return;
    try {
      await axios.put(`http://localhost:8080/api/orders/${id}/status`, newStatus);
      onRefresh();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm(`Delete order ${id}?`)) return;
    try {
      await axios.delete(`http://localhost:8080/api/orders/${id}`);
      onRefresh();
    } catch (err) {
      alert('Error deleting order');
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>All Created Orders</h2>
        <button onClick={onRefresh} disabled={loading} style={styles.refreshButton}>
          {loading ? 'Loading...' : 'Refresh List'}
        </button>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={styles.empty}>No orders yet. Create one to get started!</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id} style={{...styles.row, backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9'}}>
                <td style={styles.td}>{order.id}</td>
                <td style={styles.td}>{order.customerName}</td>
                <td style={styles.td}>{order.orderDate}</td>
                <td style={styles.td}>
                  <span style={{...styles.badge, backgroundColor: order.status === 'Pending' ? '#fbbf24' : '#22c55e'}}>
                    {order.status}
                  </span>
                </td>
                <td style={styles.td}>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                <td style={{...styles.td, display: 'flex', gap: '8px'}}>
                  <button onClick={() => updateStatus(order.id, 'Shipped')} style={styles.actionButton}>
                    Ship
                  </button>
                  <button onClick={() => deleteOrder(order.id)} style={{...styles.actionButton, backgroundColor: '#ef4444'}}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: '0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  refreshButton: {
    padding: '8px 16px',
    backgroundColor: '#1f48d8',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  loading: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  headerRow: {
    backgroundColor: '#f5f5f5',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#666',
    borderBottom: '2px solid #ddd',
  },
  row: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '12px',
    color: '#333',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  },
  actionButton: {
    padding: '6px 12px',
    backgroundColor: '#1f48d8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
};
