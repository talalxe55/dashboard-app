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
  Form,
} from "@chakra-ui/react";
import {
  TriangleDownIcon,
  InfoIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import SelectD from "react-select";
import Currency from "../../api/CountriesCurrency";
import { CreditCard } from "./CreditCard";

const PaymentForm = (props) => {
  const options = [
    { value: "Josh 1", label: "Josh 1" },
    { value: "Josh 2", label: "Josh 2" },
    { value: "Josh 3", label: "Josh 3" },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currency, setCurrency] = useState("USD$");
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  return (
    <>
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
            <FormControl isRequired>
              <Box>
                <FormLabel>Amount</FormLabel>
                <Text mb={"-31px"} mt={4} ms={2} fontSize="small" color="gray">
                  {currency}
                </Text>
                <Flex gap={3}>
                  <Input
                    ref={initialRef}
                    type="number"
                    name="amt"
                    placeholder=""
                    autoComplete="off"
                    ps={12}
                  />
                  <Stack width={300}>
                    <Select
                      id="currencysym"
                      icon={<TriangleDownIcon />}
                      onChange={() =>
                        setCurrency(
                          document.getElementById("currencysym").value === "USD"
                            ? "USD$"
                            : document.getElementById("currencysym").value
                        )
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
                  </Stack>
                </Flex>
              </Box>
            </FormControl>
            <FormControl mt={4}>
              <Flex>
                <FormLabel>Customer </FormLabel>
                <Text color="gray">(Optional)</Text>
              </Flex>
              <SelectD
                className="select_drop"
                options={options}
                placeholder="Find Customer"
              />
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
              <Input placeholder="Products or services associated with payment" />
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
              <CustomControlsExample />
            </FormControl>
            <FormControl mt={4}>
              <Heading fontSize="xl">Payment method</Heading>
              <Divider my={4} />
              <Radio value="master" defaultChecked="true">
                Manually enter card information
              </Radio>
              {/* <Flex
                  p="1rem"
                  bg="transparent"
                  borderRadius="15px"
                  width="100%"
                  border="1px solid"
                  borderColor={"gray.400"}
                  align="center"
                  mb={{ sm: "24px", md: "0px" }}
                  me={{ sm: "0px", md: "24px" }}
                >
                  <IconBox me="10px" w="25px" h="22px">
                    <MastercardIcon w="100%" h="100%" />
                  </IconBox>
                  <Text color="gray.400" fontSize="md" fontWeight="semibold">
                    7812 2139 0823 XXXX
                  </Text>
                  <Spacer />
                  <Button
                    p="0px"
                    bg="transparent"
                    w="16px"
                    h="16px"
                    variant="no-hover"
                  >
                    <Icon as={FaPencilAlt} />
                  </Button>
                </Flex> */}
            </FormControl>

            <FormControl>
              <CreditCard />
            </FormControl>
            <BillingAdd />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Submit Payment
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const CustomControlsExample = () => {
  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="start" size="sm">
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
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
      defaultValue="FOXTAIL-TURF"
      fontSize="md"
      isPreviewFocusable={false}
    >
      <EditablePreview />
      {/* Here is the custom input */}
      <Input as={EditableInput} />
      <EditableControls />
    </Editable>
  );
};

export default PaymentForm;

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
    // console.log(data.auth_token);
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
      // console.log(res);
      let data = await res.json();
      // console.log(data);
      if (res.status !== 200) {
        console.warn("Generate a new token!");
      } else {
        console.log("Universal Countries: Token Generated!");
        // console.log(data[0].country_name);
        setCountries(data);
      }
    } catch (error) {
      console.log("hmmm new err ehh! " + error);
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
      // console.log(res);
      let data = await res.json();
      // console.log(data);
      setcStates(data);
    } catch (error) {
      console.log("hmmm new err states ehh! " + error);
    }
  };
  const handleStates = () => {
    setIniStates(document.getElementById("countrieslist").value);
    getStatesList();
  };

  useEffect(() => {
    getCountriesAccessToken();
    getCountriesList();
    // getStatesList();
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
                <option value defaultValue disabled color="gray" selected>
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
                <option value defaultValue disabled color="gray" selected>
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
