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
  Box,
  Image,
  Input,
  Heading,
  Select,
  Menu,
  MenuButton,
  MenuList,
  Button,
} from "@chakra-ui/react";
import LogsTable from "components/Tables/LogsTable";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import LoadingGif from "assets/svg/loading-infinite.svg";
import { useLocation } from "react-router-dom";
import {
  AlertUnauthorized,
  AlertDataNotFound,
} from "theme/components/AlertDialog";
import { getLogs, getUsers } from "api/ApiListing";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { setConstantValue } from "typescript";

// PARENT COMPONENT
export default function Logs() {
  const { search } = useLocation();
  let query = React.useMemo(() => new URLSearchParams(search), [search]);
  const [isMore, setisMore] = useState(false);
  const [newLogs, setNewLogs] = useState(null);
  const [isloading, setLoading] = useState(false);
  const textColor = useColorModeValue("gray.700", "white");
  const [unauthorizedWarning, setUnauthorizedWarning] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterApplied, setfilterApplied] = useState(false);
  const [filterPage, setfilterPage] = useState();
  const [logPayload, setlogPayload] = useState();
  const [filterDate, setfilterDate] = useState([null]);
  const [filterEvent, setfilterEvent] = useState("");


  function getFilterData() {
    let options = {};
    if(document.querySelector("input[name=payment-date]").value!== null &&  document.querySelector("input[name=payment-date]").value !==""){
      options['date'] = document.querySelector("input[name=payment-date]").value;
    }
    if(document.querySelector("select[name=payment-events]").value!== null &&  document.querySelector("select[name=payment-events]").value !=="default"){
      options['event'] = document.querySelector("select[name=payment-events]").value;
    }
    return options;
  }
  function searchLogsbyfilter() {
    
    let options = [];
    options = getFilterData();
    if (Object.keys(options).length == 0) {
      setfilterApplied(false);
      fetchLogs('1', null, null);
      return;
    } else {
      setfilterApplied(true);
      fetchLogs(1,options['event']?options['event']:null,options['date']?options['date']:null);
    }
  }

  function fetchLogs(page,event,date){
    setLoading(true);
    getLogs(page,event,date)
      .then((res) => {
        if (res !== undefined && res.status === 200) {
          if (page == 1) {
            setNewLogs(res.data.data.data);
          } else {
            setNewLogs((logs) => [...logs, ...res.data.data.data]);
          }
          // setNewLogs(res.data.data.data);
          setlogPayload(res.data.data);
          setLoading(false);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 401) {
          setUnauthorizedWarning(true);
        }
        if (err.response.status == 404) {
          setNoDataFound(true);
        }
        setLoading(false);
      });
  }
  useEffect(() => {
    if (newLogs === null) {
      fetchLogs(1, null, null);
    }
  }, []);

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

  const setReloadHandler = (value) => {
    if (value === true) {
      setLoading(true);
      getLogs()
        .then((res) => {
          if (res !== undefined && res.status === 200) {
            setNewLogs(res.data.data.data);
            setLoading(false);
          } else {
          }
        })
        .catch((err) => {
          if (err.response.status == 401) {
            setUnauthorizedWarning(true);
          }
          setLoading(false);
        });
    }
  };

  function getMoreCustomers() {
    let options = [];
    if (filterApplied) {
      let options = [];
      options = getFilterData();
      fetchLogs(logPayload.current_page<=logPayload.last_page?logPayload.current_page+1:logPayload.current_page,options['event']?options['event']:null,options['date']?options['date']:null);
      
    } else {
      fetchLogs(logPayload.current_page<=logPayload.last_page?logPayload.current_page+1:logPayload.current_page,null,null);
    }
  }

  // Filtering Email
  // const customerListing =
  //   newLogs !== null && newLogs !== undefined
  //     ? newLogs.filter((customer) => {
  //         if (emailFilter == "") {
  //           return customer;
  //         } else if (emailFilter != "") {
  //           return customer.email == emailFilter ? customer : false;
  //         }
  //       })
  //     : null;

  // Converting date
  const datadate = (created) => {
    var formatedDateTime = new Date(created);
    formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDateTime;
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {unauthorizedWarning ? <AlertUnauthorized /> : null}
      {noDataFound ? (
        <AlertDataNotFound setNoDataFound={setNoDataFound} />
      ) : null}

      <Card overflowX={{ sm: "scroll", xl: "scroll" }}>
        <CardHeader p="0 0 30px 0">
          <Text
            fontSize="xl"
            color={textColor}
            fontWeight="bold"
            textAlign={"start"}
          >
            All Logs
          </Text>
        </CardHeader>
        <Box>
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
                Event
                <span
                  style={{ color: "var(--chakra-colors-primaryColor-700)" }}
                >
                  {filterEvent}
                </span>
              </MenuButton>
              <MenuList>
                <Box p={3}>
                  <Flex justifyContent="space-between">
                    <Text fontWeight={"bold"}>Filter By Events</Text>
                    <Button
                      p={0}
                      fontSize={15}
                      borderRadius={50}
                      onClick={ () => {
                        document.querySelector(
                        "select[name=payment-events]"
                      ).selectedIndex = 0; searchLogsbyfilter(); setfilterEvent("");}}
                    >
                      <CloseIcon />
                    </Button>
                  </Flex>
                  <Select my={3} name="payment-events">
                    <option value="default">Select Event</option>
                    <option value="payment_created">Payment Created</option>
                    <option value="refund_created">Refund Created</option>
                  </Select>
                  <Button
                    onClick={() => {
                      searchLogsbyfilter();
                      setfilterEvent(' ='+
                        document.querySelector(
                        "select[name=payment-events]"
                      ).value);
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
                  <Flex justifyContent="space-between">
                    <Text fontWeight={"bold"}>Filter By Date</Text>
                    <Button
                      p={0}
                      fontSize={15}
                      borderRadius={50}
                      onClick={() => {
                        setfilterDate("");
                        document.querySelector(
                          "input[name=payment-date]"
                        ).value = "";
                        searchLogsbyfilter();
                      }}
                    >
                      <CloseIcon />
                    </Button>
                  </Flex>
                  {/* <Select my={3} name="payment-date-operator">
                    <option value="=">is equal to</option>
                    <option value=">">is after</option>
                    <option value="<">is before</option>
                  </Select> */}
                  <Input type="date" name="payment-date" />
                  <Button
                    onClick={() => {
                      setfilterDate(
                        " " +
                          document.querySelector("input[name=payment-date]")
                            .value
                      );
                      searchLogsbyfilter();
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
          </Flex>
        </Box>
        {!isloading ? (
          <>
            <CardBody>
              <Table
                variant="simple"
                color={textColor}
                className="customer-listing"
                overflowX={"auto"}
              >
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th color="gray.400">Sr. No.</Th>
                    <Th color="gray.400">Description</Th>
                    <Th color="gray.400">Created at</Th>
                    <Th color="gray.400">Updated at</Th>
                    <Th color="gray.400">View Details</Th>
                  </Tr>
                </Thead>
                <Tbody textTransform="capitalize">
                  {newLogs !== null
                    ? newLogs.map((val, index) => {
                        return (
                          <LogsTable
                            key={index}
                            srno={index + 1}
                            userid={val.id}
                            desc={val.description}
                            properties={val.properties}
                            dateCreated={datadate(val.created_at)}
                            dateUpdated={datadate(val.updated_at)}
                            setReloadHandler={setReloadHandler}
                          />
                        );
                      })
                    : ""}
                </Tbody>
              </Table>
            </CardBody>
          </>
        ) : (
          <Flex
            justifyContent="center"
            alignItems="center"
            direction={"column"}
          >
            <Heading className="title_listing">Listing Logs...</Heading>
            <Image src={LoadingGif} w={100} />
          </Flex>
        )}
        <Box>
          <Flex
            mt={5}
            justifyContent="center"
            alignItems="center"
            direction={"column"}
          >
            <p>Showing {newLogs !== null ? newLogs.length : 0} of {logPayload ? logPayload.total:0} Logs</p>
          </Flex>
        </Box>
        {logPayload && logPayload.next_page_url!==null ? (
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
        {/* <Box>
          <Flex
            h="50vh"
            justifyContent="center"
            alignItems="center"
            direction={"column"}
          >
            <p>Showing {"customers.length"} of Customers</p>
          </Flex>
        </Box> */}
      </Card>
    </Flex>
  );
}