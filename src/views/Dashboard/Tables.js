import React, { useEffect, useState } from "react";
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
  Button,
  Box,
  Input,
  Heading,
  Select,
  Image,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import TablesTableRow from "components/Tables/TablesTableRow";
import { API_SERVER, TOKEN_TYPE, TOKEN, ACCEPT_TYPE } from "config/constant";
import axios from "axios";
import LoadingGif from "assets/svg/loading-infinite.svg";
import { NavLink } from "react-router-dom";


function Tables() {
  const [customers, setCustomers] = useState([]);
  const [isloading, setLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const textColor = useColorModeValue("gray.700", "white");

  const getCustomersList = async () => {
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

  // function getMoreCustomers(){
  //   var table= document.querySelector('.customer-listing');
  //   var lastRow = table.rows[ table.rows.length - 1 ];
  //   let options = [];
  //   //options['starting_after']=lastRow.getAttribute('customer-data')
  //   var moreCustomers = getCustomersList()
  //   moreCustomers.then((item) => {
  //     console.log(item);
  //   })
  //   //console.log(moreCustomers);
  // }

  // Converting date
  const datadate = (created) => {
    let epochDate = created;
    var formatedDateTime = new Date(epochDate * 1000);
    formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDateTime;
  };

  useEffect(() => {
    getCustomersList(null);
  }, []);

  // Filtering Email
  const customerListing = customers.filter((customer) => {
    if (emailFilter == "") {
      return customer;
    } else if (emailFilter != "") {
      return customer.email == emailFilter ? customer : false;
    }
  });
  const emailTextHandler = (email) => {
    console.log(email);
    setEmailFilter(email);
  };
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
          <FilterCustomers emailTextHandler={emailTextHandler} />
        </Box>
        {!isloading ? (
          <>
            <CardBody>
              <Table variant="simple" color={textColor} class="customer-listing">
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
                  {customerListing.map((val, index) => {
                    
                    return (
                      <TablesTableRow
                        cusid= {val.id}
                        key={index}
                        name={val.name}
                        email={val.email}
                        desc={val.description}
                        domain={val.object}
                        status={
                          val.invoice_settings.default_payment_method || "VISA"
                        }
                        date={datadate(val.created)}
                        viewprofile={val.id}
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
            <Flex
              h="50vh"
              justifyContent="center"
              alignItems="center"
              direction={"column"}
            >
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

const FilterCustomers = (props) => {
  const [customerType, setCustomerType] = useState("NLS");
  const [filterEmail, setFilterEmail] = useState("");

  const emailHandler = (email) => {
    setFilterEmail(email);
    props.emailTextHandler(email);
  };
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
            {filterEmail ? "Email | " + filterEmail : "Email"}
          </MenuButton>
          <MenuList>
            <Box p={3}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight={"bold"}>Filter By Email</Text>
                <Button
                  p={0}
                  fontSize={15}
                  borderRadius={50}
                  onClick={() => emailHandler("")}
                >
                  <CloseIcon />
                </Button>
              </Flex>
              <Flex justifyContent="center" alignItems="center" my={3}>
                <Text fontSize={14} w={"50%"}>
                  is equal to
                </Text>
                <Input
                  placeholder="Enter customer email"
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  id="filterEmail"
                />
              </Flex>
              <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                onClick={() => emailHandler(filterEmail)}
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
            {"Customer Type"} |{" "}
            <span style={{ color: "var(--chakra-colors-primaryColor-700)" }}>
              {customerType}
            </span>
          </MenuButton>
          <MenuList>
            <Box p={3}>
              <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                onClick={() => setCustomerType("NLS")}
                mt={3}
              >
                NLS
              </Button>
              <Button
                w={"100%"}
                bg="teal.300"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                onClick={() => setCustomerType("SpiritMagnet")}
                mt={3}
              >
                SpiritMagnet
              </Button>
            </Box>
          </MenuList>
        </Menu>
      </Flex>
    </>
  );
};
