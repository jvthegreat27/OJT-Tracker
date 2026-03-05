import React from 'react';
import { OJTProvider, useOJT } from './context/OJTContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent = () => {
  const { currentIntern } = useOJT();
  
  return currentIntern ? <Dashboard /> : <Login />;
};

function App() {
  return (
    <OJTProvider>
      <AppContent />
    </OJTProvider>
  );
}

export default App;
