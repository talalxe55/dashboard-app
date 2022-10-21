import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [singleCustomerSources, setSingleCustomerSources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unauthorizedWarning, setUnauthorizedWarning] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
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
    // getAllPaymentsByCustomerID();
    getCustomerID();
  }, []);

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

  const CardDetails = () => {
    if (singleCustomerSources) {
      if (singleCustomerSources.data.length > 0) {
        if (Object.keys(singleCustomerSources.data[0].card) !== 0) {
          if (singleCustomerSources.data[0].card.last4.length > 0) {
            return (
              <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
                XXXX XXXX XXXX {singleCustomerSources.data[0].card.last4}
              </Text>
            );
          } else {
            return <SkeletonText noOfLines={1} />;
          }
        }
      } else {
        return (
          <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
            No card is attached
          </Text>
        );
      }
    } else {
      return <SkeletonText noOfLines={1} />;
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
                      <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
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
                          {singleCustomerSources ? (
                            singleCustomerSources.data.length > 0 ? (
                              singleCustomerSources.data[0].card ? (
                                singleCustomerSources.data[0].card.brand
                              ) : (
                                <SkeletonText noOfLines={1} />
                              )
                            ) : (
                              "N/A"
                            )
                          ) : (
                            <SkeletonText noOfLines={1} />
                          )}
                        </Text>
                      </Flex>
                      <Flex direction="column" me="34px">
                        <Text fontSize="xs">VALID THRU</Text>
                        <Text fontSize="xs" fontWeight="bold">
                          {singleCustomerSources ? (
                            singleCustomerSources.data.length > 0 ? (
                              singleCustomerSources.data[0].card ? (
                                `${singleCustomerSources.data[0].card.exp_month}/${singleCustomerSources.data[0].card.exp_year}`
                              ) : (
                                <SkeletonText noOfLines={1} />
                              )
                            ) : (
                              "N/A"
                            )
                          ) : (
                            <SkeletonText noOfLines={1} />
                          )}
                        </Text>
                      </Flex>
                      <Flex direction="column">
                        <Text fontSize="xs">CVV</Text>
                        <Text fontSize="xs" fontWeight="bold">
                          {singleCustomerSources ? (
                            singleCustomerSources.data.length > 0 ? (
                              singleCustomerSources.data[0].card ? (
                                singleCustomerSources.data[0].card.cvc_check
                              ) : (
                                <SkeletonText noOfLines={1} />
                              )
                            ) : (
                              "N/A"
                            )
                          ) : (
                            <SkeletonText noOfLines={1} />
                          )}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
            <Card p="16px" display="flex" align="center" justify="center">
              <CardBody>
                <Flex direction="column" align="center" w="100%" py="14px">
                  <IconBox as="box" h={"60px"} w={"60px"} bg={iconTeal}>
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
                  <IconBox as="box" h={"60px"} w={"60px"} bg={iconTeal}>
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
                      Meta
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
                <PaymentForm bg={bgButton} />
              </Flex>
            </CardHeader>
            <Grid gap={5} templateColumns={{ sm: "1fr", lg: "repeat(2, 1fr)" }}>
              {/* {console.log(singleCustomerSources.data)} */}
              {singleCustomerSources ? (
                singleCustomerSources.data.length > 0 ? (
                  singleCustomerSources.data.map((val, index) => {
                    if (val.card !== undefined) {
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
                                {"XXXX XXXX X12XXX " + val.card.last4}
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
                  Your Transactions
                </Text>
                <Flex align="center">
                  <Icon
                    as={FaRegCalendarAlt}
                    color="gray.400"
                    fontSize="md"
                    me="6px"
                  ></Icon>
                  <Text color="gray.400" fontSize="sm" fontWeight="semibold">
                    23 - 30 March 2021
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" w="100%">
              <Text
                color="gray.400"
                fontSize={{ sm: "sm", md: "md" }}
                fontWeight="semibold"
                my="12px"
              >
                NEWEST
              </Text>
              {newestTransactions.map((row, index) => {
                return (
                  <TransactionRowBilling
                    key={index}
                    name={row.name}
                    logo={row.logo}
                    date={row.date}
                    price={row.price}
                  />
                );
              })}
              <Text
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
              })}
            </Flex>
          </CardBody>
        </Card>
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
