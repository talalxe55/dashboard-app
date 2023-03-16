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
  useToast
} from "@chakra-ui/react";
import BulkPaymentEntriesTable from "components/Tables/BulkPaymentEntriestable";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import LoadingGif from "assets/svg/loading-infinite.svg";
import { useLocation, useParams } from "react-router-dom";
import {
  AlertUnauthorized,
  AlertDataNotFound,
} from "theme/components/AlertDialog";
import { runJobPaymentID, getPaymentEntries, getUsers } from "api/ApiListing";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { setConstantValue } from "typescript";
import { useHistory } from 'react-router-dom';

// PARENT COMPONENT
export default function PaymentEntries() {
    const toast = useToast();
    const history = useHistory();
    const { search } = useLocation();
    let { id } = useParams();
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
    const [totalCount, settotalCount] = useState(null);
    const [totalCountAttempted, settotalCountAttempted] = useState(null);
    const [totalCountNotAttempted, settotalCountNotAttempted] = useState(null);
    const [jobStatus, setjobStatus] = useState(null);


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

  function fetchLogs(id, page){
    setLoading(true);
    getPaymentEntries(id, page)
      .then((res) => {
        if (res !== undefined && res.status === 200) {
        //   if (page == 1) {
        //     //setNewLogs(res.data.data.data);
        //   } else {
        //     //setNewLogs((logs) => [...logs, ...res.data.data.data]);
        //   }
          if (page == 1) {
            setNewLogs(res.data.data.entries.data);
          } else {
            setNewLogs((logs) => [...logs, ...res.data.data.entries.data]);
          }
          //setNewLogs(res.data.data.entries.data);
          setlogPayload(res.data.data.entries);
          settotalCount(res.data.data.total_count)
          settotalCountAttempted(res.data.data.attempted_count)
          settotalCountNotAttempted(res.data.data.not_attempted_count)
          setjobStatus(res.data.data.status)
          setLoading(false);
        } else {
        }
      })
      .catch((err) => {
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
    // if(query.get('id') === null || query.get('id') === undefined){
    //     history.push('/admin/bulk-payments');
    // }
    // else{
    //     if (newLogs === null) {
    //         fetchLogs(query.get('id'));
    //       }
    // }
    if (newLogs === null) {
        fetchLogs(id, 1);
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
      fetchLogs(id,logPayload.current_page<=logPayload.last_page?logPayload.current_page+1:logPayload.current_page);
      
    } else {
      fetchLogs(id,logPayload.current_page<=logPayload.last_page?logPayload.current_page+1:logPayload.current_page);
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
  
  const handleEntries = () => {
    setLoading(true);
    runJobPaymentID(id)
      .then((res) => {
        if (res !== undefined && res.status === 200) {
          toast({
            title: "Completed",
            description: res.data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          }) &&
            setLoading(false)
          return setLoading(false);
        } else {
          setLoading(false)
        }
      })
      .catch((err) => {
        toast({
        title: "Getting Error! Try again!",
        description: "Error while running log",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      setLoading(false);
    }).finally(() => {
        history.push('/admin/bulk-payments/')
      });

    
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
            All Entries
          </Text>
        </CardHeader>
        <Flex flexDirection={"direction"}>
        <Flex flexDirection={"direction"}>
            <Box w="270px">
                <Flex size="md">
                    <Input
                    placeholder="Search Entries by Customer ID"
                    size="md"
                    type="search"
            />
                </Flex>
            </Box>
            </Flex>
            {jobStatus && jobStatus==="uploaded"? <Flex flexDirection={"direction"} mt={"auto"} mr={"0"} mb={"auto"} ml={"auto"} >
            <Box w="270px">
                <Flex size="md">
                <Button
                onClick={() => {handleEntries()}}
                w={"100%"}
                bg="primaryColor"
                color="white"
                _hover={{ color: "black", bg: "gray.300" }}
                
                >
                Proceed
                </Button>           
                </Flex>
                </Box>
                </Flex>: ""}
                </Flex>
        <Flex direction={"direction"}>
       <Box w="150px" pt={"5"}>
            <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            textAlign={"start"}
          >
            Total Count: {totalCount}
          </Text>
          </Box>
          <Box w="150px" pt={"5"}>
            <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            textAlign={"start"}
          >
            Attempted: {totalCountAttempted}
          </Text>
          </Box>
           <Box w="150px" pt={"5"}>
            <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            textAlign={"start"}
          >
            Not Attempted: {totalCountNotAttempted}
          </Text>
          </Box>
        </Flex>

        {/* <Box>
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
        </Box> */}
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
                    <Th color="gray.400">Amount</Th>
                    <Th color="gray.400">Customer ID</Th>
                    <Th color="gray.400">Source ID</Th>
                    <Th color="gray.400">Status</Th>
                    <Th color="gray.400">Created At</Th>
                    <Th color="gray.400">Updated At</Th>
                    <Th color="gray.400"></Th>
                  </Tr>
                </Thead>
                <Tbody textTransform="capitalize">
                  {newLogs !== null
                    ? newLogs.map((val, index) => {
                        return (
                          <BulkPaymentEntriesTable
                            key={index}
                            srno={index + 1}
                            id={val.id}
                            amount={val.amount}
                            dateCreated={datadate(val.created_at)}
                            cus_id={val.customer_id}
                            source_id={val.source_id}
                            status={val.status}
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
            <Heading className="title_listing">Listing Entries...</Heading>
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
            <p>Showing {newLogs !== null ? newLogs.length : 0} of {logPayload ? logPayload.total:0} Entries</p>
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
