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

const getAllPaymentsByCustomerID = async () => {
  try {
    const res = await axios.get(`${API_SERVER}payments/cus_MUAJ4H3JWVHQiR`, {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });
    console.log(res.data.data);
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

export {
  getCustomersList,
  getAllPayments,
  getAllPaymentsByCustomerID,
  getAllRefunds,
  getCustomerID,
};
