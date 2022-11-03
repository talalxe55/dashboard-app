import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { useAuth } from "../../auth-context/auth.context";

const AlertCustomerCreated = (props) => {
  const history = useHistory();
  const {setisSuccess} = props;
  return (
    <SweetAlert
      success
      title="Customer has been created successfully!"
      confirmBtnText="OKK!"
      onCancel={() => setisSuccess(false)}
      onConfirm={() => setisSuccess(false)}
      customClass="alert_pop"
    />
  );
};

const AlertCustomerUpdated = (props) => {
  const history = useHistory();
  const {setisSuccess} = props;
  return (
    <SweetAlert
      success
      title="Customer has been updated successfully!"
      confirmBtnText="OKK!"
      onCancel={() => setisSuccess(false)}
      onConfirm={() => setisSuccess(false)}
      customClass="alert_pop"
    />
  );
};

const AlertPaymentCreated = (props) => {
  const history = useHistory();
  const {setisSuccess} = props;
  return (
    <SweetAlert
      success
      title="Payment has been created successfully!"
      confirmBtnText="OKK!"
      onCancel={() => setisSuccess(false)}
      onConfirm={() => setisSuccess(false)}
      customClass="alert_pop"
    />
  );
};

const AlertRefundCreated = (props) => {
  const history = useHistory();
  const {setisSuccess} = props;
  return (
    <SweetAlert
      success
      title="Refund has been created successfully!"
      confirmBtnText="OKK!"
      onCancel={() => setisSuccess(false)}
      onConfirm={() => setisSuccess(false)}
      customClass="alert_pop"
    />
  );
};

const AlertChargeSucceeded = (props) => {
  const history = useHistory();
  const {setisSuccess} = props;
  return (
    <SweetAlert
      success
      title="Payment has been charged successfully!"
      confirmBtnText="OKK!"
      onCancel={() => setisSuccess(false)}
      onConfirm={() => setisSuccess(false)}
      customClass="alert_pop"
    />
  );
};

const AlertPasswordUpdated = (props) => {
  const history = useHistory();
  const {setisSuccess} = props;
  const { setUser } = useAuth();
  return (
    <SweetAlert
      success
      title="Password has been updated successfully. Please log in again!"
      confirmBtnText="OKK!"
      //onCancel={() => setisSuccess(false)}
      onConfirm={() => {setUser(null);
        localStorage.removeItem("user");
        history.push("/auth/signin"); }}
      customClass="alert_pop"
    />
  );
};

const AlertUnauthorized = () => {
  const history = useHistory();
  const { setUser } = useAuth();
  return (
    <SweetAlert
      danger
      title="Your session has expired!"
      confirmBtnText="OKK!"
      onCancel={() => history.push("/auth/signin")}
      onConfirm={() => {
        setUser(null);
        localStorage.removeItem("user");
        history.push("/auth/signin");
      }}
      customClass="alert_pop"
    />
  );
};

const AlertDataNotFound = (props) => {
  const history = useHistory();
  const {setisSuccess} = props;
  return (
    <SweetAlert
      warning
      title="The requested resource was not found!"
      confirmBtnText="OK!"
      onCancel={() => setisSuccess(false)}
      onConfirm={() => setisSuccess(false)}
      customClass="alert_pop"
    />
  );
};

export {
  AlertCustomerCreated,
  AlertCustomerUpdated,
  AlertUnauthorized,
  AlertDataNotFound,
  AlertPaymentCreated,
  AlertRefundCreated,
  AlertChargeSucceeded,
  AlertPasswordUpdated
};
