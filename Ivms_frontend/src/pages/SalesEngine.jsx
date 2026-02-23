import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateOrderForm from '../components/CreateOrderForm';
import OrdersTable from '../components/OrdersTable';

const SalesEngine = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/orders');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'view') fetchOrders();
  }, [activeTab]);

  const handleDataChanged = () => fetchOrders();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛒 Sales Engine</h1>
        <p style={styles.subtitle}>Create and manage your sales orders</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button 
          onClick={() => setActiveTab('create')} 
          style={{
            ...styles.tabButton,
            ...(activeTab === 'create' ? styles.tabButtonActive : {}),
          }}
        >
          Create New Order
        </button>
        <button 
          onClick={() => setActiveTab('view')} 
          style={{
            ...styles.tabButton,
            ...(activeTab === 'view' ? styles.tabButtonActive : {}),
          }}
        >
          View All Orders
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'create' && <CreateOrderForm onOrderCreated={handleDataChanged} />}
        {activeTab === 'view' && <OrdersTable orders={orders} loading={loading} onRefresh={handleDataChanged} />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#999',
    fontSize: '14px',
    margin: '0',
  },
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0',
  },
  tabButton: {
    padding: '12px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#666',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    borderBottom: '3px solid transparent',
    transition: 'all 0.3s ease',
  },
  tabButtonActive: {
    color: '#1f48d8',
    borderBottomColor: '#1f48d8',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
};

export default SalesEngine;
