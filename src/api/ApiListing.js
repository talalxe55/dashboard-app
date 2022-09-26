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
    // let data = await res.json();
    console.log(res.data.data.data);
    console.log(res.status);
  } catch (error) {
    console.log(error);
  }
};

const getCustomerID = async () => {
  try {
    const res = await axios.get(`${API_SERVER}customers/cus_MUAJ4H3JWVHQiR`, {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });
    // let data = await res.json();
    console.log(res.data.data.data);
    console.log(res.status);
  } catch (error) {
    console.log(error);
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
    console.log(res.data.data.data);
    console.log(res.status);
  } catch (error) {
    console.log(error);
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
    console.log(res.data.data.data);
    console.log(res.status);
  } catch (error) {
    console.log(error);
  }
};

export { getCustomersList, getAllPayments, getAllRefunds, getCustomerID };
