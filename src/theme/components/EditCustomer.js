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
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
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
  createPayment,
  editCustomer,
} from "api/ApiListing";
import { isReturnStatement } from "typescript";
import {
  AlertUnauthorized,
  AlertDataNotFound,
  AlertPaymentCreated,
  AlertCustomerUpdated
} from "theme/components/AlertDialog";
import { useHistory } from "react-router-dom";
const EditCustomer = (props) => {
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

  const { customer, defaultsource, sources, setisReload, setReloadState} = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentbtnLoader, setpaymentbtnLoader] = useState(false);
  const [currency, setCurrency] = useState("USD$");
  const [std, setstd] = useState("No Limit Social 99");
  const [errorData, seterrorData] = useState(null);
  const [isUnauthorized, setisUnauthorized] = useState(null);
  const [isSuccess, setisSuccess] = useState(false);
  const [updateCusBtnText, setupdateCusBtnText] = useState("Update Customer");
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const cusid = customer.id;

  const [vals, setVals] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    description: "",
    address: customer.address!==null?{
        city: customer.address.city,
        country: customer.address.country,
        line1: customer.address.line_1,
        line2: customer.address.line_2,
        postal_code: customer.address.postal_code,
        state: customer.address.state,
    }:{
        city: "",
        country: "",
        line1: "",
        line2: "",
        postal_code: "",
        state: "",
    }
  });

  const errSet = {
    name: "",
    email: "",
    description: "",
    statement_descriptor: "",
    default_source: "",
    phone: "",
    address: {
        
        city: "",
        country: "",
        line_1: "",
        line_2: "",
        postal_code: "",
        state: "",
        
    }
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

  const handleAddress = (e) => {
    const { name, value } = e.target;
    vals.address[name] = value;
    setVals({ ...vals });
    // setVals((preval) => {
    //   return {
    //     ...preval,
    //     address.city: value,
    //   };
    // });
  };

  const getAllValues = (e) => {
    var checked = true;
    let payload = {};

    if (!checked) {
      return;
    }
    
    const response = editCustomer(vals,cusid);
    response
      .then((res) => {
        setisReload(true)
        setReloadState(true)
        setpaymentbtnLoader(false);
        setupdateCusBtnText("Customer Updated!");
        setisSuccess(true);
        
      })
      .catch((err) => {
        setpaymentbtnLoader(false);
        setupdateCusBtnText("Request Failed!");
        if (err.response.status == 400) {
            seterrorData({
              message: err.response.data.error.message,
              status: "error",
              title: "Your request was not submitted successfully.",
            });
            errvals[err.response.data.error.param] =
              err.response.data.error.message;
            seterrVals({ ...errvals });
            
        }
        if (err.response.status == 501) {
          seterrorData({
            message: err.response.data.error.message,
            status: "error",
            title: "An error occurred!",
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
          onClick={() => {setupdateCusBtnText('Update Customer'); seterrorData(null)}}
        />
      </Alert>
    ) : (
      ""
    );
  };
  return (
    <>
      {isUnauthorized ? <AlertUnauthorized /> : null}
      {isUnauthorized ? <AlertUnauthorized /> : null}
      {isSuccess ? <AlertCustomerUpdated setisSuccess={setisSuccess}/>: null}
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
        Edit Information
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent minWidth={{ sm: "35%" }} height={"80%"}>
          <ModalHeader>Update Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY={{ sm: "auto" }}>
            {<AlertBox />}
            <form>
              <FormControl isRequired>
                <Box>
                  <FormLabel>Name</FormLabel>
                    <Input
                      ref={initialRef}
                      type="text"
                      name="name"
                      placeholder=""
                      autoComplete="off"
                      onChange={handleValues}
                      value={vals.name}
                    />                 
                  <Text color={"red.500"}>{errvals.name}</Text>
                </Box>
              </FormControl>
              <FormControl mt={4}>
                <Flex>
                  <FormLabel>Account Email </FormLabel>
                </Flex>
                <Input
                  placeholder="Email"
                  name="email"
                  onChange={handleValues}
                  value={vals.email}
                />
                <Text color={"red.500"}>{errvals.email}</Text>
              </FormControl>
              <FormControl mt={4}>
                <Flex>
                  <FormLabel>Account Phone </FormLabel>
                </Flex>
                <Input
                  placeholder="Phone"
                  name="phone"
                  onChange={handleValues}
                  value={vals.phone}
                />
                <Text color={"red.500"}>{errvals.phone}</Text>
              </FormControl>
              <FormControl mt={4}>
                <Flex alignItems={"center"}>
                  <FormLabel m={0} pe={4}>
                    Description
                  </FormLabel>
                  <Tooltip
                    hasArrow
                    label="To identify or associate with customers."
                    color="white"
                  >
                    <InfoIcon />
                  </Tooltip>
                </Flex>
                <Input
                  placeholder="Source/Referrence of Customer"
                  name="description"
                  onChange={handleValues}
                  value= {vals.description}
                />
                <Text color={"red.500"}>{errvals.description}</Text>
              </FormControl>
              <Accordion allowToggle>
                <FormControl mt={4}>
                <AccordionItem>
               
                    <AccordionButton>
                    <FormLabel fontWeight={"bold"}>
                    Billing Information
                  </FormLabel>
                    <AccordionIcon />
                    </AccordionButton>
                
                <AccordionPanel pb={4}>
                <FormLabel m={0} pe={4} fontWeight={"bold"}>
                    Line 1
                  </FormLabel>
                <Input
                  placeholder="Line 1 Street Address"
                  type="text"
                  name="line1"
                  onChange={handleAddress}
                  value= {vals.address.line1}
                />
                <Text color={"red.500"}>{errvals.address.line_1}</Text>
                <FormLabel m={0} pe={4} fontWeight={"bold"}>
                    Line 2
                  </FormLabel>
                <Input
                  placeholder="Line 2 Street Address"
                  type="text"
                  name="line2"
                  onChange={handleAddress}
                  value= {vals.address.line2}
                />
                 <Text color={"red.500"}>{errvals.address.line_2}</Text>
                <FormLabel m={0} pe={4} fontWeight={"bold"}>
                    City
                  </FormLabel>
                <Input
                  placeholder="City"
                  type="text"
                  name="city"
                  onChange={handleAddress}
                  value= {vals.address.city}
                />
                 <Text color={"red.500"}>{errvals.address.city}</Text>
                <FormLabel m={0} pe={4} fontWeight={"bold"}>
                    State
                  </FormLabel>
                <Input
                  placeholder="State"
                  type="text"
                  name="state"
                  onChange={handleAddress}
                  value= {vals.address.state}
                />
                 <Text color={"red.500"}>{errvals.address.state}</Text>
                <FormLabel m={0} pe={4} fontWeight={"bold"}>
                    Postal Code
                  </FormLabel>
                <Input
                  placeholder="Postal Code"
                  type="text"
                  name="postal_code"
                  onChange={handleAddress}
                  value= {vals.address.postal_code}
                />
                 <Text color={"red.500"}>{errvals.address.postal_code}</Text>
                <FormLabel m={0} pe={4} fontWeight={"bold"}>
                    Country
                  </FormLabel>
                <Input
                  placeholder="Country"
                  type="text"
                  name="country"
                  onChange={handleAddress}
                  value= {vals.address.country}
                />
                 <Text color={"red.500"}>{errvals.address.country}</Text>
                </AccordionPanel>
                </AccordionItem>
                </FormControl>
                </Accordion>
              {sources!==null&&sources.data.length>0?<FormControl mt={4}>
                {console.log(sources)}
                <Flex alignItems={"center"}>
                  <FormLabel m={0} pe={4}>
                  <Heading fontSize="xl">Default Source</Heading>
                  </FormLabel>
                  <Tooltip
                    hasArrow
                    label="The first source in the dropdown is the current default source. Select another source to change the default source."
                    color="white"
                  >
                    <InfoIcon />
                  </Tooltip>
                </Flex>
                
                <Divider my={4} />
                {/* <Radio value="master" defaultChecked="true">
                  Manually enter card information
                </Radio>
                <CreditCard getCreditData={getCreditData} /> */}
                <Stack width={400}>
                  <Select
                    id="source"
                    icon={<TriangleDownIcon />}
                    name="default_source"
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
                <Text color={"red.500"}>{errvals.default_source}</Text>
              </FormControl>:""}
              {/* <BillingAdd /> */}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button isLoading={paymentbtnLoader} loadingText="Updating Customer!" colorScheme="blue" mr={3} onClick={() => {setpaymentbtnLoader(true); setupdateCusBtnText("Updating Customer!"); getAllValues()}}>
              {updateCusBtnText}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default EditCustomer;
