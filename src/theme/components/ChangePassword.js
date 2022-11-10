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
  InputGroup,
  InputRightElement,
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
  Icon,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FaCube } from "react-icons/fa";
import {
  TriangleDownIcon,
  InfoIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import ReactSelect from "react-select";
import Currency from "../../api/CountriesCurrency";
import { CreditCard } from "./CreditCard";
import {
  getCustomersList,
  getAllPayments,
  getAllRefunds,
  refundCharge,
  updatePassword,
} from "api/ApiListing";
import { isReturnStatement } from "typescript";
import {
  AlertUnauthorized,
  AlertDataNotFound,
  AlertRefundCreated,
  AlertPasswordUpdated,
} from "theme/components/AlertDialog";
import { useHistory } from "react-router-dom";
const PasswordForm = (props) => {
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
  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currency, setCurrency] = useState("USD$");
  const [std, setstd] = useState("No Limit Social 99");
  const [errorData, seterrorData] = useState(null);
  const [isUnauthorized, setisUnauthorized] = useState(null);
  const [isSuccess, setisSuccess] = useState(false);
  const [paymentbtnLoader, setpaymentbtnLoader] = useState(false);
  const [confirmRefund, setconfirmRefund] = useState(false);
  const [CreatepaymentBtnText, setCreatepaymentBtnText] = useState(
    "Update Password"
  );
  const [show, setShow] = useState(false);
  const [newshow, setnewShow] = useState(false);
  const [confirmshow, setconfirmShow] = useState(false);
  const {
    bg,
    payment,
    customer,
    setisReload,
    setReloadState,
    isSuccessHandler,
    isUnauthorizedHandler,
  } = props;
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [vals, setVals] = useState({
    password: "",
    new_password: "",
    confirm_password: "",
  });

  const errSet = {
    password: "",
    new_password: "",
    confirm_password: "",
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
        setpaymentbtnLoader(false);
        setCreatepaymentBtnText("Update Password");
        errvals[key] = "Please provide " + key.replaceAll("_", " ");
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
    console.log(payload);
    const response = updatePassword(payload);
    response
      .then((res) => {
        console.log(res);
        isSuccessHandler(true);
        // setisReload(true)
        // setReloadState(true)
        // toast({
        //     title: 'Sucess',
        //     description: "Your password has been updated",
        //     status: 'success',
        //     duration: 9000,
        //     isClosable: true,
        //   })
        setisSuccess(true);
        onClose;
        setpaymentbtnLoader(false);
        setCreatepaymentBtnText("Password Updated!");
      })
      .catch((err) => {
        console.log(err);
        setpaymentbtnLoader(false);
        setCreatepaymentBtnText("Update Password");
        if (err.response.status == 400) {
          console.log(err.response);
          if (err.response.data.success == false) {
            if (err.response.data.error.password) {
              errvals["password"] = err.response.data.error.password;
              seterrVals({ ...errvals });
            }
            if (err.response.data.error.new_password) {
              errvals["new_password"] = err.response.data.error.new_password;
              seterrVals({ ...errvals });
            }
            if (err.response.data.error.confirm_password) {
              errvals["confirm_password"] =
                err.response.data.error.confirm_password;
              seterrVals({ ...errvals });
            }
          } else {
            seterrorData({
              message: err.response.data.error.message,
              status: "error",
              title: "Password Update Unsuccessfull!",
            });
          }
        }
        if (err.response.status == 501) {
          seterrorData({
            message: err.response.data.error.message,
            status: "error",
            title: "Password Update Unsuccessfull!",
          });
        }

        if (err.response.status == 401) {
          isUnauthorizedHandler(true);
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
          onClick={() => {
            setCreatepaymentBtnText("Update Password");
            seterrorData(null);
          }}
        />
      </Alert>
    ) : (
      ""
    );
  };

  //   const SuccessToast = () => {
  //     const toast = useToast()
  //     return isSuccess? (

  //           toast({
  //             title: 'Sucess',
  //             description: "Your password has been updated",
  //             status: 'success',
  //             duration: 9000,
  //             isClosable: true,
  //           })

  //     ):null
  //   }
  //<AlertPasswordUpdated setisSuccess={setisSuccess}/>
  const handleClick = () => setShow(!show);
  const handlenewClick = () => setnewShow(!newshow);
  const handleconfirmClick = () => setconfirmShow(!confirmshow);

  return (
    <>
      {/* {isUnauthorized ? <AlertUnauthorized /> : null}
            {isSuccess? <AlertPasswordUpdated setisSuccess={setisSuccess}/>: null} */}

      {/* <Button
        bg={props.bg}
        color="white"
        variant="no-hover"
        onClick={onOpen}
        width={{ sm: "200px" }}
        borderRadius={{ sm: 10 }}
        borderColor={"red"}
        _hover={{bg: "transparent", color: "primaryColor"}}
      >
        Create Refund
      </Button> */}
      <Button p="0px" bg="transparent" _hover={{ bg: "none" }} onClick={onOpen}>
        <Flex
          align="center"
          w={{ sm: "100%", lg: "185px" }}
          bg="hsla(0,0%,100%,.3)"
          borderRadius="15px"
          justifyContent="center"
          py="10px"
          boxShadow="inset 0 0 1px 1px hsl(0deg 0% 100% / 90%), 0 20px 27px 0 rgb(0 0 0 / 5%)"
          border="1px solid gray.200"
          cursor="pointer"
        >
          <UnlockIcon me="6px" />
          {/* <Icon as={FaCube} me="6px" /> */}
          <Text fontSize="xs" color={textColor} fontWeight="bold">
            CHANGE PASSWORD
          </Text>
        </Flex>
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent minWidth={{ sm: "35%" }} height={"60%"}>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY={{ sm: "auto" }}>
            {<AlertBox />}
            <form>
              <FormControl mt={4} isRequired>
                <Box>
                  <Flex alignItems={"center"}>
                    <FormLabel m={0} pe={4}>
                      Current Password
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      label="Enter your current password."
                      color="white"
                    >
                      <InfoIcon />
                    </Tooltip>
                  </Flex>
                  <Flex gap={3}>
                    {/* <Input
                      ref={initialRef}
                      type="text"
                      name="passowrd"
                      placeholder=""
                      autoComplete="off"
                      ps={12}
                      minLength={1}
                      onChange={handleValues}
                      value={vals.password}
                    /> */}
                    {/* {<PasswordInput name={"password"} label="Enter your current password" />} */}
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Enter your current password"
                        name="password"
                        onChange={handleValues}
                        value={vals.password}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </Flex>
                  <Text color={"red.500"}>{errvals.password}</Text>
                </Box>
              </FormControl>
              <FormControl mt={4} isRequired>
                <Box>
                  <Flex alignItems={"center"}>
                    <FormLabel m={0} pe={4}>
                      New Password
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      label="Enter your new password."
                      color="white"
                    >
                      <InfoIcon />
                    </Tooltip>
                  </Flex>
                  <Flex gap={3}>
                    {/* <Input
                      ref={initialRef}
                      type="text"
                      name="passowrd"
                      placeholder=""
                      autoComplete="off"
                      ps={12}
                      minLength={1}
                      onChange={handleValues}
                      value={vals.password}
                    /> */}
                    {/* {<NewPasswordInput name={"new_password"} label="Enter your new password" />} */}
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        type={newshow ? "text" : "password"}
                        placeholder="Enter your new password"
                        name="new_password"
                        onChange={handleValues}
                        value={vals.new_password}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handlenewClick}>
                          {newshow ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </Flex>
                  <Text color={"red.500"}>{errvals.new_password}</Text>
                </Box>
              </FormControl>
              <FormControl mt={4} isRequired>
                <Box>
                  <Flex alignItems={"center"}>
                    <FormLabel m={0} pe={4}>
                      Confirm Password
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      label="Re=enter your new password."
                      color="white"
                    >
                      <InfoIcon />
                    </Tooltip>
                  </Flex>
                  <Flex gap={3}>
                    {/* <Input
                      ref={initialRef}
                      type="text"
                      name="passowrd"
                      placeholder=""
                      autoComplete="off"
                      ps={12}
                      minLength={1}
                      onChange={handleValues}
                      value={vals.password}
                    /> */}
                    {
                      /* {<ConfirmPasswordInput name={"confirm_password"} label="Confirm your password" />} */
                      <InputGroup size="md">
                        <Input
                          pr="4.5rem"
                          type={confirmshow ? "text" : "password"}
                          placeholder="Re-enter your new password"
                          name="confirm_password"
                          onChange={handleValues}
                          value={vals.confirm_password}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleconfirmClick}
                          >
                            {confirmshow ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    }
                  </Flex>
                  <Text color={"red.500"}>{errvals.confirm_password}</Text>
                </Box>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              _hover={{ bg: "transparent", color: "primaryColor" }}
              bg={props.bg}
              color="white"
              isLoading={paymentbtnLoader}
              loadingText="Updating Password!"
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setpaymentbtnLoader(true);
                setCreatepaymentBtnText("Updating Password!");
                getAllValues();
              }}
            >
              {CreatepaymentBtnText}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PasswordForm;
