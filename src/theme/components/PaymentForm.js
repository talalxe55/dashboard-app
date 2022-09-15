import React, { useState } from "react";
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
  RadioGroup,
  Radio,
  Spacer,
  Box,
} from "@chakra-ui/react";
import {
  TriangleDownIcon,
  InfoIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
  Icon,
} from "@chakra-ui/icons";
import {
  FaPaypal,
  FaPencilAlt,
  FaRegCalendarAlt,
  FaWallet,
} from "react-icons/fa";
import SelectD from "react-select";
import IconBox from "components/Icons/IconBox";
import Currency from "../../api/CountriesCurrency";
import { MastercardIcon, VisaIcon } from "components/Icons/Icons";
import { CreditCard } from "./CreditCard";

const PaymentForm = (props) => {
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
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
            </FormControl>
            <FormControl mt={4}>
              <Flex>
                <FormLabel>Customer </FormLabel>
                <Text color="gray">(Optional)</Text>
              </Flex>
              <SelectD
                className="select_drop"
                color="red"
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
            <Box>
              <CreditCard />
            </Box>
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
