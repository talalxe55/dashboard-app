import React from "react";
import {
  Flex,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Button,
  Stack,
  Box,
  Input,
  Heading,
  Select,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Fade,
  ScaleFade,
  Slide,
  SlideFade,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Checkbox,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";

import ReactSelect from "react-select";
import { useState } from "react";

const SingleCustomer = () => {

  return (
    <>
      <Flex
        mt={75}
        className="single_customer"
        flexDirection={{ md: "row", sm: "column" }}
        gap={3}
      >
        <Box w={{ md: "25%", sm: "100%" }} position="relative">
          <Box position="fixed" w={"310px"}>
            <Box mb={3}>
              <Heading fontSize={25}>User</Heading>
              <Text>user@123.com</Text>
            </Box>
            <Accordion className="single_customer_sidepanel" allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton
                    _focus={{ shadow: "none", bg: "gray.100" }}
                    borderRadius={0}
                  >
                    <Box flex="1" textAlign="left">
                      Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel className="detail_panel">
                  <Text
                    bg={"gray.100"}
                    w="60%"
                    borderRadius={8}
                    textAlign="center"
                    p={1}
                    m={0}
                  >
                    cus_idnumber123
                  </Text>
                  <Divider h={1} my={2} />
                  <Box className="cus_details">
                    <Heading>Account details</Heading>
                    <Text>User</Text>
                    <Text>user@123.com</Text>
                    <Text>User description</Text>
                  </Box>
                  <Box className="cus_details">
                    <Heading>Billing emails</Heading>
                    <Text>user@123.com</Text>
                  </Box>
                  <Box className="cus_details">
                    <Heading>Billing details</Heading>
                    <Text>No details</Text>
                  </Box>
                  <Box className="cus_details">
                    <Heading>Language</Heading>
                    <Text>English (United States)</Text>
                  </Box>
                  <Box className="cus_details">
                    <Heading>Next invoice number</Heading>
                    <Text>DA5AD08F-0001</Text>
                  </Box>
                  <Box className="cus_details">
                    <Heading>Tax location status</Heading>
                    <Text>Not registered</Text>
                  </Box>
                  <Box className="cus_details">
                    <Heading>Tax status and IDs</Heading>
                    <Text>Taxable</Text>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton
                    _focus={{ shadow: "none", bg: "gray.100" }}
                    borderRadius={0}
                  >
                    <Box flex="1" textAlign="left">
                      Metadata
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel className="detail_panel">
                  <Flex justify={"space-between"}>
                    <Text color={"gray.400"}>Key</Text>
                    <Text>Value</Text>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </Box>
        <Box w={{ md: "75%", sm: "100%" }}>
          <Flex justify="space-between">
            <Heading fontSize={25}>Overview</Heading>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Actions
              </MenuButton>
              <MenuList className="action_menu">
                <Heading>Payments</Heading>
                <MenuItem>Create Payment</MenuItem>
                <MenuItem>Create Invoice</MenuItem>
                <MenuItem>Create Subscription</MenuItem>
                <Heading>Account</Heading>
                <MenuItem>Edit Information</MenuItem>
                <MenuItem>Delete</MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <Box mb={10}>
            <Flex justify={"space-between"} alignItems="center" my={3}>
              <Heading fontSize={18}>Payments</Heading>
              <CreateANewPaymentModal />
            </Flex>
            <TableContainer>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th w={0}>
                      <Checkbox checked={false}/>
                    </Th>
                    <Th>Amount</Th>
                    <Th>Description</Th>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody textTransform={"capitalize"}>
                  <PaymentsList
                    amount="test"
                    status="success"
                    desc="AppsTru - Order 4039"
                    date="23 Sept, 18:30"
                    checkStatus={false}
                  />
                  <PaymentsList
                    amount="test 3"
                    status="success"
                    desc="AppsTru - Order 4039"
                    date="23 Sept, 18:30"
                    checkStatus={false}
                  />
                  <PaymentsList
                    amount="test 2"
                    status="draft"
                    desc="AppsTru - Order 4039"
                    date="23 Sept, 18:30"
                    checkStatus={false}
                  />
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Box mb={10}>
            <Heading fontSize={18} mb={3}>
              Related guest payments
            </Heading>
            <TableContainer>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th w={0}>
                      <Checkbox value="false" />
                    </Th>
                    <Th>Amount</Th>
                    <Th>Description</Th>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody textTransform={"capitalize"}>
                  <PaymentsList
                    amount="test"
                    status="success"
                    desc="AppsTru - Order 4039"
                    date="23 Sept, 18:30"
                  />
                  <PaymentsList
                    amount="test 3"
                    status="success"
                    desc="AppsTru - Order 4039"
                    date="23 Sept, 18:30"
                  />
                  <PaymentsList
                    amount="test 2"
                    status="failed"
                    desc="AppsTru - Order 4039"
                    date="23 Sept, 18:30"
                  />
                  <PaymentsList
                    amount="test 4"
                    status="failed"
                    desc="AppsTru - Order 4039"
                    date="23 Sept, 18:30"
                  />
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <Box mb={10}>
            <Heading fontSize={18} mb={3}>
              Payment methods
            </Heading>
            <PaymentMethods />
          </Box>
          <Box mb={10}>
            <InvoiceCreditBalance />
          </Box>
          <Box mb={10}>
            <Invoices />
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default SingleCustomer;

const PaymentsList = (props) => {
  const { amount, status, desc, date, checkStatus } = props;
  return (
    <>
      <Tr>
        <Td w={0}>
          <Checkbox value={checkStatus} />
        </Td>
        <Td>
          <Flex justify={"space-between"}>
            <span>{amount}</span>
            <Badge
              w={70}
              textAlign="center"
              variant="solid"
              colorScheme={
                status === "success"
                  ? "green"
                  : "red" && status === "draft"
                  ? "gray"
                  : "red"
              }
            >
              {status}
            </Badge>
          </Flex>
        </Td>
        <Td>{desc}</Td>
        <Td>{date}</Td>
      </Tr>
    </>
  );
};

const PaymentMethods = () => {
  return (
    <>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text>Mastercard</Text>
                <Text color="gray.400">Expires Dec 2030</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TableContainer>
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Th>Name</Th>
                    <Td>Josh</Td>
                  </Tr>
                  <Tr>
                    <Th>Number</Th>
                    <Td>Josh</Td>
                  </Tr>
                  <Tr>
                    <Th>Fingerprint</Th>
                    <Td>Josh</Td>
                  </Tr>
                  <Tr>
                    <Th>Expires</Th>
                    <Td>Josh</Td>
                  </Tr>
                  <Tr>
                    <Th>Type</Th>
                    <Td>Josh</Td>
                  </Tr>
                  <Tr>
                    <Th>Issuer</Th>
                    <Td>CIAGROUP</Td>
                  </Tr>
                  <Tr>
                    <Th>ID</Th>
                    <Td>card_1LmgKbKXau3ZSAk3BBNjrc4U</Td>
                  </Tr>
                  <Tr>
                    <Th>Billing address</Th>
                    <Td>
                      <Text>US address 1</Text>
                      <Text>US address 2</Text>
                      <Text>Test, AL, 123457, US</Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Phone</Th>
                    <Td>No phone provided</Td>
                  </Tr>
                  <Tr>
                    <Th>Email</Th>
                    <Td>No email provided</Td>
                  </Tr>
                  <Tr>
                    <Th>Origin</Th>
                    <Td>United States</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

const InvoiceCreditBalance = () => {
  return (
    <>
      <Box>
        <Flex justify={"space-between"} alignItems="center">
          <Heading fontSize={18} mb={3}>
            Invoice credit balance
          </Heading>
          <Button bg={"none"}>Adjust balance</Button>
        </Flex>
        <Divider />
        <Heading fontSize={25} fontWeight={100}>
          US$0.00&nbsp;
          <span style={{ fontSize: 16, fontWeight: 300 }}>USD</span>
        </Heading>
      </Box>
    </>
  );
};

const Invoices = () => {
  return (
    <>
      <Box>
        <Flex justify={"space-between"} alignItems="center">
          <Heading fontSize={18} mb={3}>
            Invoice credit balance
          </Heading>
          <Button bg={"none"} p={0}>
            Create
          </Button>
        </Flex>
        <Divider />
        <Table>
          <Thead>
            <Tr>
              <Th>AMOUNT</Th>
              <Th>INVOICE NUMBER</Th>
              <Th>DUE</Th>
              <Th>CREATED</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>US$0.00</Td>
              <Td>
                <Badge>Draft</Badge> DA5AD08F-DRAFT
              </Td>
              <Td>27 Oct</Td>
              <Td>27 Sept, 21:09</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

const CreateANewPaymentModal = () => {
  const [selectCountry, setSelectedCountries] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const options = [
    { value: "USD 1", label: "USD 1" },
    { value: "USD 2", label: "USD 2" },
    { value: "USD 3", label: "USD 3" },
  ];

  return (
    <>
      <Button onClick={onOpen}>Create</Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <form>
          <ModalContent className="create_payment_modal">
            <ModalHeader>Create a new payment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <Flex>
                  <FormLabel>Currency</FormLabel>
                  <ReactSelect
                    className="select_drop"
                    options={options}
                    placeholder="Find Customer"
                    name="customers"
                    value={options.filter((obj) => obj.value === selectCountry)}
                    onChange={(e) => {
                      setSelectedCountries(e.value);
                    }}
                  />
                </Flex>
              </FormControl>
              <FormControl>
                <Flex>
                  <FormLabel>Amount</FormLabel>
                  <Box>
                    <Text mb={"-30px"} ms={1}>
                      USD
                    </Text>
                    <Input placeholder="" value={0.0} ps={10} />
                  </Box>
                </Flex>
              </FormControl>
              <FormControl>
                <Flex>
                  <FormLabel>Payment method</FormLabel>
                  <Select>
                    <option value="card 1">card 1</option>
                    <option value="card 2">card 2</option>
                    <option value="card 3">card 3</option>
                  </Select>
                </Flex>
              </FormControl>
              <FormControl>
                <Flex>
                  <FormLabel>Statement desc</FormLabel>
                  <Input value="FOXTAIL-TURF" />
                </Flex>
              </FormControl>
              <FormControl>
                <Flex>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Products or services associated with payment" />
                </Flex>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button bg={"teal.300"} color="white" _hover={"none"} mr={3}>
                Create Payment
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
