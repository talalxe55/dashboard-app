import React, { useEffect, useState } from "react";
// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import TablesTableRow from "components/Tables/TablesTableRow";
import { tablesProjectData, tablesTableData } from "variables/general";
// import { getCustomersList } from "../../api/ApiListing";
import { API_SERVER, TOKEN_TYPE, TOKEN, ACCEPT_TYPE } from "config/constant";
import axios from "axios";
import LoadingGif from "assets/svg/loading-infinite.svg";

function Tables() {
  const [customers, setCustomers] = useState([]);
  const [isloading, setLoading] = useState(false);
  const textColor = useColorModeValue("gray.700", "white");

  const getCustomersList = async (props) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_SERVER}customers`, {
        headers: {
          Authorization: `${TOKEN_TYPE} ${TOKEN}`,
          Accept: `${ACCEPT_TYPE}`,
          "Content-Type": `${ACCEPT_TYPE}`,
        },
      });
      setLoading(false);
      let data = res.data.data.data;
      console.log(data);
      setCustomers(data);
    } catch (err) {
      if (err.response.status === 404) {
        console.log("Resource could not be found!");
      } else if (err.response.status === 401) {
        console.log("Unauthorized!");
      } else {
        console.log(err.message);
      }
    }
  };

  const datadate = (created) => {
    let epochDate = created;
    var formatedDateTime = new Date(epochDate * 1000);
    formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDateTime;
  };

  useEffect(() => {
    getCustomersList();
  }, []);
  // if (isloading)
  //   return (
  //     <Box>
  //       <Flex h="100vh" justifyContent="center" alignItems="center">
  //         <Heading>Loading...</Heading>
  //       </Flex>
  //     </Box>
  //   );
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="0 0 30px 0">
          <Text
            fontSize="xl"
            color={textColor}
            fontWeight="bold"
            textAlign={"start"}
          >
            Customers
          </Text>
        </CardHeader>
        <Box>
          <FilterCustomers />
        </Box>
        {!isloading ? (
          <>
            <CardBody>
              <Table variant="simple" color={textColor}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th pl="0px" color="gray.400">
                      Customer Names
                    </Th>
                    <Th color="gray.400">Roles</Th>
                    <Th color="gray.400">Payment Method</Th>
                    <Th color="gray.400">Created</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody className="customer_body" textTransform={"capitalize"}>
                  {customers.map((val, index) => {
                    return (
                      <TablesTableRow
                        key={index}
                        name={val.name}
                        email={val.email}
                        desc={val.description}
                        domain={val.object}
                        status={
                          val.invoice_settings.default_payment_method || "VISA"
                        }
                        date={datadate(val.created)}
                      />
                    );
                  })}
                  {/* {tablesTableData.map((row) => {
                return (
                  <TablesTableRow
                    name={row.name}
                    // logo={row.logo}
                    email={row.email}
                    subdomain={row.subdomain}
                    domain={row.domain}
                    status={row.status}
                    date={row.date}
                  />
                );
              })} */}
                </Tbody>
              </Table>
            </CardBody>
          </>
        ) : (
          <Box>
            <Flex h="50vh" justifyContent="center" alignItems="center" direction={"column"}>
              <Heading>Listing Customers...</Heading>
              <Image src={LoadingGif} w={100} />
            </Flex>
          </Box>
        )}
        <Button
          onClick={null}
          bg="teal.300"
          w={200}
          color="white"
          m={"20px auto"}
          _hover={{ bg: "#000" }}
          p="25px 0"
        >
          Load More
        </Button>
      </Card>
      {/* <Card
        my="22px"
        overflowX={{ sm: "scroll", xl: "hidden" }}
      >
        <CardHeader p="6px 0px 22px 0px">
          <Flex direction="column">
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              Projects Table
            </Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px">
                <Th pl="0px" color="gray.400">
                  Companies
                </Th>
                <Th color="gray.400">Budget</Th>
                <Th color="gray.400">Status</Th>
                <Th color="gray.400">Completion</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {tablesProjectData.map((row) => {
                return (
                  <TablesProjectRow
                    name={row.name}
                    logo={row.logo}
                    status={row.status}
                    budget={row.budget}
                    progression={row.progression}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card> */}
    </Flex>
  );
}

export default Tables;

const FilterCustomers = () => {
  return (
    <>
      <Flex className="filter_customers">
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<AddIcon />}
            border="1px"
            borderStyle={"dashed"}
            borderColor={"gray.400"}
            color={"gray.500"}
            bg={"none"}
            fontSize={15}
          >
            Email
          </MenuButton>
          <MenuList>
            <Box p={3}>
              <Text fontWeight={"bold"}>Filter By Email</Text>
              <Flex justifyContent="center" alignItems="center" my={3}>
                <Text fontSize={14} w={"50%"}>
                  is equal to
                </Text>
                <Input placeholder="Enter customer email" />
              </Flex>
              <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
              >
                Apply
              </Button>
            </Box>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<AddIcon />}
            border="1px"
            borderStyle={"dashed"}
            borderColor={"gray.400"}
            color={"gray.500"}
            bg={"none"}
            fontSize={15}
          >
            Card
          </MenuButton>
          <MenuList>
            <Box p={3}>
              <Text fontWeight={"bold"}>Filter By Card</Text>
              <Select my={3}>
                <option value="true">has an active card</option>
                <option value="false">does not have an active card</option>
              </Select>
              <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
              >
                Apply
              </Button>
            </Box>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<AddIcon />}
            border="1px"
            borderStyle={"dashed"}
            borderColor={"gray.400"}
            color={"gray.500"}
            bg={"none"}
            fontSize={15}
          >
            Created date
          </MenuButton>
          <MenuList>
            <Box p={3}>
              <Text fontWeight={"bold"}>Filter By Card</Text>
              <Select my={3}>
                <option value="inTheLast">is in the last</option>
                <option value="equals">is equal to</option>
                <option value="between">is between</option>
                <option value="isAfter">is after</option>
                <option value="isAfterOrOn">is on or after</option>
                <option value="isBefore">is before</option>
                <option value="isBeforeOrOn">is before or on</option>
              </Select>
              <Input type="date" />
              <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                mt={3}
              >
                Apply
              </Button>
            </Box>
          </MenuList>
        </Menu>
      </Flex>
    </>
  );
};
