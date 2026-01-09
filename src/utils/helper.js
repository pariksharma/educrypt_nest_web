export const isLogin = () => {
    if (typeof window === 'undefined') {
        return false; // server-side default
    }

    const jwt = localStorage.getItem('token');
    return !!jwt;
}

export const formatDate = (ts) => {
  if (!ts) return "";

  const date = new Date(ts * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateWithDate = (ts) => {
  if (!ts) return "";

  const date = new Date(ts * 1000);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = days[date.getDay()];

  const day = date.getDate();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const monthName = months[date.getMonth()];

  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${dayName} ${day} ${monthName}, ${year} | ${hours}:${minutes}${ampm}`;
};


export const timeAgo = (ts) => {
  if (!ts) return "";

  const now = Math.floor(Date.now() / 1000);
  const diff = now - ts;

  if (diff < 60) return "just now";

  const minute = 60;
  const hour = 3600;
  const day = 86400;
  const week = 604800;
  const month = 2592000;
  const year = 31536000;

  if (diff < hour) return `${Math.floor(diff / minute)} min ago`;
  if (diff < day) return `${Math.floor(diff / hour)} hrs ago`;
  if (diff < week) return `${Math.floor(diff / day)} days ago`;
  if (diff < month) return `${Math.floor(diff / week)} weeks ago`;
  if (diff < year) return `${Math.floor(diff / month)} months ago`;

  return `${Math.floor(diff / year)} years ago`;
};

// Combined output
export const formatDateWithTimeAgo = (ts) => {
  return {
    date: formatDate(ts),
    ago: timeAgo(ts),
  };
};

export const daysBetween = (from, to) => {
  if (!from || !to) return 0;

  const diffInSeconds = to - from;
  const diffInDays = diffInSeconds / (60 * 60 * 24);

  return Math.ceil(diffInDays);
};