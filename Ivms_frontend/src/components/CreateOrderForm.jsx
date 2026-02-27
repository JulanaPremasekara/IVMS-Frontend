import { useState } from 'react';
import axios from 'axios';

export default function CreateOrderForm({ onOrderCreated }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostal, setShippingPostal] = useState('');

  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');

  const createOrder = async () => {
    if (!customerName || !shippingAddress || !productName || !unitPrice) {
      alert('Please fill required fields');
      return;
    }

    const request = {
      customerName, customerEmail, shippingAddress, shippingCity,
      shippingPostalCode: shippingPostal,
      items: [{ productId: productId ? Number(productId) : null, productName, quantity: Number(quantity) || 1, unitPrice: Number(unitPrice) }]
    };

    try {
      await axios.post('http://localhost:8080/api/orders', request);
      alert('Order Created Successfully!');
      clearForm();
      if (onOrderCreated) onOrderCreated();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const clearForm = () => {
    setCustomerName(''); setCustomerEmail(''); setShippingAddress('');
    setShippingCity(''); setShippingPostal(''); setProductId('');
    setProductName(''); setQuantity('1'); setUnitPrice('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.formTitle}>Create New Sales Order</h2>
        
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Customer Information</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Shipping Information</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Address *</label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter shipping address"
              style={styles.input}
            />
          </div>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                value={shippingCity}
                onChange={(e) => setShippingCity(e.target.value)}
                placeholder="City"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Postal Code</label>
              <input
                type="text"
                value={shippingPostal}
                onChange={(e) => setShippingPostal(e.target.value)}
                placeholder="Postal code"
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Product Information</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product ID</label>
              <input
                type="number"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Optional product ID"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Unit Price *</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={createOrder} style={styles.submitButton}>
            ✓ Create Order
          </button>
          <button onClick={clearForm} style={styles.clearButton}>
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
  },
  formTitle: {
    margin: '0 0 30px 0',
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    margin: '0 0 8px 0',
    fontSize: '13px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '30px',
  },
  submitButton: {
    padding: '12px 30px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  clearButton: {
    padding: '12px 30px',
    backgroundColor: '#e5e7eb',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
};
