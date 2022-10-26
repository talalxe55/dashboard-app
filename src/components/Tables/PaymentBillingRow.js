import {
    Box,
    Button,
    Flex,
    Icon,
    Text,
    useColorModeValue,
  } from "@chakra-ui/react";
  import React from "react";
  import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
  
  function PaymentBillingRow(props) {
    const textColor = useColorModeValue("gray.700", "white");
    const bgColor = useColorModeValue("#F8F9FA", "gray.800");
    const nameColor = useColorModeValue("gray.500", "white");
    const { name, address, email, number } = props;
  
    return (
      <Box p="0px" bg={bgColor} my="22px" borderRadius="12px">
        <Flex justify="space-between" w="100%">
          <Flex direction="column" maxWidth="100%">
            <Text color={nameColor} fontSize="md" fontWeight="bold" mb="10px">
              {name}
            </Text>
            <Text color="gray.400" fontSize="sm" fontWeight="semibold">
              Address:{" "}
              <Text as="span" color="gray.500">
              {address.line1+', '+address.line2}
              </Text>
              <Text as="span" color="gray.500">
              {', '+ address.city+', '+address.state+', '+address.country+', '+address.postal_code}
              </Text>
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
                {number}
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
    );
  }
  
  export default PaymentBillingRow;
  