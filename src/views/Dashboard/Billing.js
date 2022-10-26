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
  Heading,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBell,
  FaCreditCard,
  FaFilePdf,
  FaHtml5,
  FaShoppingCart,
} from "react-icons/fa";
import { PhoneIcon, AddIcon, WarningIcon, InfoIcon } from "@chakra-ui/icons";
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
import { FaUserCircle, FaRegCalendarAlt, FaWallet } from "react-icons/fa";
import { RiMastercardFill } from "react-icons/ri";
import {
  billingData,
  invoicesData,
  newestTransactions,
  olderTransactions,
} from "variables/general";
import axios from "axios";
import { API_SERVER, TOKEN_TYPE, TOKEN, ACCEPT_TYPE } from "config/constant";
import { VisaIcon } from "components/Icons/Icons";
import { MastercardIcon } from "components/Icons/Icons";
import BillingRowSources from "components/Tables/BillingRowSources";
import { getAllPaymentsByCustomerID } from "api/ApiListing";
import {
  AlertUnauthorized,
  AlertDataNotFound,
} from "theme/components/AlertDialog";

function Billing() {
  let { id } = useParams();
  var array = [];
  const [singleCustomer, setSingleCustomer] = useState();
  const [singleCustomerPayments, setSingleCustomerPayments] = useState(null);
  const [singleCustomerSources, setSingleCustomerSources] = useState(null);
  const [
    singleCustomerDefaultSource,
    setsingleCustomerDefaultSource,
  ] = useState(null);
  const [customerMetaEmail, setcustomerMetaEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unauthorizedWarning, setUnauthorizedWarning] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);

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
      // console.log(data.sources.data);
      array.push(data);
      //return data;
      // console.log(data);
      setSingleCustomer(data);
      setSingleCustomerSources(data.sources);
      extractSource(data.sources);
      setLoading(false);
    } catch (err) {
      if (err.response.status === 404) {
        console.log("No data found!!");
        setNoDataFound(true);
        console.log("Resource could not be found!");
      } else if (err.response.status === 401) {
        console.log("Unauthorized!");
        localStorage.removeItem("user");
        setUnauthorizedWarning(true);
      } else {
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    // custData.then((value) => {
    //   // console.log(value.data.data);
    //   setSingleCustomer(value.data.data);
    //   // console.log(singleCustomer);
    // });
    // console.log(getCustomerID(id));
    // setSingleCustomer(getCustomerID(id));
    const response = getAllPaymentsByCustomerID(id);
    response
      .then((res) => {
        console.log(res.data.data);
        setSingleCustomerPayments(res.data.data);
      })
      .catch((err) => {
        if (err.response.status == 400) {
          console.log(err);
        }
        if (err.response.status == 401) {
          setUnauthorizedWarning(true);
        }
      });
    getCustomerID();
  }, []);

  useEffect(() => {
    // custData.then((value) => {
    //   // console.log(value.data.data);
    //   setSingleCustomer(value.data.data);
    //   // console.log(singleCustomer);
    // });
    // console.log(getCustomerID(id));
    // setSingleCustomer(getCustomerID(id));

    if (
      singleCustomerPayments !== null &&
      singleCustomerPayments.data.length > 0
    ) {
      singleCustomerPayments.data.forEach((item, index) => {
        if (item.metadata !== null) {
          if ("customer_email" in item.metadata) {
            console.log(item.metadata.customer_email);
            setcustomerMetaEmail(item.metadata.customer_email);
            return;
          }
        }
      });
    }
  }, [singleCustomerPayments]);

  // Chakra color mode
  const iconTeal = useColorModeValue("teal.300", "teal.300");
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
      //console.log(singleCustomerDefaultSource);
      //   return (
      //     <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
      //       XXXX XXXX XXXX {singleCustomerSources.data[0].card.last4}
      //     </Text>
      //   );
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
      {noDataFound ? <AlertDataNotFound /> : null}

      <Grid templateColumns={{ sm: "1fr", lg: "2fr 1.2fr" }} templateRows="1fr">
        <Box>
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

                  <Text
                    fontSize="sm"
                    color={textColor}
                    fontWeight="bold"
                    wordBreak="break-all"
                  >
                    {singleCustomer ? singleCustomer.email : "Email"}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
          </Grid>
          <Card p="16px" mt="24px">
            <CardHeader>
              <Flex
                justify="space-between"
                align="center"
                minHeight="60px"
                w="100%"
              >
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Payment Method
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
                  />
                ) : (
                  ""
                )}
              </Flex>
            </CardHeader>
            <Grid gap={5} templateColumns={{ sm: "1fr", lg: "repeat(2, 1fr)" }}>
              {/* {console.log(singleCustomerSources.data)} */}
              {singleCustomerSources ? (
                singleCustomerSources.data.length > 0 ? (
                  singleCustomerSources.data.map((val, index) => {
                    if (val.object === "source" && val.ach_credit_transfer) {
                      return (
                        <Text>
                          {val.ach_credit_transfer.bank_name +
                            " | " +
                            val.ach_credit_transfer.account_number}
                        </Text>
                      );
                    } else if (
                      val.card !== undefined &&
                      val.object == "source"
                    ) {
                      return (
                        <CardBody key={index}>
                          <Flex
                            direction={{ sm: "column", md: "row" }}
                            align="center"
                            w="100%"
                            justify="center"
                            py="1rem"
                          >
                            <Flex
                              p="1rem"
                              bg="transparent"
                              borderRadius="15px"
                              width="100%"
                              border="1px solid"
                              borderColor={borderColor}
                              align="center"
                              mb={{ sm: "24px", md: "0px" }}
                              me={{ sm: "0px", md: "24px" }}
                            >
                              <IconBox me="10px" w="25px" h="22px">
                                {val ? (
                                  (val.card.brand === "Visa",
                                  (<VisaIcon w="100%" h="100%" />))
                                ) : (
                                  <VisaIcon w="100%" h="100%" />
                                )}
                              </IconBox>
                              <Text
                                color="gray.400"
                                fontSize="md"
                                fontWeight="semibold"
                              >
                                {val.card
                                  ? "XXXX XXXX XXXX " + val.card.last4
                                  : ""}
                              </Text>
                              <Spacer />
                              <Button
                                p="0px"
                                bg="transparent"
                                w="16px"
                                h="16px"
                                variant="no-hover"
                              >
                                <Tooltip
                                  hasArrow
                                  label="This is the business name your customers will see on their card statements and other transactions."
                                  color="white"
                                >
                                  <InfoIcon />
                                </Tooltip>
                              </Button>
                            </Flex>
                          </Flex>
                        </CardBody>
                      );
                    } else {
                      return (
                        <CardBody key={index}>
                          <Flex
                            direction={{ sm: "column", md: "row" }}
                            align="center"
                            w="100%"
                            justify="center"
                            py="1rem"
                          >
                            <Flex
                              p="1rem"
                              bg="transparent"
                              borderRadius="15px"
                              width="100%"
                              border="1px solid"
                              borderColor={borderColor}
                              align="center"
                              mb={{ sm: "24px", md: "0px" }}
                              me={{ sm: "0px", md: "24px" }}
                            >
                              <IconBox me="10px" w="25px" h="22px">
                                {val ? (
                                  val.brand === "Visa" ? (
                                    <VisaIcon w="100%" h="100%" />
                                  ) : val.brand === "MasterCard" ? (
                                    <MastercardIcon w="100%" h="100%" />
                                  ) : (
                                    <VisaIcon w="100%" h="100%" />
                                  )
                                ) : (
                                  ""
                                )}
                              </IconBox>
                              <Text
                                color="gray.400"
                                fontSize="md"
                                fontWeight="semibold"
                              >
                                {"XXXX XXXX XXXX " + val.last4}
                              </Text>
                              <Spacer />
                              <Button
                                p="0px"
                                bg="transparent"
                                w="16px"
                                h="16px"
                                variant="no-hover"
                              >
                                <InfoIcon />
                              </Button>
                            </Flex>
                          </Flex>
                        </CardBody>
                      );
                    }
                  })
                ) : (
                  "No Card found!"
                )
              ) : (
                <SkeletonText noOfLines={3} />
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
            <CardBody>
              <Flex direction="column" w="100%">
                {singleCustomerPayments.data.length > 0
                  ? singleCustomerPayments.data.map((row, index) => {
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
                  : ""}
                {singleCustomerPayments &&
                singleCustomerPayments.data.length > 0 ? (
                  <NavLink
                    to={`/admin/payments/?customer=${id}`}
                    style={{ textAlign: "center" }}
                  >
                    <Button
                      textAlign="center"
                      bg="teal.300"
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
            </CardBody>
          </Card>
        ) : (
          ""
        )}
      </Grid>
      {/* BILLING SOURCES*/}
      <Card my={{ lg: "24px" }} me={{ lg: "24px" }}>
        <CardHeader py="12px">
          <Text color={textColor} fontSize="lg" fontWeight="bold">
            Billing Sources
          </Text>
        </CardHeader>
        <Grid gap={5} templateColumns={{ sm: "1fr", lg: "repeat(2, 1fr)" }}>
          {singleCustomerSources ? (
            singleCustomerSources.data.length > 0 ? (
              singleCustomerSources.data.map((val, index) => {
                if (val.card !== undefined) {
                  {
                    /* console.log(val.owner); */
                  }
                  return (
                    <>
                      <CardBody>
                        <Flex direction="column" w="100%">
                          <BillingRowSources
                            key={index}
                            name={val.owner.name}
                            email={val.owner.email}
                            phone={val.owner.phone}
                            country={val.owner.address.country}
                            state={val.owner.address.state}
                            city={val.owner.address.city}
                            line1={val.owner.address.line1}
                            line2={val.owner.address.line2}
                            postal_code={val.owner.address.postal_code}
                          />
                        </Flex>
                      </CardBody>
                    </>
                  );
                }
              })
            ) : (
              "There is no card!"
            )
          ) : (
            <SkeletonText noOfLines={9} />
          )}
        </Grid>
      </Card>
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
                borderColor="teal.300"
                color="teal.300"
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
