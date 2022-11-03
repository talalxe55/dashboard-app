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
import { CreditCard } from "./CreditCard";
import {
  getCustomersList,
  getAllPayments,
  getAllRefunds,
  refundCharge,
} from "api/ApiListing";
import { isReturnStatement } from "typescript";
import {
  AlertUnauthorized,
  AlertDataNotFound,
  AlertRefundCreated
} from "theme/components/AlertDialog";
import { useHistory } from "react-router-dom";
const RefundForm = (props) => {
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
  const [confirmRefund, setconfirmRefund] = useState(false);
  const [CreatepaymentBtnText, setCreatepaymentBtnText] = useState("Create Refund");
  const { bg, payment, customer, setisReload, setReloadState } = props;
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [vals, setVals] = useState({
    amount: 1,
    payment_intent: payment.id,
    reason: 'duplicate',
    metadata: {
      site_url: "https://nolimitsocial99.com",
    },
  });

  const errSet = {
    amount: "",
    reason: "",
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
        setCreatepaymentBtnText("Create Refund");
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

    const response = refundCharge(payload);
    response
      .then((res) => {
        console.log(res);
        setisReload(true)
        setReloadState(true)
        setisSuccess(true);
        setpaymentbtnLoader(false)
        setCreatepaymentBtnText("Refund Created!");
      })
      .catch((err) => {
        setpaymentbtnLoader(false)
        setCreatepaymentBtnText("Refund Failed!");
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
              title: "Refund Unsuccessfull",
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
            title: "Refund Unsuccessfull",
          });
        }

        if (err.response.status == 401) {
          setisUnauthorized(true);
        }
      });
  };

  const getCreditData = (data) => {
    // console.log("Data comming from CreditCard", data);
    setVals({ ...vals, data });
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
          onClick={() => {setCreatepaymentBtnText("Create Refund"); seterrorData(null);}}
        />
      </Alert>
    ) : (
      ""
    );
  };
  return (
    <>
      {isUnauthorized ? <AlertUnauthorized /> : null}
      {isSuccess ? <AlertRefundCreated setisSuccess={setisSuccess}/>: null}

      <Button
        bg={props.bg}
        color="white"
        variant="no-hover"
        onClick={onOpen}
        width={{ sm: "200px" }}
        borderRadius={{ sm: 10 }}
        borderColor={"red"}
        _hover={{bg: "transparent", color: "teal.300"}}
      >
        Create Refund
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent minWidth={{ sm: "35%" }} height={"50%"}>
          <ModalHeader>Create Refund</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY={{ sm: "auto" }}>
            {<AlertBox />}
            <form>
              <FormControl mt={4} isRequired>
                <Box>
                <Flex alignItems={"center"}>
                  <FormLabel m={0} pe={4}>Amount</FormLabel>
                  <Tooltip
                    hasArrow
                    label="Amount in dollars. Minimum amount is $1."
                    color="white"
                  >
                    <InfoIcon />
                  </Tooltip>
                  </Flex>
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

                  </Flex>
                  <Text color={"red.500"}>{errvals.amount}</Text>
                </Box>
              </FormControl>
              {/* <FormControl mt={4}>
                <Flex>
                  <FormLabel>Customer </FormLabel>
                </Flex>

                <Input
                  placeholder="Customer"
                  name="customer"
                  onChange={handleValues}
                  value={customer.name + ", " + customer.email}
                  readOnly={true}
                />
                <Text color={"red.500"}>{errvals.customer}</Text>
              </FormControl> */}
              <FormControl mt={4}>
              <Flex alignItems={"center"}>
              <FormLabel m={0} pe={4}>
                <Heading fontSize="xl">Refund Reason</Heading>
                    </FormLabel>
                    <Tooltip
                    hasArrow
                    label="Provide Reason to refund carefully. Fraudulent may lead to blocking of the card!"
                    color="white"
                  >
                    <InfoIcon />
                    </Tooltip>
                  </Flex>


                <Divider my={4} />
                <Stack width={400}>
                  <Select
                    id="reason"
                    icon={<TriangleDownIcon />}
                    name="source"
                    onChange={(e) => handleValues(e)}
                  >
                    <option value="requested_by_customer">Requested By Customer</option>
                    <option value="duplicate">Duplicate</option>
                    <option value="fraudulent">Fraudulent</option>
                  </Select>
                </Stack>
                <Text color={"red.500"}>{errvals.reason}</Text>
              </FormControl>
              {/* <BillingAdd /> */}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button _hover={{bg: "transparent", color: "teal.300"}} bg={props.bg} color="white" isLoading={paymentbtnLoader} loadingText='Creating Refund!' colorScheme="blue" mr={3} onClick={() => {setpaymentbtnLoader(true); setCreatepaymentBtnText('Creating Refund!'); getAllValues();}}>
             {CreatepaymentBtnText}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};




export default RefundForm;
