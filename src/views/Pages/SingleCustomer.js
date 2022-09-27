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
} from "@chakra-ui/react";

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
            <Button>Action</Button>
          </Flex>

          <Box mb={10}>
            <Flex justify={"space-between"} alignItems="center" my={3}>
              <Heading fontSize={18}>Payments</Heading>
              <Button bg={"none"} color="teal.300">
                Create
              </Button>
            </Flex>
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
        </Box>
      </Flex>
    </>
  );
};

export default SingleCustomer;

const PaymentsList = (props) => {
  const { amount, status, desc, date } = props;
  return (
    <>
      <Tr>
        <Td w={0}>
          <Checkbox value="false" />
        </Td>
        <Td>
          <Flex justify={"space-between"}>
            <span>{amount}</span>
            <Badge
              variant="solid"
              colorScheme={status === "success" ? "green" : "red"}
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
                <TableCaption>
                  Imperial to metric conversion factors
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                  </Tr>
                  <Tr>
                    <Th>Number</Th>
                  </Tr>
                  <Tr>
                    <Th>Fingerprint</Th>
                  </Tr>
                  <Tr>
                    <Th>Expires</Th>
                  </Tr>
                  <Tr>
                    <Th>Type</Th>
                  </Tr>
                  <Tr>
                    <Th>Issuer</Th>
                  </Tr>
                  <Tr>
                    <Th>ID</Th>
                  </Tr>
                  <Tr>
                    <Th>Billing address</Th>
                  </Tr>
                  <Tr>
                    <Th>Phone</Th>
                  </Tr>
                  <Tr>
                    <Th>Email</Th>
                  </Tr>
                  <Tr>
                    <Th>Origin</Th>
                  </Tr>
                  <Tr>
                    <Th>CVC check</Th>
                  </Tr>
                  <Tr>
                    <Th>Street check</Th>
                  </Tr>
                  <Tr>
                    <Th>Zip check</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Josh</Td>
                  </Tr>
                  <Tr>
                    <Td>Josh</Td>
                  </Tr>
                  <Tr>
                    <Td>Josh</Td>
                  </Tr>
                  <Tr>
                    <Td>Josh</Td>
                  </Tr>
                  <Tr>
                    <Td>Josh</Td>
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
