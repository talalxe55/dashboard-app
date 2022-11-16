import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Spacer,
  Text,
  useColorModeValue,
  SkeletonText,
  Badge,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
// Assets
import BackgroundCard1 from "assets/img/BackgroundCard1.png";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import IconBox from "components/Icons/IconBox";
// import BillingRow from "components/Tables/BillingRow";
import InvoicesRow from "components/Tables/InvoicesRow";
import TransactionRowBilling from "components/Tables/TransactionRowBilling";
import { Separator } from "components/Separator/Separator";
import PaymentForm from "theme/components/PaymentForm";
import EditCustomer from "theme/components/EditCustomer";
import { FaUserCircle, FaRegCalendarAlt, FaWallet } from "react-icons/fa";
import { RiMastercardFill } from "react-icons/ri";
import axios from "axios";
import { API_SERVER, TOKEN_TYPE, TOKEN, ACCEPT_TYPE } from "config/constant";
import { VisaIcon, MastercardIcon, PersonIcon } from "components/Icons/Icons";
import BillingRowSourcesAccordion from "components/Tables/BillingRowSourcesAccordion";
import { getAllPaymentsByCustomerID } from "api/ApiListing";
import {
  AlertUnauthorized,
  AlertDataNotFound,
  AlertPaymentCreated,
} from "theme/components/AlertDialog";

function Billing() {
  let { id } = useParams();
  var array = [];
  const [singleCustomer, setSingleCustomer] = useState(null);
  const [singleCustomerPayments, setSingleCustomerPayments] = useState(null);
  const [singleCustomerSources, setSingleCustomerSources] = useState(null);
  const [
    singleCustomerDefaultSource,
    setsingleCustomerDefaultSource,
  ] = useState(null);
  const [billingSourceOwner, setBillingSourceOwner] = useState(null);
  const [customerMetaEmail, setcustomerMetaEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unauthorizedWarning, setUnauthorizedWarning] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [reload, setreload] = useState(false);
  const [isReload, setisReload] = useState(false);
  const bgColor = useColorModeValue("#F8F9FA", "gray.800");
  const nameColor = useColorModeValue("gray.500", "white");

  const extractBilling = (sourceData) => {
    if (sourceData.data.length > 0) {
      let data = [];
      sourceData.data.forEach((element) => {
        if (element.object == "card") {
          const owner = {
            owner: {
              address: {
                city: element.address_city,
                country: element.address_country,
                line1: element.address_line1,
                line2: element.address_line2,
                state: element.address_state,
                postal_code: element.address_zip,
              },
              name: element.name,
              email: "N/A",
              phone: "N/A",
            },
            card: {
              last4: element.last4,
              brand: element.brand,
            },
            type: "card",
          };
          data.push(owner);
        } else if (element.object == "source") {
          data.push(element);
        }
      });

      setBillingSourceOwner(data);
    }
  };
  const extractSource = (sourceData) => {
    if (sourceData.data.length > 0) {
      let data = sourceData.data[0];

      if (data.object == "card") {
        const card = {
          card: data,
          owner: {
            name: data.name,
            address: {
              city: data.address_city,
              country: data.address_country,
              line1: data.address_line1,
              line2: data.address_line2,
              state: data.address_state,
              postal_code: data.address_zip,
            },
            email: "",
            phone: "",
          },
        };
        setsingleCustomerDefaultSource(card);
      } else if (data.object == "source") {
        setsingleCustomerDefaultSource(data);
      }
    } else {
      return null;
    }
  };

  const getCustomerID = async () => {
    setLoading(false);
    try {
      const res = await axios.get(`${API_SERVER}customers/${id}`, {
        headers: {
          Authorization: `${TOKEN_TYPE} ${TOKEN}`,
          Accept: `${ACCEPT_TYPE}`,
          "Content-Type": `${ACCEPT_TYPE}`,
        },
      });
      let data = await res.data.data;
      array.push(data);;
      setSingleCustomer(data);
      setSingleCustomerSources(data.sources);
      extractSource(data.sources);
      extractBilling(data.sources);
      setLoading(false);
    } catch (err) {
      if (err.response.status === 404) {
        setNoDataFound(true);
        
      } else if (err.response.status === 401) {
        setUnauthorizedWarning(true);
      } else {
      }
    }
  };

  useEffect(() => {

    if (isReload) {
      const response = getAllPaymentsByCustomerID(id);
      response
        .then((res) => {
          setSingleCustomerPayments(res.data.data);
        })
        .catch((err) => {
          if (err.response.status == 400) {
            setNoDataFound(true);
          }
          if (err.response.status == 401) {
            setUnauthorizedWarning(true);
          }
        });
      getCustomerID();
    }
  }, [isReload]);
  const setReloadState = (value) => {
    if (value == true) {
      const response = getAllPaymentsByCustomerID(id);
      response
        .then((res) => {
          setSingleCustomerPayments(res.data.data);
        })
        .catch((err) => {
          if (err.response.status == 400) {
            setNoDataFound(true);
          }
          if (err.response.status == 401) {
            setUnauthorizedWarning(true);
          }
        });
      getCustomerID();
    }
  };
  useEffect(() => {
    const response = getAllPaymentsByCustomerID(id);
    response
      .then((res) => {
        setSingleCustomerPayments(res.data.data);
      })
      .catch((err) => {
        if (err.response.status == 400) {
          setNoDataFound(true);
        }
        if (err.response.status == 401) {
          setUnauthorizedWarning(true);
        }
      });
    getCustomerID();
  }, []);

  useEffect(() => {


    if (
      singleCustomerPayments !== null &&
      singleCustomerPayments.data.length > 0
    ) {
      singleCustomerPayments.data.forEach((item, index) => {
        if (item.metadata !== null) {
          if ("customer_email" in item.metadata) {
            setcustomerMetaEmail(item.metadata.customer_email);
            return;
          }
        }
      });
    }
  }, [singleCustomerPayments]);

  // Chakra color mode
  const iconTeal = useColorModeValue("primaryColor", "primaryColor");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("#dee2e6", "gray.500");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );

  // const [singleCustomerSource, setSingleCustomerSource] = useState();
  // let custData = getCustomerID(id);
  if (loading) {
    return <div>Loading...</div>;
  }

  const dataamount = (amount) => {
    let cents = amount;
    var formatedDollars = (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    //formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDollars;
  };

  const datadate = (created) => {
    let epochDate = created;
    var formatedDateTime = new Date(epochDate * 1000);

    formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDateTime;
  };

  const CardDetails = () => {
    if (singleCustomerDefaultSource) {
      if (Object.keys(singleCustomerDefaultSource.card) !== 0) {
        if (singleCustomerDefaultSource.card.last4.length > 0) {
          return (
            <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
              XXXX XXXX XXXX {singleCustomerDefaultSource.card.last4}
            </Text>
          );
        } else {
          return (
            <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
              <SkeletonText noOfLines={2} />
            </Text>
          );
        }
      } else {
        return (
          <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
            No card is attached
          </Text>
        );
      }
    } else {
      return (
        <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
          <SkeletonText noOfLines={2} />
        </Text>
      );
    }
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {unauthorizedWarning ? <AlertUnauthorized /> : null}
      {noDataFound ? <AlertDataNotFound setNoDataFound={setNoDataFound} /> : null}

      <Grid templateColumns={{ sm: "1fr", lg: "2fr 1.2fr" }} templateRows="1fr">
        <Box>
          <Flex
            justify="space-between"
            align="center"
            minHeight="60px"
            w="100%"
          >
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              {singleCustomer ? singleCustomer.name : "Customer Name"}
            </Text>
            {/* Edit Customer Modal */}
            {singleCustomer ? (
              <EditCustomer
                customer={singleCustomer}
                defaultsource={singleCustomerDefaultSource}
                sources={singleCustomerSources}
                email={customerMetaEmail}
                bg={"primaryColor"}
                setisReload={setisReload}
                setReloadState={setReloadState}
              />
            ) : (
              ""
            )}
          </Flex>
          <Grid
            templateColumns={{
              sm: "1fr",
              md: "1fr 1fr",
              xl: "1fr 1fr 1fr 1fr",
            }}
            templateRows={{ sm: "auto auto auto", md: "1fr auto", xl: "1fr" }}
            gap="26px"
          >
            {singleCustomerDefaultSource ? (
              <Card
                backgroundImage={BackgroundCard1}
                backgroundRepeat="no-repeat"
                background="cover"
                bgPosition="10%"
                p="16px"
                h={{ sm: "220px", xl: "100%" }}
                gridArea={{ md: "1 / 1 / 2 / 3", xl: "1 / 1 / 2 / 3" }}
              >
                <CardBody h="100%" w="100%">
                  <Flex
                    direction="column"
                    color="white"
                    h="100%"
                    p="0px 10px 20px 10px"
                    w="100%"
                  >
                    <Flex justify="space-between" align="center">
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        {singleCustomer ? singleCustomer.name : "Customer"}
                      </Text>
                      <Icon
                        as={RiMastercardFill}
                        w="48px"
                        h="auto"
                        color="gray.400"
                      />
                    </Flex>
                    <Spacer />
                    <Flex direction="column">
                      <Box>
                        <Text
                          fontSize="xl"
                          letterSpacing="2px"
                          fontWeight="bold"
                        >
                          <CardDetails />
                        </Text>
                      </Box>
                      <Flex mt="14px">
                        <Flex direction="column" me="34px">
                          <Text fontSize="xs">BRAND</Text>
                          <Text fontSize="xs" fontWeight="bold">
                            {/* {singleCustomerSources !== null &&
                          singleCustomerSources.data.length > 0 ? (
                            singleCustomerSources.data[0].card.brand
                          ) : (
                            <SkeletonText noOfLines={1} />
                          )} */}
                            {singleCustomerDefaultSource ? (
                              singleCustomerDefaultSource.card ? (
                                singleCustomerDefaultSource.card.brand
                              ) : (
                                <SkeletonText noOfLines={1} />
                              )
                            ) : (
                              <SkeletonText noOfLines={1} />
                            )}
                          </Text>
                        </Flex>
                        <Flex direction="column" me="34px">
                          <Text fontSize="xs">VALID THRU</Text>
                          <Text fontSize="xs" fontWeight="bold">
                            {singleCustomerDefaultSource ? (
                              singleCustomerDefaultSource.card ? (
                                `${singleCustomerDefaultSource.card.exp_month}/${singleCustomerDefaultSource.card.exp_year}`
                              ) : (
                                <SkeletonText noOfLines={1} />
                              )
                            ) : (
                              "N/A"
                            )}
                          </Text>
                        </Flex>
                        <Flex direction="column">
                          <Text fontSize="xs">CVV</Text>
                          <Text fontSize="xs" fontWeight="bold">
                            {singleCustomerDefaultSource ? (
                              singleCustomerDefaultSource.card ? (
                                singleCustomerDefaultSource.card.cvc_check
                              ) : (
                                <SkeletonText noOfLines={1} />
                              )
                            ) : (
                              "N/A"
                            )}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </CardBody>
              </Card>
            ) : (
              ""
            )}
            <Card p="16px" display="flex" align="center" justify="center">
              <CardBody>
                <Flex direction="column" align="center" w="100%" py="14px">
                  <IconBox h={"60px"} w={"60px"} bg={iconTeal}>
                    <Icon h={"24px"} w={"24px"} color="white" as={FaWallet} />
                  </IconBox>
                  <Flex
                    direction="column"
                    m="14px"
                    justify="center"
                    textAlign="center"
                    align="center"
                    w="100%"
                  >
                    <Text fontSize="md" color={textColor} fontWeight="bold">
                      Balance
                    </Text>
                    <Text
                      mb="24px"
                      fontSize="xs"
                      color="gray.400"
                      fontWeight="semibold"
                    >
                      Current Balance
                    </Text>
                    <Separator />
                  </Flex>
                  <Text fontSize="lg" color={textColor} fontWeight="bold">
                    {singleCustomer ? `$${singleCustomer.balance}/-` : "0.00"}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
            <Card p="16px" display="flex" align="center" justify="center">
              <CardBody>
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  w="100%"
                  py="14px"
                >
                  <IconBox h={"60px"} w={"60px"} bg={iconTeal}>
                    <Icon
                      h={"24px"}
                      w={"24px"}
                      color="white"
                      as={FaUserCircle}
                    />
                  </IconBox>
                  <Flex
                    direction="column"
                    m="14px"
                    justify="center"
                    textAlign="center"
                    align="center"
                    w="100%"
                  >
                    <Text fontSize="md" color={textColor} fontWeight="bold">
                      Email
                    </Text>
                    <Text
                      mb="24px"
                      fontSize="xs"
                      color="gray.400"
                      fontWeight="semibold"
                      textTransform="capitalize"
                    >
                      Type:{" "}
                      {singleCustomer ? singleCustomer.object : "Customer"}
                    </Text>
                    <Separator />
                  </Flex>

                  <Text fontSize="sm" color={textColor} fontWeight="bold">
                    {singleCustomer ? singleCustomer.email : "Email Address"}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
          </Grid>
          <Card my={{ lg: "24px" }} me={{ lg: "24px" }}>
            <CardHeader py="12px">
              <Flex
                justify="space-between"
                align="center"
                minHeight="60px"
                w="100%"
              >
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Billing Sources
                </Text>
                {/* Create Payment Modal */}
                {singleCustomer &&
                singleCustomerSources &&
                singleCustomerDefaultSource &&
                singleCustomerPayments ? (
                  <PaymentForm
                    customer={singleCustomer}
                    defaultsource={singleCustomerDefaultSource}
                    sources={singleCustomerSources}
                    email={customerMetaEmail}
                    bg={bgButton}
                    setisReload={setisReload}
                    setReloadState={setReloadState}
                  />
                ) : (
                  ""
                )}
              </Flex>
              {/* <Text color={textColor} fontSize="lg" fontWeight="bold">
            Billing Sources
          </Text> */}
            </CardHeader>
            <Grid gap={5} templateColumns={{ sm: "1fr", lg: "repeat(2, 1fr)" }}>
              {billingSourceOwner !== null
                ? billingSourceOwner.map((val, index) => {
                    return (
                      <CardBody>
                        <Flex direction="column" w="100%">
                          <BillingRowSourcesAccordion
                            key={index}
                            last4={
                              val.type !== "ach_credit_transfer" &&
                              val.card.last4 !== null
                                ? val.card.last4
                                : "N/A"
                            }
                            brand={
                              val.type !== "ach_credit_transfer" &&
                              val.card.brand !== null
                                ? val.card.brand
                                : "N/A"
                            }
                            name={
                              val.owner.name !== null ? val.owner.name : "N/A"
                            }
                            email={
                              val.owner.email !== null ? val.owner.email : "N/A"
                            }
                            phone={
                              val.owner.phone !== null ? val.owner.phone : "N/A"
                            }
                            country={
                              val.owner.address !== null &&
                              val.owner.address.country !== null
                                ? val.owner.address.country
                                : "N/A"
                            }
                            state={
                              val.owner.address !== null &&
                              val.owner.address.state !== null
                                ? val.owner.address.state
                                : "N/A"
                            }
                            city={
                              val.owner.address !== null &&
                              val.owner.address.city !== null
                                ? val.owner.address.city
                                : "N/A"
                            }
                            line1={
                              val.owner.address !== null &&
                              val.owner.address.line1 !== null
                                ? val.owner.address.line1
                                : "N/A"
                            }
                            line2={
                              val.owner.address !== null &&
                              val.owner.address.line2 !== null
                                ? val.owner.address.line2
                                : "N/A"
                            }
                            postal_code={
                              val.owner.address !== null &&
                              val.owner.address.postal_code !== null
                                ? val.owner.address.postal_code
                                : "N/A"
                            }
                            type={val.type}
                            value={val}
                          />
                        </Flex>
                      </CardBody>
                    );
                  })
                : ""}
            </Grid>
          </Card>

          <Card my={{ lg: "24px" }} me={{ lg: "24px" }}>
            <CardHeader py="12px">
              <Flex
                justify="space-between"
                align="center"
                minHeight="60px"
                w="100%"
              >
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Customer Information
                </Text>
                {/* Create Payment Modal */}
              </Flex>
            </CardHeader>
            <Grid gap={5} templateColumns={{ sm: "1fr", lg: "repeat(2, 1fr)" }}>
              {singleCustomer !== null ? (
                <Accordion allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Flex
                            direction={{ sm: "column", md: "row" }}
                            align="center"
                            w="100%"
                            justify="center"
                            py="1rem"
                          >
                            <IconBox me="10px" w="25px" h="22px">
                              <PersonIcon w="100%" h="100%" />
                            </IconBox>
                            <Text
                              color="gray.400"
                              fontSize="md"
                              fontWeight="semibold"
                            >
                              {singleCustomer.name !== null
                                ? singleCustomer.name
                                : "No customer name"}
                            </Text>
                            <Spacer />
                            <Button
                              p="0px"
                              bg="transparent"
                              w="16px"
                              h="16px"
                              variant="no-hover"
                            ></Button>
                          </Flex>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Box p="24px" bg={bgColor} my="" borderRadius="12px">
                        <Flex justify="space-between" w="100%">
                          <Flex direction="column" maxWidth="70%">
                            {/* <Text
              color={nameColor}
              fontSize="md"
              fontWeight="bold"
              mb="10px"
              textTransform="capitalize"
            >
              {singleCustomer.name!==null?singleCustomer.name:"N/A"}
            </Text> */}
                            <Text
                              color="gray.400"
                              fontSize="sm"
                              fontWeight="semibold"
                            >
                              Email Address:{" "}
                              <Text as="span" color="gray.500">
                                {singleCustomer.email !== null
                                  ? singleCustomer.email
                                  : "N/A"}
                              </Text>
                            </Text>
                            <Text
                              color="gray.400"
                              fontSize="sm"
                              fontWeight="semibold"
                            >
                              Phone Number:{" "}
                              <Text as="span" color="gray.500">
                                {singleCustomer.phone !== null
                                  ? singleCustomer.phone
                                  : "N/A"}
                              </Text>
                            </Text>
                            <Text
                              color="gray.400"
                              fontSize="sm"
                              fontWeight="semibold"
                            >
                              Country:{" "}
                              <Text as="span" color="gray.500">
                                {singleCustomer.address !== null &&
                                singleCustomer.address.country !== null
                                  ? singleCustomer.address.country
                                  : "N/A"}
                              </Text>
                            </Text>
                            <Text
                              color="gray.400"
                              fontSize="sm"
                              fontWeight="semibold"
                            >
                              State:{" "}
                              <Text as="span" color="gray.500">
                                {singleCustomer.address !== null &&
                                singleCustomer.address.state !== null
                                  ? singleCustomer.address.state
                                  : "N/A"}
                              </Text>
                            </Text>
                            <Text
                              color="gray.400"
                              fontSize="sm"
                              fontWeight="semibold"
                            >
                              City:{" "}
                              <Text as="span" color="gray.500">
                                {singleCustomer.address !== null &&
                                singleCustomer.address.city !== null
                                  ? singleCustomer.address.city
                                  : "N/A"}
                              </Text>
                            </Text>
                            <Text
                              color="gray.400"
                              fontSize="sm"
                              fontWeight="semibold"
                            >
                              Address 1:{" "}
                              <Text as="span" color="gray.500">
                                {singleCustomer.address !== null &&
                                singleCustomer.address.line1 !== null
                                  ? singleCustomer.address.line1
                                  : "N/A"}
                              </Text>
                            </Text>
                            <Text
                              color="gray.400"
                              fontSize="sm"
                              fontWeight="semibold"
                            >
                              Address 2:{" "}
                              <Text as="span" color="gray.500">
                                {singleCustomer.address !== null &&
                                singleCustomer.address.line2 !== null
                                  ? singleCustomer.address.line2
                                  : "N/A"}
                              </Text>
                            </Text>
                            <Text
                              color="gray.400"
                              fontSize="sm"
                              fontWeight="semibold"
                            >
                              Postal Code:{" "}
                              <Text as="span" color="gray.500">
                                {singleCustomer.address !== null &&
                                singleCustomer.address.postal_code !== null
                                  ? singleCustomer.address.postal_code
                                  : "N/A"}
                              </Text>
                            </Text>
                          </Flex>
                        </Flex>
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              ) : (
                ""
              )}
            </Grid>
          </Card>
        </Box>
        {singleCustomerPayments ? (
          <Card my="24px" ms={{ lg: "24px" }}>
            <CardHeader mb="12px">
              <Flex direction="column" w="100%">
                <Flex
                  direction={{ sm: "column", lg: "row" }}
                  justify={{ sm: "center", lg: "space-between" }}
                  align={{ sm: "center" }}
                  w="100%"
                  my={{ md: "12px" }}
                >
                  <Text
                    color={textColor}
                    fontSize={{ sm: "lg", md: "xl", lg: "lg" }}
                    fontWeight="bold"
                  >
                    Customer Transactions
                  </Text>
                  <Flex align="center">
                    {/* <Icon
                      as={FaRegCalendarAlt}
                      color="gray.400"
                      fontSize="md"
                      me="6px"
                    ></Icon> */}
                    {/* <Text color="gray.400" fontSize="sm" fontWeight="semibold">
                    23 - 30 March 2021
                  </Text> */}
                  </Flex>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody style={{ flexDirection: "column" }}>
              <Flex
                direction="column"
                w="100%"
                style={
                  singleCustomerPayments.data.length > 5
                    ? { overflowY: "scroll", height: "377px" }
                    : null
                }
              >
                {singleCustomerPayments.data.length > 0 ? (
                  singleCustomerPayments.data.map((row, index) => {
                    return (
                      <>
                        <NavLink
                          to={`/admin/detail/${row.id}`}
                          className="anchor_hover"
                        >
                          <TransactionRowBilling
                            key={index}
                            name={row.description}
                            status={row.status}
                            logo={row.status}
                            date={datadate(row.created)}
                            price={dataamount(row.amount)}
                            charges={row.charges}
                          />
                        </NavLink>
                      </>
                    );
                  })
                ) : (
                  <Badge colorScheme="red" p={2}>
                    There's no transactions!
                  </Badge>
                )}
                {/* <Text
                  color="gray.400"
                  fontSize={{ sm: "sm", md: "md" }}
                  fontWeight="semibold"
                  my="12px"
                >
                  OLDER
                </Text>
                {olderTransactions.map((row, index) => {
                  return (
                    <TransactionRowBilling
                      key={index}
                      name={row.name}
                      logo={row.logo}
                      date={row.date}
                      price={row.price}
                    />
                  );
                })} */}
              </Flex>
              <Box textAlign="center">
                {singleCustomerPayments &&
                singleCustomerPayments.data.length > 0 &&
                singleCustomerPayments.has_more == true ? (
                  <NavLink to={`/admin/payments/?customer=${id}`}>
                    <Button
                      bg="primaryColor"
                      w={200}
                      color="#fff"
                      borderRadius={6}
                      py={15}
                      mt={5}
                      _hover={{ color: "#fff", bg: "#000" }}
                    >
                      See More
                    </Button>
                  </NavLink>
                ) : null}
              </Box>
            </CardBody>
          </Card>
        ) : (
          ""
        )}
      </Grid>
      {/* BILLING SOURCES*/}

      {/* INVOICES PDF  */}
      {/* <Card
          p="22px"
          my={{ sm: "24px", lg: "0px" }}
          ms={{ sm: "0px", lg: "24px" }}
        >
          <CardHeader>
            <Flex justify="space-between" align="center" mb="1rem" w="100%">
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                Invoices
              </Text>
              <Button
                colorScheme="teal"
                borderColor="primaryColor"
                color="primaryColor"
                variant="outline"
                fontSize="xs"
                p="8px 32px"
              >
                VIEW ALL
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" w="100%">
              {invoicesData.map((row, index) => {
                return (
                  <InvoicesRow
                    key={index}
                    date={row.date}
                    code={row.code}
                    price={row.price}
                    logo={row.logo}
                    format={row.format}
                  />
                );
              })}
            </Flex>
          </CardBody>
        </Card> */}
    </Flex>
  );
}

export default Billing;
