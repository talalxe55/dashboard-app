import { API_SERVER, TOKEN_TYPE, TOKEN, ACCEPT_TYPE } from "config/constant";
import axios from "axios";

const getCustomersList = async () => {
  try {
    const res = await axios.get(`${API_SERVER}customers`, {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });
  } catch (err) {
    if (err.response.status === 404) {
      
    } else if (err.response.status === 401) {
      
    } else {
      
    }
  }
};

const getCustomerID = async (cusID) => {
  try {
    const res = await axios.get(`${API_SERVER}customers/${cusID}`, {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });
    
    return res;
  } catch (err) {
    if (err.response.status === 404) {
     
    } else if (err.response.status === 401) {
      
    } else {
      
    }
  }
};

const getAllPayments = async () => {
  try {
    const res = await axios.get(`${API_SERVER}payments`, {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });

  } catch (error) {
    
  }
};

const getAllPaymentsByCustomerID = async (id) => {
  let cusid = id;

  const res = await axios.get(`${API_SERVER}payments/${cusid}`, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const getAllRefunds = async () => {
  try {
    const res = await axios.get(`${API_SERVER}payments`, {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });

  } catch (error) {
    
  }
};

const createPayment = async (data) => {
  const payload = {};
  Object.entries(data).forEach(([key, value]) => {
    payload[key] = value;
  });
  const res = await axios.post(
    `${API_SERVER}payments/create`,
    JSON.stringify(payload),
    {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    }
  );
  return res;

};

const editCustomer = async (data, cusid) => {
  const payload = {};
  Object.entries(data).forEach(([key, value]) => {
    payload[key] = value;
  });
  const res = await axios.post(
    `${API_SERVER}customers/edit/${cusid}`,
    JSON.stringify(payload),
    {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    }
  );
  return res;

};

const refundCharge = async (data) => {
  const payload = {};
  Object.entries(data).forEach(([key, value]) => {
    payload[key] = value;
  });

  const res = await axios.post(
    `${API_SERVER}refunds/create`,
    JSON.stringify(payload),
    {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    }
  );
  return res;
};

const updatePassword = async (data) => {
  const payload = {};
  Object.entries(data).forEach(([key, value]) => {
    payload[key] = value;
  });

  const res = await axios.post(
    `${API_SERVER}users/change-password`,
    JSON.stringify(payload),
    {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    }
  );
  return res;
};

const forgotPassword = async (data) => {
  const payload = {};
  Object.entries(data).forEach(([key, value]) => {
    payload[key] = value;
  });
  // ,  {
  //   headers: {
  //     Authorization: `${TOKEN_TYPE} ${TOKEN}`,
  //     Accept: `${ACCEPT_TYPE}`,
  //     "Content-Type": `${ACCEPT_TYPE}`,
  //   },
  // }
  const res = await axios.post(
    `${API_SERVER}password/forgot-password`,
    payload
  );
  return res;
};

const resetPassword = async (data) => {
  const payload = {};
  Object.entries(data).forEach(([key, value]) => {
    payload[key] = value;
  });
  // ,  {
  //   headers: {
  //     Authorization: `${TOKEN_TYPE} ${TOKEN}`,
  //     Accept: `${ACCEPT_TYPE}`,
  //     "Content-Type": `${ACCEPT_TYPE}`,
  //   },
  // }
  const res = await axios.post(`${API_SERVER}password/reset`, payload);
  return res;
};

const sendverifyEmail = async () => {
  const res = await axios.get(`${API_SERVER}email/resend`, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const getUser = async () => {
  const res = await axios.get(`${API_SERVER}users/view-profile`, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const verifyEmail = async (url) => {
  //  {
  //   headers: {
  //     Authorization: `${TOKEN_TYPE} ${TOKEN}`,
  //     Accept: `${ACCEPT_TYPE}`,
  //     "Content-Type": `${ACCEPT_TYPE}`,
  //   },

  const res = await axios.get(url);
  return res;
};

const getBulkPayments = async () => {
  try {
    const res = await axios.get(`${API_SERVER}bulk-payments/`, {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });
   
    return res;
  } catch (err) {
    if (err.response.status === 404) {
      
    } else if (err.response.status === 401) {
      
    } else {
      
    }
  }
};

const runJobPaymentID = async (jobID) => {
  const res = await axios.get(`${API_SERVER}bulk-payments/run/${jobID}`, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const deleteJobPaymentID = async (jobID) => {
  const res = await axios.get(`${API_SERVER}bulk-payments/delete/${jobID}`, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const getUsers = async () => {
  const res = await axios.get(`${API_SERVER}users/`, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const editUsersRole = async (userEmail, role) => {
  
  const jsonData = JSON.stringify({ email: userEmail, role });
  const res = await axios.post(`${API_SERVER}users/edit-role`, jsonData, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const deleteUsers = async (email, id) => {
  
  const payload = JSON.stringify({ email, id });
  const res = await axios.post(`${API_SERVER}users/delete/`, payload, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const getRefreshToken = async () => {
  const res = await axios.get(`${API_SERVER}users/refresh-token/`, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const verifyOTP = async (otpcode,token) => {
  const payload = JSON.stringify({ secret: otpcode });
  const res = await axios.post(`${API_SERVER}users/2fa/verify`, payload, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${token}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};

const sendOTPConfig = async (token) => {
  const res = await axios.get(`${API_SERVER}users/2fa/resend-email`, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${token}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
};
export {
  getCustomersList,
  getAllPayments,
  getAllPaymentsByCustomerID,
  getAllRefunds,
  getCustomerID,
  createPayment,
  editCustomer,
  refundCharge,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendverifyEmail,
  getUser,
  getBulkPayments,
  runJobPaymentID,
  deleteJobPaymentID,
  getUsers,
  editUsersRole,
  deleteUsers,
  getRefreshToken,
  verifyOTP,
  sendOTPConfig
};
