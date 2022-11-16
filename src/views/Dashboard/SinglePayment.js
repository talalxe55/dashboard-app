import { useState, useEffect } from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// Chakra imports
import {
  Box,
  Input,
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
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  CloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import SweetAlert from "react-bootstrap-sweetalert";
// Assets
import BackgroundCard1 from "assets/img/BackgroundCard1.png";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import IconBox from "components/Icons/IconBox";
import PaymentBillingRow from "components/Tables/PaymentBillingRow";
import InvoicesRow from "components/Tables/InvoicesRow";
import TransactionRow from "components/Tables/TransactionRow";
import { Separator } from "components/Separator/Separator";
import PaymentForm from "theme/components/PaymentForm";
import React from "react";
import { FaUserCircle, FaRegCalendarAlt, FaWallet } from "react-icons/fa";
import { RiMastercardFill } from "react-icons/ri";
import {
  AlertUnauthorized,
  AlertDataNotFound,
  AlertChargeSucceeded,
} from "theme/components/AlertDialog";
import {
  billingData,
  invoicesData,
  newestTransactions,
  olderTransactions,
} from "variables/general";
import axios from "axios";
import { API_SERVER, TOKEN_TYPE, TOKEN, ACCEPT_TYPE } from "config/constant";
import { setConstantValue } from "typescript";
import RefundForm from "../../theme/components/RefundForm.js";

function Detail() {
  let { id } = useParams();
  var array = [];
  const [singleCustomer, setSingleCustomer] = useState(null);
  const [singlePayment, setSinglePayment] = useState();
  const [singleCharge, setSingleCharge] = useState({ data: [] });
  const [singleCustomerSources, setSingleCustomerSources] = useState();
  const [SingleCustomerEmail, setSingleCustomerEmail] = useState();
  const [SinglePaymentMeta, setSinglePaymentMeta] = useState(null);
  const [errorData, seterrorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isReload, setisReload] = useState(false);
  const [chargeSuccess, setchargeSuccess] = useState(false);
  const [refundAmount, setrefundAmount] = useState(false);
  const [refundbtntext, setrefundbtntext] = useState("Create Refund");
  const [paymentbtnLoader, setpaymentbtnLoader] = useState(false);
  const [isUnauthorized, setisUnauthorized] = useState(null);
  const [datanotFound, setdatanotFound] = useState(null);
  const history = useHistory();
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
  const getCustomerEmail = async (id) => {
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
      setSingleCustomerEmail(data.email);
    } catch (err) {
      if (err.response.status === 404) {
        setdatanotFound(true);
      } else if (err.response.status === 401) {
        setisUnauthorized(true);
      } else {
      }
    }
  };

  const getCustomerSource = async (id, cus) => {
    setLoading(false);

    try {
      if (id.startsWith("src")) {
        const res = await axios.get(`${API_SERVER}sources/${id}`, {
          headers: {
            Authorization: `${TOKEN_TYPE} ${TOKEN}`,
            Accept: `${ACCEPT_TYPE}`,
            "Content-Type": `${ACCEPT_TYPE}`,
          },
        });
        let data = await res.data.data;
        setSingleCustomerSources(data);
      } else if (id.startsWith("card")) {
        const res = await axios.get(
          `${API_SERVER}customers/${cus}/cards/${id}`,
          {
            headers: {
              Authorization: `${TOKEN_TYPE} ${TOKEN}`,
              Accept: `${ACCEPT_TYPE}`,
              "Content-Type": `${ACCEPT_TYPE}`,
            },
          }
        );
        let data = await res.data.data;
        setSingleCustomerSources({
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
        });
      }
    } catch (err) {
      if (err.response.status === 404) {
        setdatanotFound(true);
      } else if (err.response.status === 401) {
        setisUnauthorized(true);
      } else {
      }
    }
  };

  const getCustomerID = async () => {
    setLoading(false);
    try {
      const res = await axios.get(`${API_SERVER}payments/retrieve/${id}`, {
        headers: {
          Authorization: `${TOKEN_TYPE} ${TOKEN}`,
          Accept: `${ACCEPT_TYPE}`,
          "Content-Type": `${ACCEPT_TYPE}`,
        },
      });

      let data = await res.data.data;
      array.push(data);
      setSinglePayment(data);
      setSingleCharge(data.charges);
      setSinglePaymentMeta(data.metadata);
      if (data.source !== null) {
        const source = await getCustomerSource(data.source, data.customer);
      } else if (data.payment_method !== null) {
        const source = await getCustomerSource(
          data.payment_method,
          data.customer
        );
      }
      if (data.customer !== null) {
        const customer = await getCustomerEmail(data.customer);
      }
    } catch (err) {
      if (err.response.status === 404) {
        setdatanotFound(true);
      } else if (err.response.status === 401) {
        setisUnauthorized(true);
      } else {
      }
    }
  };

  function showMeta() {
    const timesTwo = [];

  }

  const ProductList = () => {
    const productEntries = [SinglePaymentMeta];
    const keys = Object.keys(SinglePaymentMeta);
    return productEntries.map((item, index) => {

      return (
        <Box p="0px" bg={"#F8F9FA"} my="22px" borderRadius="12px">
          <Flex justify="space-between" w="100%">
            <Flex direction="column" maxWidth="100%">
              <ul>
                {Object.keys(item).map((val, index) => {
                  return (
                    <Text color="gray.400" fontSize="sm" fontWeight="semibold">
                      {val} :{" "}
                      <Text as="span" color="gray.500">
                        {item[val]}
                      </Text>
                    </Text>
                  );
                })}
              </ul>
            </Flex>
          </Flex>
        </Box>
      );
    });
  };

  function toStatus(val) {
    var str = "";

    if (val.status === "succeeded") {
      if (val.charges.data.length !== null) {
        var data = val.charges.data[val.charges.data.length - 1];
        if (data.refunded == true && data.refunds.data.length > 0) {
          str = "refunded";
        } else if (data.amount_refunded > 0) {
          str = "partial_refunded";
        } else {
          str = val.status;
        }
      } else {
        str = val.status;
      }
    } else {
      str = val.status;
    }

    const arr = str.split("_");

    const result = [];

    for (const word of arr) {
      result.push(word.charAt(0).toUpperCase() + word.slice(1));
    }

    return result.join(" ");
  }
  function setStatus() {
    var status = toStatus(singlePayment);
    if (status === "Succeeded") {
      return (
        <Text
          fontSize="xl"
          fontWeight="bold"
          textTransform="capitalize"
          color={"green.300"}
        >
          {status}
        </Text>
      );
    } else if (status === "Refunded" || status === "Partial Refunded") {
      return (
        <Text
          fontSize="xl"
          fontWeight="bold"
          textTransform="capitalize"
          color={"primaryColor"}
        >
          {status}
        </Text>
      );
    } else {
      return (
        <Text
          fontSize="xl"
          fontWeight="bold"
          textTransform="capitalize"
          color={"black.300"}
        >
          {status}
        </Text>
      );
    }
  }
  useEffect(() => {
    getCustomerID();
  }, []);

  useEffect(() => {
    if (isReload) {
      getCustomerID();
    }
  }, [isReload]);
  const setReloadState = (value) => {
    if (value == true) {
      getCustomerID();
    }
  };
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

  const attemptCharge = async () => {
    setLoading(false);
    try {
      const res = await axios.get(`${API_SERVER}payments/confirm/${id}`, {
        headers: {
          Authorization: `${TOKEN_TYPE} ${TOKEN}`,
          Accept: `${ACCEPT_TYPE}`,
          "Content-Type": `${ACCEPT_TYPE}`,
        },
      });

      let data = await res.data.data;
      if (data.status == "succeeded") {
        setpaymentbtnLoader(false);
        setchargeSuccess(true);
      }
      getCustomerID();

      //setSingleCustomerSources(data.sources);
      //setLoading(false);
    } catch (err) {
      setpaymentbtnLoader(false);
      if (err.response.status === 404) {
        setdatanotFound(true);
      } else if (err.response.status === 401) {
        setisUnauthorized(true);
      } else if (err.response.status === 400) {
        seterrorData({
          message: err.response.data.error.message,
          status: "error",
          title: "Payment Unsuccessfull",
        });
      } else {
      }
    }
  };

  const AlertBox = () => {
    const { isOpen: isVisible, onClose, onOpen } = useDisclosure({
      defaultIsOpen: true,
    });
    //const [message, error, status, title] = props;
    return errorData !== null ? (
      <Alert status={errorData.status}>
        <AlertIcon />
        <Box>
          <AlertTitle>{errorData.title}</AlertTitle>
          <AlertDescription>{errorData.message}</AlertDescription>
        </Box>
        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          top={-1}
          onClick={() => seterrorData(null)}
        />
      </Alert>
    ) : (
      ""
    );
  };

  const CardDetails = () => {
    if (singleCustomerSources) {
      //   return (
      //     <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
      //       XXXX XXXX XXXX {singleCustomerSources.data[0].card.last4}
      //     </Text>
      //   );
      if (Object.keys(singleCustomerSources.card) !== 0) {
        if (singleCustomerSources.card.last4.length > 0) {
          return (
            <Text fontSize="xl" letterSpacing="2px" fontWeight="bold">
              XXXX XXXX XXXX {singleCustomerSources.card.last4}
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

  function chargetitle(row) {
    var desc = row.desc ? row.desc : "";

    return (
      desc +
      " Charge " +
      row.status.charAt(0).toUpperCase() +
      row.status.slice(1)
    );

    //row.amount_refunded>0?row.refunded==true?row.description+' Refunded':row.description+' Partial Refund':row.description+' '+row.status.charAt(0).toUpperCase()+ row.status.slice(1)
  }

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <AlertBox />
      {chargeSuccess ? (
        <AlertChargeSucceeded setisSuccess={setchargeSuccess} />
      ) : null}
      {isUnauthorized ? <AlertUnauthorized /> : null}
      {datanotFound ? (
        <AlertDataNotFound setisSuccess={setdatanotFound} />
      ) : null}
      <Flex direction={"column"} width={"100%"}>
        <Box>
          <Flex
            justify="space-between"
            align="center"
            minHeight="60px"
            w="100%"
          >
            {singlePayment ? (
              <Text fontSize="md" fontWeight="bold" textTransform="capitalize">
                {dataamount(singlePayment.amount) +
                  " " +
                  singlePayment.currency.toUpperCase() +
                  " " +
                  datadate(singlePayment.created)}
                {setStatus()}{" "}
                {singlePayment.status == "requires_confirmation" ? (
                  <Button
                    colorScheme="teal"
                    borderColor="primaryColor"
                    color="primaryColor"
                    variant="outline"
                    fontSize="xs"
                    p="8px 32px"
                    onClick={() => {
                      setpaymentbtnLoader(true);
                      attemptCharge();
                    }}
                    isLoading={paymentbtnLoader}
                    loadingText="Attempting Charge!"
                  >
                    Charge Payment
                  </Button>
                ) : (
                  ""
                )}
                {singlePayment && singleCharge.data.length > 0 ? (
                  singlePayment.status == "succeeded" &&
                  singleCharge.data[0].refunded !== true ? (
                    <RefundForm
                      bg={"primaryColor"}
                      payment={singlePayment}
                      setisReload={setisReload}
                      setReloadState={setReloadState}
                    />
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </Text>
            ) : (
              <SkeletonText mt="4" noOfLines={3} spacing="4" />
            )}
          </Flex>
        </Box>
      </Flex>

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
            <Card p="6px" display="flex" align="center" justify="center">
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
                      Amount
                    </Text>
                    <Text
                      mb="24px"
                      fontSize="xs"
                      color="gray.400"
                      fontWeight="semibold"
                    >
                      Full
                    </Text>
                    <Separator />
                  </Flex>
                  <Text fontSize="lg" color={textColor} fontWeight="bold">
                    {singlePayment ? (
                      `${dataamount(singlePayment.amount)}`
                    ) : (
                      <SkeletonText noOfLines={1}>Amount</SkeletonText>
                    )}
                  </Text>
                </Flex>
              </CardBody>
            </Card>

            <Card p="6px" display="flex" align="center" justify="center">
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

                  <Text fontSize="sm" color={"blue.500"} fontWeight="bold">
                    {SingleCustomerEmail ? (
                      <NavLink
                        color="blue.300"
                        to={"/admin/billing/" + singlePayment.customer}
                      >
                        {SingleCustomerEmail}
                      </NavLink>
                    ) : (
                      <Spinner color="red.500" />
                    )}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
            <Card p="6px" display="flex" align="center" justify="center">
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
                      Description
                    </Text>
                    <Text
                      mb="24px"
                      fontSize="xs"
                      color="gray.400"
                      fontWeight="semibold"
                      textTransform="capitalize"
                    >
                      Type: {singlePayment ? "Order Meta" : "Null"}
                    </Text>
                    <Separator />
                  </Flex>

                  <Text
                    fontSize="sm"
                    color={textColor}
                    fontWeight="bold"
                    wordBreak="break-all"
                  >
                    {singlePayment ? (
                      singlePayment.description
                    ) : (
                      <SkeletonText noOfLines={1}>Desc</SkeletonText>
                    )}
                  </Text>
                </Flex>
              </CardBody>
            </Card>
            <Card p="6px" display="flex" align="center" justify="center">
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
                      Statement
                    </Text>
                    <Text
                      mb="24px"
                      fontSize="xs"
                      color="gray.400"
                      fontWeight="semibold"
                      textTransform="capitalize"
                    >
                      Type: Descriptor
                    </Text>
                    <Separator />
                  </Flex>

                  <Text
                    fontSize="sm"
                    color={textColor}
                    fontWeight="bold"
                    wordBreak="break-all"
                  >
                    {singlePayment ? (
                      singlePayment.statement_descriptor
                    ) : (
                      <Skeleton noOfLines={1} />
                    )}
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
              </Flex>
            </CardHeader>
            {singlePayment ? (
              singlePayment.source !== null ? (
                <CardBody>
                  <Flex
                    direction={{ sm: "column", md: "row" }}
                    align="center"
                    w="50%"
                    justify="center"
                    py="1rem"
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
                              {singleCustomerSources ? (
                                singleCustomerSources.owner.name
                              ) : (
                                <Skeleton>OWNER NAME</Skeleton>
                              )}
                            </Text>
                            {/* <Text fontSize="md" fontWeight="bold">
                    {"Name"}
                  </Text> */}
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
                              {" "}
                              <Text
                                fontSize="xl"
                                letterSpacing="2px"
                                fontWeight="bold"
                              >
                                {singlePayment ? (
                                  <CardDetails />
                                ) : (
                                  <SkeletonText
                                    mt="4"
                                    noOfLines={4}
                                    spacing="4"
                                  />
                                )}
                              </Text>
                            </Box>
                            <Flex mt="14px">
                              <Flex direction="column" me="34px">
                                {singleCustomerSources ? (
                                  <Text fontSize="15px">
                                    {singleCustomerSources.card.brand}
                                  </Text>
                                ) : (
                                  <Skeleton>BRAND</Skeleton>
                                )}
                                <Text fontSize="xs" fontWeight="bold">
                                  {/* {singleCustomer
                          ? singleCustomer.sources.data[0].card.brand
                          : "VISA Card"} */}
                                </Text>
                              </Flex>
                              <Flex direction="column" me="34px">
                                {singleCustomerSources ? (
                                  <Text fontSize="15px">
                                    {singleCustomerSources.card.exp_month}/
                                    {singleCustomerSources.card.exp_year}
                                  </Text>
                                ) : (
                                  <Skeleton>VALID THRU</Skeleton>
                                )}
                                <Text fontSize="xs" fontWeight="bold">
                                  {/* {singleCustomer
                          ? `${singleCustomer.sources.data[0].card.exp_month}/${singleCustomer.sources.data[0].card.exp_year}`
                          : "00/00"} */}
                                </Text>
                              </Flex>
                              <Flex direction="column">
                                {singleCustomerSources ? (
                                  <Text fontSize="15px">
                                    {singleCustomerSources.card.cvc_check.toUpperCase()}
                                  </Text>
                                ) : (
                                  <Skeleton>CVV</Skeleton>
                                )}
                                <Text fontSize="xs" fontWeight="bold">
                                  {/* {singleCustomer
                          ? singleCustomer.sources.data[0].card.cvc_check
                          : "Unverified"} */}
                                </Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        </Flex>
                      </CardBody>
                    </Card>
                  </Flex>
                </CardBody>
              ) : (
                "No Payment Source Attached"
              )
            ) : (
              ""
            )}
          </Card>
        </Box>
        <Card
          p="22px"
          my={{ sm: "24px", lg: "0px" }}
          ms={{ sm: "0px", lg: "24px" }}
        >
          <CardHeader>
            <Flex justify="space-between" align="center" mb="1rem" w="100%">
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                Payment Details
              </Text>
              {/* <Button
                colorScheme="teal"
                borderColor="primaryColor"
                color="primaryColor"
                variant="outline"
                fontSize="xs"
                p="8px 32px"
              >
                VIEW ALL
              </Button> */}
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex direction="column" w="100%">
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                Amount Received:{" "}
              </Text>
              <Editable
                color={"green.500"}
                value={
                  singlePayment ? (
                    dataamount(singlePayment.amount_received)
                  ) : (
                    <SkeletonText noOfLines={1}>XX</SkeletonText>
                  )
                }
              >
                <EditablePreview />
                <EditableInput />
              </Editable>

              <Text fontSize="lg" color={textColor} fontWeight="bold">
                Refunded:{" "}
              </Text>
              <Editable
                color={"red.500"}
                value={
                  singleCharge.data.length > 0 ? (
                    singleCharge.data[0].refunded == true ||
                    singleCharge.data[0].amount_refunded > 0 ? (
                      dataamount(singleCharge.data[0].amount_refunded)
                    ) : (
                      dataamount(0)
                    )
                  ) : (
                    <SkeletonText noOfLines={1}>XX</SkeletonText>
                  )
                }
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                Status:
              </Text>
              {/* {singleCharge.data.length>0?singleCharge.data[0].refunded==true?<Text fontSize="lg" color={'red.500'} fontWeight="bold">Refunded</Text>:toStatus(singleCharge.data[0].status):<SkeletonText noOfLines={1}>Status</SkeletonText>} */}
              {singlePayment ? (
                setStatus()
              ) : (
                <SkeletonText noOfLines={1}>Status</SkeletonText>
              )}

              <Text fontSize="lg" color={textColor} fontWeight="bold">
                Date:
              </Text>
              {/* {singleCharge.data.length>0?singleCharge.data[0].refunded==true?<Text fontSize="lg" color={'red.500'} fontWeight="bold">Refunded</Text>:toStatus(singleCharge.data[0].status):<SkeletonText noOfLines={1}>Status</SkeletonText>} */}
              {singlePayment ? (
                datadate(singlePayment.created)
              ) : (
                <SkeletonText noOfLines={1}>Date</SkeletonText>
              )}
              {/* {invoicesData.map((row, index) => {
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
              })} */}
            </Flex>
          </CardBody>
        </Card>
      </Grid>

      {/* Billing Details*/}
      <Grid templateColumns={{ sm: "1fr", lg: "1.6fr 1.2fr" }}>
        <Card my={{ lg: "24px" }} me={{ lg: "24px" }}>
          {singleCustomerSources ? (
            <Flex direction="column">
              <CardHeader py="12px">
                <Text color={textColor} fontSize="lg" fontWeight="bold">
                  Payment Owner Details
                </Text>
              </CardHeader>
              <CardBody>
                <Flex direction="column" w="100%">
                  {singleCustomerSources ? (
                    <Flex p={7} bg="whiteAlpha.500" borderRadius={10}>
                      {/* <Heading as="h6" fontSize={18} color="gray.500">
                                {singleCustomerSources.owner.name}
                              </Heading> */}
                      <PaymentBillingRow
                        name={singleCustomerSources.owner.name}
                        address={singleCustomerSources.owner.address}
                        email={singleCustomerSources.owner.email}
                        number={singleCustomerSources.owner.phone}
                      />{" "}
                    </Flex>
                  ) : (
                    <SkeletonText noOfLines={9}></SkeletonText>
                  )}
                </Flex>
              </CardBody>
            </Flex>
          ) : (
            ""
          )}

          {singleCharge.data.length > 0 ? (
            <Flex direction="column">
              <CardHeader py="12px">
                <Text color={textColor} fontSize="lg" fontWeight="bold">
                  Charge Details
                </Text>
              </CardHeader>
              <CardBody>
                <Flex direction="column" w="100%">
                  {singleCharge.data.length > 0 ? (
                    <Flex p={7} bg="whiteAlpha.500" borderRadius={10}>
                      {/* <Heading as="h6" fontSize={18} color="gray.500">
                                {singleCustomerSources.owner.name}
                              </Heading> */}
                      <PaymentBillingRow
                        name={singleCharge.data[0].billing_details.name}
                        address={singleCharge.data[0].billing_details.address}
                        email={singleCharge.data[0].billing_details.email}
                        number={singleCharge.data[0].billing_details.phone}
                      />{" "}
                    </Flex>
                  ) : (
                    <SkeletonText noOfLines={9}></SkeletonText>
                  )}
                </Flex>
              </CardBody>
            </Flex>
          ) : (
            ""
          )}

          {SinglePaymentMeta !== null ? (
            <Flex direction="column">
              <CardHeader py="12px">
                <Text color={textColor} fontSize="lg" fontWeight="bold">
                  Payment Meta
                </Text>
              </CardHeader>
              <CardBody>
                <Flex direction="column" w="100%">
                  {Object.keys(SinglePaymentMeta).length > 0 ? (
                    <Flex p={7} bg="whiteAlpha.500" borderRadius={10}>
                      <ProductList />
                    </Flex>
                  ) : (
                    "No metadata present."
                  )}
                </Flex>
              </CardBody>
            </Flex>
          ) : (
            <SkeletonText noOfLines={9}></SkeletonText>
          )}
        </Card>
        {singleCharge.data.length > 0 ? (
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
                    Charges history
                  </Text>
                  {/* <Flex align="center">
                  <Icon
                    as={FaRegCalendarAlt}
                    color="gray.400"
                    fontSize="md"
                    me="6px"
                  ></Icon>
                  <Text color="gray.400" fontSize="sm" fontWeight="semibold">
                    23 - 30 March 2021
                  </Text>
                </Flex> */}
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody>
              <Flex direction="column" w="100%">
                {/* <Text
                color="gray.400"
                fontSize={{ sm: "sm", md: "md" }}
                fontWeight="semibold"
                my="12px"
              >
                NEWEST
              </Text> */}
                {singleCharge.data.length > 0 ? (
                  singleCharge.data.map((row, index) => {
                    return (
                      <TransactionRow
                        key={index}
                        name={chargetitle(row)}
                        // logo={row.logo}
                        date={datadate(row.created)}
                        price={dataamount(row.amount_captured)}
                        refund={
                          row.refunds.data.length > 0
                            ? row.refunds
                            : { data: [] }
                        }
                      />
                    );
                  })
                ) : (
                  <SkeletonText noOfLines={5}></SkeletonText>
                )}

                {/* {singleCharge.data.refunds.data.length>0?singleCharge.data.refunds.data.map((row, index) => {
                return (
                  <TransactionRow
                    key={index}
                    name={row.status.charAt(0).toUpperCase()+row.status.slice(-1)}
                    // logo={row.logo}
                    date={datadate(row.created)}
                    price={dataamount(row.amount)}
                    
                  />
                );
              }):<SkeletonText noOfLines={5}></SkeletonText>} */}
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
                  <TransactionRow
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
    </Flex>
  );
}

export default Detail;
