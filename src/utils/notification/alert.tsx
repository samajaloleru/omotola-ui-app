import React from 'react';
import { useAlert } from './alertcontext';

const Alert: React.FC = () => {
  const { alerts, clearAlert } = useAlert();

  return (
    <div className="absolute flex flex-col z-50 top-[3rem] items-end w-screen">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`mt-3 mx-4 px-4 rounded-md border-l-[.6rem] ${
            alert.type === 'success' ? 'border-green' : 'border-red'
          } bg-white md:max-w-2xl md:px-8 text-[12px] w-[20rem]`}
        >
          <div className="flex justify-between py-3">
            <div className="flex">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${alert.type === 'success' ? 'text-green' : 'text-red'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="self-center ml-3">
                <span
                  className={`font-bold text-[1rem] tracking-wide capitalize ${
                    alert.type === 'success' ? 'text-green' : 'text-red'
                  }`}
                >
                  {alert.type}
                </span>
                <p
                  className={`mt-2 font-medium ${
                    alert.type === 'success' ? 'text-green' : 'text-red'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            </div>
            <button onClick={() => clearAlert(alert.id)} className="self-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Alert;
