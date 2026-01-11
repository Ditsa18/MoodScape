// src/utils/otp.js
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const saveOTP = (key, otp) => {
  localStorage.setItem(key, JSON.stringify({
    otp,
    expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes
  }));
};

export const getOTP = (key) => {
  const data = JSON.parse(localStorage.getItem(key));
  if (!data) return null;
  if (Date.now() > data.expiresAt) {
    localStorage.removeItem(key);
    return null;
  }
  return data.otp;
};

export const clearOTP = (key) => {
  localStorage.removeItem(key);
};
