export const nexHours = (hour = 1) => {
  const date = new Date();
  const timeInSeconds = +hour * 60 * 60;

  const fullTime = date.getTime() + timeInSeconds * 1000;
  const newDate = new Date(fullTime);

  return {
    fullTime,
    date: newDate,
    secondTime: timeInSeconds,
  };
};

export const getNextDayTime = (day = 1) => {
  const date = new Date();
  const timeInSeconds = +day * 24 * 60 * 60;

  const fullTime = date.getTime() + timeInSeconds * 1000;
  const newDate = new Date(fullTime);

  return {
    fullTime,
    date: newDate,
    secondTime: timeInSeconds,
  };
};

export function calculateRemainingTime(date) {
  const currentTime = new Date().getTime();
  const targetTime = new Date(date).getTime();
  const remainingTime = targetTime - currentTime;
  const seconds = Math.ceil(remainingTime);
  return seconds;
}

export const formatTime = (timer) => {
  timer = timer || 0;
  const AllMinutes = Math.floor(timer / 60);
  const seconds = `0${timer % 60}`.slice(-2);
  const minutes = `0${AllMinutes % 60}`.slice(-2);
  const hours = `0${Math.floor(timer / 3600)}`.slice(-2);
  return {
    seconds: seconds || '00',
    minutes: minutes || '00',
    hours: hours || '00',
  };
};

export function getTimeRemaining(timer) {
  const allDays = Math.floor(timer / (24 * 60 * 60));
  const allHours = `0${Math.floor(timer / 3600)}`.slice(-2);
  const allMinutes = Math.floor(timer / 60);
  const seconds = `0${Math.floor(timer % 60)}`.slice(-2);
  const minutes = `0${Math.floor(allMinutes % 60)}`.slice(-2);
  const hours = `0${Math.floor((timer / (60 * 60)) % 24)}`.slice(-2);
  const days = `0${Math.floor(timer / (60 * 60 * 24))}`.slice(-2);
  const months = Math.floor(allDays / 30);
  const years = Math.floor(allDays / 30 / 12);
  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    allMinutes,
    allHours,
    allDays,
  };
}

export function parseDuration(duration) {
  let remain = duration;

  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  remain %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(remain / (1000 * 60 * 60));
  remain %= 1000 * 60 * 60;

  const minutes = Math.floor(remain / (1000 * 60));
  remain %= 1000 * 60;

  const seconds = Math.floor(remain / 1000);
  remain %= 1000;

  const milliseconds = remain;

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}
