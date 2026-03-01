import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

// Importing the config we just made

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;