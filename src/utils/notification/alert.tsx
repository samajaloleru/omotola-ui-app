import React from 'react';
import { PiCheckCircleFill, PiWarningCircleFill, PiInfoFill, PiXBold } from 'react-icons/pi';
import { useAlert } from './alertcontext';

const styles = {
  success: { icon: PiCheckCircleFill, color: 'text-success', bar: 'bg-success' },
  error: { icon: PiWarningCircleFill, color: 'text-danger', bar: 'bg-danger' },
  info: { icon: PiInfoFill, color: 'text-plum', bar: 'bg-plum' },
};

const Alert: React.FC = () => {
  const { alerts, clearAlert } = useAlert();

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 top-4 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:top-6">
      {alerts.map((alert) => {
        const { icon: Icon, color, bar } = styles[alert.type];
        return (
          <div
            key={alert.id}
            role={alert.type === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto relative flex w-full animate-rise items-start gap-3 overflow-hidden rounded-xl bg-white py-3 pl-5 pr-3 shadow-lift sm:w-[22rem]"
          >
            <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
            <Icon className={`mt-0.5 shrink-0 text-xl ${color}`} />
            <p className="flex-1 text-sm text-ink">{alert.message}</p>
            <button
              type="button"
              onClick={() => clearAlert(alert.id)}
              aria-label="Dismiss"
              className="rounded-md p-1 text-muted transition hover:bg-sand hover:text-ink"
            >
              <PiXBold />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Alert;
