import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";

const AlertCustomerCreated = () => {
  const history = useHistory();
  return (
    <SweetAlert
      success
      title="Customer has been created successfully!"
      confirmBtnText="OKK!"
      onCancel={() => history.push("/auth/dashboard")}
      onConfirm={() => history.push("/auth/dashboard")}
      customClass="alert_pop"
    />
  );
};

const AlertUnauthorized = () => {
  const history = useHistory();
  return (
    <SweetAlert
      danger
      title="Your session has expired!"
      confirmBtnText="OKK!"
      onCancel={() => history.push("/auth/dashboard")}
      onConfirm={() => history.push("/auth/dashboard")}
      customClass="alert_pop"
    />
  );
};

const AlertDataNotFound = () => {
  const history = useHistory();
  return (
    <SweetAlert
      warning
      title="The requested resource was not found!"
      confirmBtnText="OK!"
      onCancel={() => history.push("/auth/dashboard")}
      onConfirm={() => history.push("/auth/dashboard")}
      customClass="alert_pop"
    />
  );
};
export { AlertCustomerCreated, AlertUnauthorized, AlertDataNotFound };
