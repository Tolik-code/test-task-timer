import React, { useEffect, useState } from 'react';
import './App.css';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const App = () => {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState('stop');

  useEffect(() => {
    const unsubscribe = new Subject();

    interval(1000)
      .pipe(takeUntil(unsubscribe))
      .subscribe(() => {
        if (status === 'run') {
          setSec(val => val + 1000);
        }
      });

    return () => {
      unsubscribe.next();
      unsubscribe.complete();
    };
  }, [status]);

  const startTimer = React.useCallback(() => {
    setStatus('run');
  }, []);

  const stopTimer = React.useCallback(() => {
    setStatus('stop');
    setSec(0);
  }, []);

  const resetTimer = React.useCallback(() => {
    setSec(0);
    setStatus('run');
  }, []);

  const waitTimer = React.useCallback(() => {
    setStatus('wait');
  }, []);

  let wasClicked = false;
  let timeout;

  const waitDbClick = () => {
    if (wasClicked) {
      wasClicked = false;
      clearTimeout(timeout);

      return waitTimer();
    }

    wasClicked = true;
    timeout = setTimeout(() => {
      wasClicked = false;
    }, 300);
  };

  return (
    <div className="timer">
      <span>
        {new Date(sec).toISOString().slice(11, 19)}
      </span>
      <button
        className="timer__button"
        type="button"
        onClick={startTimer}
      >
        Start
      </button>
      <button className="timer__button" type="button" onClick={stopTimer}>
        Stop
      </button>
      <button
        className="timer__button"
        type="button"
        onClick={resetTimer}
      >
        Reset
      </button>
      <button
        className="timer__button"
        type="button"
        onClick={waitDbClick}
      >
        Wait
      </button>
    </div>
  );
};
