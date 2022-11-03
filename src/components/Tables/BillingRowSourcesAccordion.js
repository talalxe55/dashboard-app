import {
    Box,
    Button,
    Flex,
    Icon,
    Text,
    useColorModeValue,
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionIcon,
    AccordionPanel,
    Spacer,
  } from "@chakra-ui/react";
  import React from "react";
  import { VisaIcon } from "components/Icons/Icons";
  import { MastercardIcon } from "components/Icons/Icons";
  import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
  import IconBox from "components/Icons/IconBox";
  import { PhoneIcon, AddIcon, WarningIcon, InfoIcon } from "@chakra-ui/icons";
  import { BsFillCreditCard2FrontFill, BsBank2 } from "react-icons/bs";
  
  function BillingRowSources(props) {
    const textColor = useColorModeValue("gray.700", "white");
    const bgColor = useColorModeValue("#F8F9FA", "gray.800");
    const nameColor = useColorModeValue("gray.500", "white");
    const borderColor = useColorModeValue("#dee2e6", "gray.500");
    const {
      name,
      email,
      phone,
      city,
      country,
      line1,
      line2,
      postal_code,
      state,
      brand,
      last4,
      type,
      value
    } = props;
  
    return (

<Accordion allowToggle>
<AccordionItem>
  <h2>
    <AccordionButton>
      <Box flex="1" textAlign="left">
       { type=="card"?<Flex
                            direction={{ sm: "column", md: "row" }}
                            align="center"
                            w="100%"
                            justify="center"
                            py="1rem"
                          >

                              <IconBox me="10px" w="25px" h="22px">
                                {brand ? (
                                  brand === "Visa" ? (
                                    <VisaIcon w="100%" h="100%" />
                                  ) : brand === "MasterCard" ? (
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
                                {"XXXX XXXX XXXX " + last4}
                              </Text>
                              <Spacer />
                              <Button
                                p="0px"
                                bg="transparent"
                                w="16px"
                                h="16px"
                                variant="no-hover"
                              >
                            
                              </Button>
                            
                          </Flex>:type=="ach_credit_transfer"?
                          <Flex
                            direction={{ sm: "column", md: "row" }}
                            align="center"
                            w="100%"
                            justify="center"
                            py="1rem"
                          >
                              <IconBox me="10px" w="25px" h="22px">
                                <BsBank2 />
                              </IconBox>
                              <Text
                                color="gray.400"
                                fontSize="md"
                                fontWeight="semibold"
                              >
                                {/* {val.ach_credit_transfer.bank_name} */}
                                {value.ach_credit_transfer.account_number}
                              </Text>
                              <Spacer />
                              <Button
                                p="0px"
                                bg="transparent"
                                w="16px"
                                h="16px"
                                variant="no-hover"
                              >
                              </Button>
                            
                          </Flex>:""}
      </Box>
      <AccordionIcon />
    </AccordionButton>
  </h2>
  <AccordionPanel pb={4}>
  <Box p="24px" bg={bgColor} my="" borderRadius="12px">
        <Flex justify="space-between" w="100%">
          <Flex direction="column" maxWidth="70%">
            <Text
              color={nameColor}
              fontSize="md"
              fontWeight="bold"
              mb="10px"
              textTransform="capitalize"
            >
              {name}
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="semibold">
              Email Address:{" "}
              <Text as="span" color="gray.500">
                {email}
              </Text>
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="semibold">
              Phone Number:{" "}
              <Text as="span" color="gray.500">
                {phone}
              </Text>
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="semibold">
              Country:{" "}
              <Text as="span" color="gray.500">
                {country}
              </Text>
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="semibold">
              State:{" "}
              <Text as="span" color="gray.500">
                {state}
              </Text>
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="semibold">
              City:{" "}
              <Text as="span" color="gray.500">
                {city}
              </Text>
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="semibold">
              Address 1:{" "}
              <Text as="span" color="gray.500">
                {line1}
              </Text>
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="semibold">
              Address 2:{" "}
              <Text as="span" color="gray.500">
                {line2}
              </Text>
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="semibold">
              Postal Code:{" "}
              <Text as="span" color="gray.500">
                {postal_code}
              </Text>
            </Text>
          </Flex>
          {/* <Flex
            direction={{ sm: "column", md: "row" }}
            align="flex-start"
            p={{ md: "24px" }}
          >
            <Button
              p="0px"
              bg="transparent"
              mb={{ sm: "10px", md: "0px" }}
              me={{ md: "12px" }}
            >
              <Flex color="red.500" cursor="pointer" align="center" p="12px">
                <Icon as={FaTrashAlt} me="4px" />
                <Text fontSize="sm" fontWeight="semibold">
                  DELETE
                </Text>
              </Flex>
            </Button>
            <Button p="0px" bg="transparent">
              <Flex color={textColor} cursor="pointer" align="center" p="12px">
                <Icon as={FaPencilAlt} me="4px" />
                <Text fontSize="sm" fontWeight="semibold">
                  EDIT
                </Text>
              </Flex>
            </Button>
          </Flex> */}
        </Flex>
      </Box>
  </AccordionPanel>
</AccordionItem>
</Accordion>
    );
  }
  
  export default BillingRowSources;
  