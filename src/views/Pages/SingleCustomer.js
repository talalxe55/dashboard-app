import React from "react";
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Button,
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tr,
  Th,
  Td,
  Thead,
  Tbody,
  TableContainer,
  Checkbox,
  Badge,
  Table,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import PaymentCreateModal from "theme/components/PaymentCreateModal";
import AddCard from "theme/components/AddCard";
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
                <MenuItem onClick={() => console.log("Click")}>
                  Create Payment
                </MenuItem>
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
              <PaymentCreateModal />
            </Flex>
            <TableContainer>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th w={0}>
                      <Checkbox checked={false} />
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
            <Flex justify={"space-between"} alignItems="center" my={3}>
              <Heading fontSize={18} mb={3}>
                Payment methods
              </Heading>
              <AddCard />
            </Flex>
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
