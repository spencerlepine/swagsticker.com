'use client';

import { createContext, ReactNode, useState, useContext } from 'react';

export type AlertSeverity = 'success' | 'error' | 'warning' | 'info' | '';

const ALERT_TIME = 5000;
const initialState = {
  text: '',
  type: '',
};

const AlertContext = createContext({
  ...initialState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAlert: (text: string, type: AlertSeverity) => {},
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState('');

  const setAlert = (text: string, type: AlertSeverity) => {
    setText(text);
    setType(type);

    setTimeout(() => {
      setText('');
      setType('');
    }, ALERT_TIME);
  };

  return (
    <AlertContext.Provider
      value={{
        text,
        type,
        setAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const usePopupAlert = () => useContext(AlertContext);
