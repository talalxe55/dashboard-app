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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
import { useHistory } from "react-router-dom";
import { AlertDataNotFound, AlertUnauthorized } from "theme/components/AlertDialog";

function Tables() {
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const [isloading, setLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const [custLimit, setCustLimit] = useState(10);
  const [customerType, setCustomerType] = useState("NLS");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterApplied, setfilterApplied] = useState(false);
  const [isMore, setisMore] = useState(false);
  const [filterPage, setfilterPage] = useState();
  const [oldCustomers, setoldCustomers] = useState([]);
  const [oldload, setoldload] = useState(false);
  const [filterDate, setfilterDate] = useState([null]);
  const [unauthorizedWarning, setUnauthorizedWarning] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const textColor = useColorModeValue("gray.700", "white");
  let filterCustomersdataRef = false;
  const getCustomersList = async (options) => {
    try {
      setLoading(true);
      var params = "";

      if (options !== null && options !== undefined) {
        if (options.limit !== undefined) {
          !params
            ? (params = "?limit=" + options.limit)
            : (params += "&limit=" + options.limit);
        }

        if (options.starting_after !== undefined) {
          !params
            ? (params = "?starting_after=" + options.starting_after)
            : (params += "&starting_after=" + options.starting_after);
        }

        if (options.ending_before !== undefined) {
          !params
            ? (params = "?ending_before=" + options.ending_before)
            : (params += "&ending_before=" + options.ending_before);
        }
      }

      const res = await axios.get(`${API_SERVER}customers` + params, {
        headers: {
          Authorization: `${TOKEN_TYPE} ${TOKEN}`,
          Accept: `${ACCEPT_TYPE}`,
          "Content-Type": `${ACCEPT_TYPE}`,
        },
      });
      setLoading(false);
      let data = res.data.data.data;
      if (!customers) {
        setCustomers(data);
        setoldCustomers(data);
      } else {
        setCustomers((customers) => [...customers, ...data]);
        setoldCustomers((customers) => [...customers, ...data]);
      }

      setisMore(res.data.data.has_more);
      setoldload(res.data.data.has_more);
    } catch (err) {
      if (err.response.status === 404) {
        setNoDataFound(true);
      } else if (err.response.status === 401) {
        setUnauthorizedWarning(true);
      } else {
      }
    }
  };

  const emailHandler = (email) => {
    setFilterEmail(email);
    //props.emailTextHandler(email);
  };

  const filterCustomers = async (options, limit, page) => {
    try {
      let data = {};
      setLoading(true);
      var params = "";
      if (limit !== undefined && limit !== null) {
        !params ? (params = "?limit=" + limit) : (params += "&limit=" + limit);
      }
      if (page !== undefined && page !== null) {
        !params ? (params = "?page=" + page) : (params += "&page=" + page);
      }
      if (options !== null && options !== undefined) {
        Object.entries(options).forEach(([key, value]) => {
          data[key] = value;
        });
      }

      const res = await axios.post(
        `${API_SERVER}customers/search` + params,
        JSON.stringify(data),
        {
          headers: {
            Authorization: `${TOKEN_TYPE} ${TOKEN}`,
            Accept: `${ACCEPT_TYPE}`,
            "Content-Type": `${ACCEPT_TYPE}`,
          },
        }
      );

      setLoading(false);
      let resdata = res.data.data.data;
      if (page == null) {
        setCustomers(resdata);
        filterCustomersdataRef = true;
      } else {
        setCustomers((customers) => [...customers, ...resdata]);
      }

      if (res.data.data.next_page !== null && res.data.data.has_more == true) {
        setfilterPage(res.data.data.next_page);
      }
      setisMore(res.data.data.has_more);
      setfilterApplied(true);
    } catch (err) {
      if (err.response.status === 404) {
        setNoDataFound(true);
      } else if (err.response.status === 401) {
        setUnauthorizedWarning(true);
      } else {
      }
    }
  };

  function getMoreCustomers() {
    let options = [];
    if (filterApplied) {
      options = getFilterData();

      // if(isMore){
      //     options['page'] = filterPage;
      // }
      var moreCustomers = filterCustomers(
        options,
        null,
        isMore ? filterPage : null
      );
    } else {
      var table = document.querySelector(".customer-listing");
      var lastRow = table.rows[table.rows.length - 1];

      options["starting_after"] = lastRow.getAttribute("customer-data");
      var moreCustomers = getCustomersList(options);
    }
  }

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

  // useEffect(() => {
  //   if (custLimit > 10) {
  //     getMoreCustomers();
  //   }
  // }, [custLimit]);

  // Filtering Email
  const customerListing = customers.filter((customer) => {
    if (emailFilter == "") {
      return customer;
    } else if (emailFilter != "") {
      return customer.email == emailFilter ? customer : false;
    }
  });
  const emailTextHandler = (email) => {
    setEmailFilter(email);
  };

  function getFilterData() {
    let options = {};
    if (
      document.querySelector("input[name=payment-date]").value !== null &&
      document.querySelector("input[name=payment-date]").value !== "" &&
      document.querySelector("select[name=payment-date-operator]").value !==
        undefined &&
      document.querySelector("select[name=payment-date-operator]").value !==
        "default"
    ) {
      //jQuery('')
      options["created"] = {
        value: document.querySelector("input[name=payment-date]").value,
        operator: document.querySelector("select[name=payment-date-operator]")
          .value,
      };
    }

    // if(document.querySelector('input[name=payment-amount]').value!==null && document.querySelector('input[name=payment-amount]').value!=='' && document.querySelector('select[name=payment-amount-operator]').value!==undefined && document.querySelector('select[name=payment-amount-operator]').value!=='default'){

    //     options['amount'] = {'value': document.querySelector('input[name=payment-amount]').value,
    //                         'operator': document.querySelector('select[name=payment-amount-operator]').value};

    // }
    if (
      document.querySelector("input[name=customer-name]").value !== null &&
      document.querySelector("input[name=customer-name]").value !== ""
    ) {
      options["name"] = document.querySelector(
        "input[name=customer-name]"
      ).value;
    }
    // if(document.querySelector('select[name=payment-currency]')!==undefined){

    //     options['currency'] = document.querySelector('select[name=payment-currency]').value;

    // }

    // if(document.querySelector('select[name=payment-metadata]').value === 'NLS' && document.querySelector('select[name=payment-metadata]').value !== 'default'){
    //         //options['metadata']['site_url'] = "https://nolimitsocial99.com"
    //         options['metadata'] = { ...options['metadata'] , 'site_url': "https://nolimitsocial99.com"}
    // }

    if (
      document.querySelector("input[name=customer-email]").value !== null &&
      document.querySelector("input[name=customer-email]").value !== ""
    ) {
      //options['metadata']['customer_email'] = document.querySelector('input[name=payment-metadata-email]').value
      options["email"] = document.querySelector(
        "input[name=customer-email]"
      ).value;
    }
    // if(document.querySelector('select[name=payment-status]').value !==null && document.querySelector('select[name=payment-status]').value !=='' && document.querySelector('select[name=payment-status]').value!=='default'){
    //     options['status'] = document.querySelector('select[name=payment-status]').value
    // }

    if (!options) {
      return null;
    }
    return options;
  }

  function searchPaymentsbyfilter() {
    filterCustomersdataRef = false;
    let options = [];
    options = getFilterData();

    if (Object.keys(options).length == 0) {
      setfilterApplied(false);
      setisMore(oldload);
      setCustomers([]);
      var moreCustomers = getCustomersList(null);
    } else {
      var moreCustomers = filterCustomers(options);
    }
  }

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {unauthorizedWarning ? <AlertUnauthorized /> : null}
      {noDataFound ? <AlertDataNotFound setNoDataFound={setNoDataFound} /> : null}
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
          <Flex display={"inline-block"} width={[
      '30%', // 0-30em
      '50%', // 30em-48em
      '70%', // 48em-62em
      '100%', // 62em+
    ]} direction="column" className="filter_customers">
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
                      onClick={() => {
                        emailHandler("");
                        document.querySelector(
                          "input[name=customer-email]"
                        ).value = "";
                        searchPaymentsbyfilter();
                      }}
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
                      name="customer-email"
                    />
                  </Flex>
                  <Button
                    w={"100%"}
                    bg="primaryColor"
                    color="white"
                    _hover={{ color: "black", bg: "gray.300" }}
                    onClick={() => {
                      emailHandler(filterEmail);
                      searchPaymentsbyfilter();
                    }}
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
                {filterName ? "Name | " + filterName : "Name"}
              </MenuButton>
              <MenuList>
                <Box p={3}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontWeight={"bold"}>Filter By Name</Text>
                    <Button
                      p={0}
                      fontSize={15}
                      borderRadius={50}
                      onClick={() => {
                        setFilterName("");
                        document.querySelector(
                          "input[name=customer-name]"
                        ).value = "";
                        searchPaymentsbyfilter();
                      }}
                    >
                      <CloseIcon />
                    </Button>
                  </Flex>
                  <Flex justifyContent="center" alignItems="center" my={3}>
                    <Text fontSize={14} w={"50%"}>
                      is equal to
                    </Text>
                    <Input
                      placeholder="Enter customer name"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      id="filterName"
                      name="customer-name"
                    />
                  </Flex>
                  <Button
                    w={"100%"}
                    bg="primaryColor"
                    color="white"
                    _hover={{ color: "black", bg: "gray.300" }}
                    onClick={() => {
                      searchPaymentsbyfilter();
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </MenuList>
            </Menu>
            {/* <Menu>
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
            bg="primaryColor"
            color="white"
            _hover={{ color: "black", bg: "gray.300" }}
          >
            Apply
          </Button>
        </Box>
      </MenuList>
    </Menu> */}
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
                <span
                  style={{ color: "var(--chakra-colors-primaryColor-700)" }}
                >
                  {filterDate}
                </span>
              </MenuButton>
              <MenuList>
                <Box p={3}>
                  <Button
                    p={0}
                    fontSize={15}
                    borderRadius={50}
                    onClick={() => {
                      setfilterDate("");
                      document.querySelector("input[name=payment-date]").value =
                        "";
                      searchPaymentsbyfilter();
                    }}
                  >
                    <CloseIcon />
                  </Button>
                  <Text fontWeight={"bold"}>Filter By Date</Text>
                  <Select my={3} name="payment-date-operator">
                    <option value="=">is equal to</option>
                    <option value=">">is after</option>
                    <option value="<">is before</option>
                  </Select>
                  <Input type="date" name="payment-date" />
                  <Button
                    onClick={() => {
                      setfilterDate(
                        " " +
                          document.querySelector(
                            "select[name=payment-date-operator]"
                          ).value +
                          document.querySelector("input[name=payment-date]")
                            .value
                      );
                      searchPaymentsbyfilter();
                    }}
                    w={"100%"}
                    bg="primaryColor"
                    color="white"
                    _hover={{ color: "black", bg: "gray.300" }}
                    mt={3}
                  >
                    Apply
                  </Button>
                </Box>
              </MenuList>
            </Menu>
            {/* <Menu>
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
            bg="primaryColor"
            color="white"
            _hover={{ color: "black", bg: "gray.300" }}
            onClick={() => setCustomerType("NLS")}
            mt={3}
          >
            NLS
          </Button>
          <Button
            w={"100%"}
            bg="primaryColor"
            color="white"
            _hover={{ color: "black", bg: "gray.300" }}
            onClick={() => setCustomerType("SpiritMagnet")}
            mt={3}
          >
            SpiritMagnet
          </Button>
        </Box>
      </MenuList>
    </Menu> */}
          </Flex>
        </Box>
        {!isloading ? (
          <>
            <CardBody>
              <Table
                variant="simple"
                color={textColor}
                className={"customer-listing"}
              >
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
                        cusid={val.id}
                        key={index}
                        name={val.name}
                        email={val.email}
                        desc={val.description}
                        domain={val.object}
                        status={
                          val.hasOwnProperty("sources")
                            ? val.sources.data.length > 0
                              ? val.sources.data[0].id.startsWith("src")
                                ? val.sources.data[0].card.brand.toUpperCase()
                                : val.sources.data[0].brand
                              : "CARD"
                            : "CARD"
                          // val.invoice_settings.default_payment_method || "VISA"
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
        {isMore ? (
          <Button
            onClick={getMoreCustomers}
            bg="primaryColor"
            w={200}
            color="white"
            m={"20px auto"}
            _hover={{ bg: "#000" }}
            p="25px 0"
          >
            Load More
          </Button>
        ) : (
          ""
        )}
        <Box>
          <Flex
            h="50vh"
            justifyContent="center"
            alignItems="center"
            direction={"column"}
          >
            <p>Showing {customers.length} of Customers</p>
          </Flex>
        </Box>
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

// const FilterCustomers = (props) => {

// };
