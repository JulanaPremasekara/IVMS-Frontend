import React from 'react';

const PlaceholderPage = ({ title, icon, description }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{icon} {title}</h1>
        <p style={styles.subtitle}>{description}</p>
      </div>

      <div style={styles.content}>
        <div style={styles.placeholder}>
          <div style={styles.icon}>{icon}</div>
          <h2 style={styles.placeholderTitle}>{title}</h2>
          <p style={styles.placeholderText}>Coming Soon</p>
          <p style={styles.placeholderSubtext}>This section is under development</p>
        </div>
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
  content: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '60px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  placeholderTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 10px 0',
  },
  placeholderText: {
    fontSize: '16px',
    color: '#666',
    fontWeight: '500',
    margin: '0',
  },
  placeholderSubtext: {
    fontSize: '13px',
    color: '#999',
    margin: '8px 0 0 0',
  },
};

export default PlaceholderPage;
