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
    // let data = res.data.data.data;
    // console.log(data);
  } catch (err) {
    if (err.response.status === 404) {
      console.log("Resource could not be found!");
    } else if (err.response.status === 401) {
      console.log("Unauthorized!");
    } else {
      console.log(err.message);
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

    // let data = await res.json();
    return res;
    // console.log(res.data.data);
    // console.log(res.status);
  } catch (err) {
    if (err.response.status === 404) {
      console.log("Resource could not be found!");
    } else if (err.response.status === 401) {
      console.log("Unauthorized!");
    } else {
      console.log(err.message);
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
    // let data = await res.json();
    // console.log(res.data.data.data);
    // console.log(res.status);
  } catch (error) {
    console.log(error);
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
    // let data = await res.json();
    // console.log(res.data.data.data);
    // console.log(res.status);
  } catch (error) {
    console.log(error);
  }
};

const createPayment = async (data) => {
  
    const payload = {}
    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value)
      payload[key] = value;
      
    });
    const res = await axios.post(`${API_SERVER}payments/create`, JSON.stringify(payload),  {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });
    return res;
    // let data = await res.json();
    // console.log(res.data.data.data);
    // console.log(res.status);
   
};

const editCustomer = async (data,cusid) => {
  
  const payload = {}
  Object.entries(data).forEach(([key, value]) => {
    console.log(key, value)
    payload[key] = value;
    
  });
  const res = await axios.post(`${API_SERVER}customers/edit/${cusid}`, JSON.stringify(payload),  {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
      Accept: `${ACCEPT_TYPE}`,
      "Content-Type": `${ACCEPT_TYPE}`,
    },
  });
  return res;
  // let data = await res.json();
  // console.log(res.data.data.data);
  // console.log(res.status);
 
};

const refundCharge = async (data) => {

    const payload = {}
    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value)
      payload[key] = value;
      
    });

    const res = await axios.post(`${API_SERVER}refunds/create`, JSON.stringify(payload),  {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });
    return res;


};

const updatePassword = async (data) => {

  const payload = {}
  Object.entries(data).forEach(([key, value]) => {
    console.log(key, value)
    payload[key] = value;
    
  });

  const res = await axios.post(`${API_SERVER}users/change-password`, JSON.stringify(payload),  {
    headers: {
      Authorization: `${TOKEN_TYPE} ${TOKEN}`,
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
  updatePassword
};
