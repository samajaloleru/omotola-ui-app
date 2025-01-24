import React, { createContext, useContext, ReactNode, ReactElement } from 'react';

// Define the alert type
type Alert = {
  id: string; // Unique identifier for each alert
  message: string;
  type: 'success' | 'error' | 'info';
};

type AlertContextType = {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id'>) => void; // Allow adding without manually providing an ID
  clearAlert: (id: string) => void; // Clear a specific alert
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }): ReactElement {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`; // Generate a unique ID
    setAlerts((prevAlerts) => [...prevAlerts, { id, ...alert }]);
    // Automatically remove the alert after 5 seconds
    setTimeout(() => {
      clearAlert(id);
    }, 5000);
  };

  const clearAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
