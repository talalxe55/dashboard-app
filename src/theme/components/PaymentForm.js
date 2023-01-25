import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Stack,
  Text,
  Tooltip,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
  IconButton,
  ButtonGroup,
  Heading,
  Divider,
  Radio,
  Box,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import {
  TriangleDownIcon,
  InfoIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import ReactSelect from "react-select";
import Currency from "../../api/CountriesCurrency";
//import { CreditCard } from "./CreditCard";
import {
  getCustomersList,
  getAllPayments,
  getAllRefunds,
  createPayment,
} from "api/ApiListing";
// import { isReturnStatement } from "typescript";
import {
  AlertUnauthorized,
  AlertDataNotFound,
  AlertPaymentCreated,
} from "theme/components/AlertDialog";
import { useHistory } from "react-router-dom";
const PaymentForm = (props) => {
  useEffect(() => {
    // getCustomersList();
    // getAllPayments();
    getAllRefunds();
  }, []);

  const options = [
    { value: "Josh 1", label: "Josh 1" },
    { value: "Josh 2", label: "Josh 2" },
    { value: "Josh 3", label: "Josh 3" },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currency, setCurrency] = useState("USD$");
  const [std, setstd] = useState("No Limit Social 99");
  const [errorData, seterrorData] = useState(null);
  const [isUnauthorized, setisUnauthorized] = useState(null);
  const [isSuccess, setisSuccess] = useState(false);
  const [paymentbtnLoader, setpaymentbtnLoader] = useState(false);
  const [CreatepaymentBtnText, setCreatepaymentBtnText] = useState("Create Payment");
  const { customer, defaultsource, sources, email, setisReload, setReloadState } = props;
  const [isbtnDisabled, setisbtnDisabled] = useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [vals, setVals] = useState({
    amount: 1,
    customer: customer.id,
    currency: "usd",
    description: "",
    statement_descriptor: "No Limit Social 99",
    source: defaultsource.card.id,
    metadata: {
      site_url: "https://nolimitsocial99.com",
    },
    receipt_email: "josh@nolimitsocial99.com",
    confirm: true,
  });

  const errSet = {
    amount: "",
    customer: "",
    currency: "",
    description: "",
    statement_descriptor: "",
    source: "",
  };
  const [errvals, seterrVals] = useState(errSet);

  const handleAmount = (e) => {
    if (e.target.value <= 1) {
      e.target.value === "";
    }
  };

  const handleValues = (e) => {
    const { name, value } = e.target;
    setVals((preval) => {
      return {
        ...preval,
        [name]: value,
      };
    });
  };

  const getAllValues = (e) => {
    var checked = true;
    let payload = {};
    Object.entries(vals).forEach(([key, value]) => {
      if (value === null || value === "" || value < 1) {
        checked = false;
        setpaymentbtnLoader(false)
        setisbtnDisabled(false);
        setCreatepaymentBtnText("Create Payment");
        errvals[key] = "Please provide " + key;
        seterrVals({ ...errvals });
      } else {
        payload[key] = value;
        errvals[key] = "";
        seterrVals({ ...errvals });
      }
    });

    if (!checked) {
      return;
    }
    if (email) {
      payload["metadata"] = { ...payload["metadata"], customer_email: email };
    }
    const response = createPayment(payload);
    response
      .then((res) => {
        setisReload(true)
        setReloadState(true)
        setisSuccess(true);
        setpaymentbtnLoader(false)
        setisbtnDisabled(false)
        seterrorData(null)
        onClose();
        setCreatepaymentBtnText("Create Payment");
      })
      .catch((err) => {
        setpaymentbtnLoader(false)
        setCreatepaymentBtnText("Create Payment");
        setisbtnDisabled(false);
        if (err.response.status == 400) {
          if (err.response.data.success == false) {
            if (err.response.data.error.amount) {
              errvals["amount"] = err.response.data.error.amount;
              seterrVals({ ...errvals });
            }
            if (err.response.data.error.currency) {
              errvals["currency"] = err.response.data.error.currency;
              seterrVals({ ...errvals });
            }
          } else {
            seterrorData({
              message: err.response.data.error.message,
              status: "error",
              title: "Payment Unsuccessfull",
            });
            errvals[err.response.data.error.param] =
              err.response.data.error.message;
            seterrVals({ ...errvals });
          }
        }
        if (err.response.status == 501) {
          seterrorData({
            message: err.response.data.error.message,
            status: "error",
            title: "Payment Unsuccessfull",
          });
        }

        if (err.response.status == 401) {
          setisUnauthorized(true);
        }
      });
  };

  const getCreditData = (data) => {
    setVals({ ...vals, data });
  };

  const Descriptor = (props) => {
    function EditableControls() {
      const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps,
      } = useEditableControls();

      return isEditing ? (
        <ButtonGroup justifyContent="start" size="sm">
          <IconButton
            icon={<CheckIcon />}
            {...getSubmitButtonProps()}
            onClick={(e) => {
              vals.statement_descriptor = document.querySelector(
                'input[name="statement_descriptor"]'
              ).value;
              setVals({ ...vals });
            }}
          />
          <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
        </ButtonGroup>
      ) : (
        <IconButton
          size="sm"
          ms={2}
          bg="transparent"
          icon={<EditIcon />}
          {...getEditButtonProps()}
        />
      );
    }

    return (
      <Editable
        fontSize="md"
        isPreviewFocusable={false}
        defaultValue={vals.statement_descriptor}
      >
        <EditablePreview />
        {/* Here is the custom input */}
        <Input
          as={EditableInput}
          name="statement_descriptor"
          // onChange={
          //   ((e) =>{console.log(e.target.value, std); setstd(e.target.value)})}
        />
        <EditableControls />
      </Editable>
    );
  };

  const AlertBox = () => {
    const { isOpen: isVisible, onClose, onOpen } = useDisclosure({
      defaultIsOpen: true,
    });
    //const [message, error, status, title] = props;
    return errorData !== null ? (
      <Alert status={errorData.status}>
        <AlertIcon />
        <Box>
          <AlertTitle>{errorData.title}</AlertTitle>
          <AlertDescription>{errorData.message}</AlertDescription>
        </Box>
        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          top={-1}
          onClick={() => {setCreatepaymentBtnText("Create Payment"); seterrorData(null);}}
        />
      </Alert>
    ) : (
      ""
    );
  };
  return (
    <>
      {isUnauthorized ? <AlertUnauthorized /> : null}
      {isSuccess ? <AlertPaymentCreated setisSuccess={setisSuccess}/>: null}
      <Button
        bg={props.bg}
        color="white"
        variant="no-hover"
        onClick={onOpen}
        width={{ sm: "200px" }}
        borderRadius={{ sm: 10 }}
      >
        Create Payment
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent minWidth={{ sm: "35%" }} height={"80%"}>
          <ModalHeader>Create Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY={{ sm: "auto" }}>
            {<AlertBox />}
            <form>
              <FormControl isRequired>
                <Box>
                  <FormLabel>Amount</FormLabel>
                  <Text
                    mb={"-31px"}
                    mt={4}
                    ms={2}
                    fontSize="small"
                    color="gray"
                  >
                    {currency}
                  </Text>
                  <Flex gap={3}>
                    <Input
                      ref={initialRef}
                      type="number"
                      name="amount"
                      placeholder=""
                      autoComplete="off"
                      ps={12}
                      minLength={1}
                      onChange={(handleAmount, handleValues)}
                      value={vals.amount}
                    />

                    {/* <Stack width={300}>
                      <Select
                        id="currencysym"
                        icon={<TriangleDownIcon />}
                        name="currency"
                        onChange={
                          (() =>
                            setCurrency(
                              document.getElementById("currencysym").value ===
                                "USD"
                                ? "USD$"
                                : document.getElementById("currencysym").value
                            ),
                          handleValues)
                        }
                      >
                        
                        {Currency.map((val, index) => {
                          return (
                            <option value={val.abbreviation} key={index}>
                              {val.abbreviation + " - " + val.currency}
                            </option>
                          );
                        })}
                      </Select>
                    </Stack> */}
                  </Flex>
                  <Text color={"red.500"}>{errvals.amount}</Text>
                </Box>
              </FormControl>
              <FormControl mt={4}>
                <Flex>
                  <FormLabel>Customer </FormLabel>
                  {/* <Text color="gray">(Optional)</Text> */}
                </Flex>
                {/* <ReactSelect
                  className="select_drop"
                  options={options}
                  placeholder="Find Customer"
                  name="customers"
                  onChange={(e) => {
                    setVals({ ...vals, customer: e });
                  }}
                  
                  // value={vals.customer}
                /> */}
                <Input
                  placeholder="Customer"
                  name="customer"
                  onChange={handleValues}
                  value={customer.name + ", " + customer.email}
                  readOnly={true}
                />
                <Text color={"red.500"}>{errvals.customer}</Text>
              </FormControl>
              <FormControl mt={4}>
                <Flex alignItems={"center"}>
                  <FormLabel m={0} pe={4}>
                    Description
                  </FormLabel>
                  <Tooltip
                    hasArrow
                    label="Some card issuers include this on the customer's statement."
                    color="white"
                  >
                    <InfoIcon />
                  </Tooltip>
                </Flex>
                <Input
                  placeholder="Products or services associated with payment"
                  name="description"
                  onChange={handleValues}
                />
                <Text color={"red.500"}>{errvals.description}</Text>
              </FormControl>
              <FormControl mt={4}>
                <Flex alignItems={"center"}>
                  <FormLabel m={0} pe={4}>
                    Statement descriptor
                  </FormLabel>
                  <Tooltip
                    hasArrow
                    label="This is the business name your customers will see on their card statements and other transactions."
                    color="white"
                  >
                    <InfoIcon />
                  </Tooltip>
                </Flex>
                <Descriptor />
                <Text color={"red.500"}> {errvals.statement_descriptor}</Text>
              </FormControl>
              <FormControl mt={4}>
                <Heading fontSize="xl">Payment method</Heading>
                <Divider my={4} />
                {/* <Radio value="master" defaultChecked="true">
                  Manually enter card information
                </Radio>
                <CreditCard getCreditData={getCreditData} /> */}
                <Stack width={400}>
                  <Select
                    id="source"
                    icon={<TriangleDownIcon />}
                    name="source"
                    onChange={(e) => handleValues(e)}
                  >
                    {sources.data.map((val, index) => {
                      return val.object === "card" ? (
                        <option value={val.id} key={index}>
                          XXXX XXXX {val.last4} {val.exp_month} / {val.exp_year}{" "}
                          {val.brand}
                        </option>
                      ) : (
                        <option value={val.id} key={index}>
                          {val.card
                            ? "XXXX XXXX XXXX " +
                              val.card.last4 +
                              " " +
                              val.card.exp_month +
                              " / " +
                              val.card.exp_year +
                              " " +
                              val.card.brand
                            : val.ach_credit_transfer
                            ? val.ach_credit_transfer.bank_name +
                              " " +
                              val.ach_credit_transfer.account_number
                            : ""}
                        </option>
                      );
                    })}
                  </Select>
                </Stack>
                <Text color={"red.500"}>{errvals.source}</Text>
              </FormControl>
              {/* <BillingAdd /> */}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button isDisabled={isbtnDisabled} isLoading={paymentbtnLoader} loadingText='Creating Payment!' colorScheme="blue" mr={3} onClick={() => {setpaymentbtnLoader(true); setisbtnDisabled(true); setCreatepaymentBtnText('Creating Payment!'); getAllValues()}}>
             {CreatepaymentBtnText}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const BillingAdd = () => {
  const [ischecked, setChecked] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cstates, setcStates] = useState([]);
  const [iniState, setIniStates] = useState("Afghanistan");

  const handleChange = () => {
    setChecked(!ischecked);
  };

  const getCountriesAccessToken = async () => {
    let url = "https://www.universal-tutorial.com/api/getaccesstoken";
    let res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "api-token":
          "DTNO0fXZYF9hxkQD6b6UsCPuU8GxbpFLUSZgXYKSuYla79ijZklqnFtUWp9mrieZHKI",
        "user-email": "joshuaheadofdm@gmail.com",
      },
    });
    let data = await res.json();
    let authToken = data.auth_token;
    localStorage.setItem("countryapi", authToken);
  };

  let countriesToken = localStorage.getItem("countryapi");
  const getCountriesList = async () => {
    try {
      let url = "https://www.universal-tutorial.com/api/countries/";
      let res = await fetch(url, {
        Method: "GET",
        headers: {
          Authorization: "Bearer " + countriesToken,
          Accept: "application/json",
        },
      });
      let data = await res.json();
      if (res.status !== 200) {
        console.warn("Generate a new token!");
      } else {
        setCountries(data);
      }
    } catch (error) {
    }
  };
  const getStatesList = async () => {
    try {
      let url = `https://www.universal-tutorial.com/api/states/${iniState}`;
      let res = await fetch(url, {
        Method: "GET",
        headers: {
          Authorization: "Bearer " + countriesToken,
          Accept: "application/json",
        },
      });
      let data = await res.json();
      setcStates(data);
    } catch (error) {
    }
  };
  const handleStates = () => {
    setIniStates(document.getElementById("countrieslist").value);
    getStatesList();
  };

  useEffect(() => {
    getCountriesAccessToken();
    getCountriesList();
  }, []);
  return (
    <>
      <FormControl mt={3}>
        <Stack mb={3}>
          <Checkbox checked={ischecked} onChange={handleChange}>
            Add billing address
          </Checkbox>
          <Text mb={0} fontSize="small" color="gray.300">
            Card billing details may help improve authorisation rates.
          </Text>
        </Stack>
        {ischecked && (
          <>
            <Stack my={4}>
              <Select
                id="countrieslist"
                icon={<TriangleDownIcon />}
                onChange={handleStates}
              >
                <option value="" defaultValue disabled color="gray">
                  Select Country
                </option>
                {countries.map((val, index) => {
                  return (
                    <option value={val.country_name} key={index}>
                      {val.country_name}
                    </option>
                  );
                })}
              </Select>
            </Stack>
            <Stack direction={"column"}>
              <Input placeholder="Address Line 1" autoComplete="off" />
              <Input placeholder="Address Line 2" autoComplete="off" />
              <Select icon={<TriangleDownIcon />}>
                <option value defaultValue disabled color="gray">
                  Select State
                </option>
                {cstates.map((val, index) => {
                  return (
                    <option value={val.state_name} key={index}>
                      {val.state_name}
                    </option>
                  );
                })}
              </Select>
              <Input placeholder="City" autoComplete="off" />
            </Stack>
          </>
        )}
      </FormControl>
    </>
  );
};

export default PaymentForm;
