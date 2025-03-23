'use client';

import { AlertSeverity, usePopupAlert } from '@/providers/AlertProvider';

interface AlertProps {
  severity: AlertSeverity;
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ severity, children }) => {
  const severityClasses = {
    '': '',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
  };

  return <div className={`z-50 fixed bottom-8 right-4 px-4 py-2 rounded shadow-lg ${severityClasses[severity] || 'bg-gray-500 text-white'}`}>{children}</div>;
};

const AlertPopup = () => {
  const { text, type } = usePopupAlert();

  if (text && type) {
    return <Alert severity={type as AlertSeverity}>{text}</Alert>;
  }
  return null;
};

export default AlertPopup;
