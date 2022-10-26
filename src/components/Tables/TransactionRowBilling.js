import React from "react";
import { FaArrowDown, FaArrowUp, FaExclamationTriangle } from "react-icons/fa";
import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";

function TransactionRowBilling(props) {
  const textColor = useColorModeValue("gray.700", "white");
  const textRed = useColorModeValue("red.400", "white");
  const textGreen = useColorModeValue("green.400", "white");

  const { name, date, logo, price, status, charges } = props;

  // function StatusIcon() {
  //   if (status == "succeeded" && charges.data.length > 0) {
  //     if (charges.data[0].refunded === true) {
  //       return <FaArrowUp />;
  //     } else if (charges.data[0].amount_refunded > 0) {
  //       return <FaArrowUp />;
  //     }
  //   } else if (
  //     status == "requires_payment_method" &&
  //     charges.data.length > 0 &&
  //     charges.data[0].status === "failed"
  //   ) {
  //     return <FaArrowDown />;
  //   } else {
  //     return <FaArrowDown />;
  //   }
  // }
  return (
    <Flex my="1rem" justifyContent="space-between">
      <Flex alignItems="center">
        {logo ? (
          <Box
            me="12px"
            borderRadius="50%"
            // color={
            //   price[0] === "+"
            //     ? "green.400"
            //     : price[0] === "-"
            //     ? "red.400"
            //     : "green.400"
            // }
            color={
              status === "succeeded" && charges.data.length > 0
                ? charges.data[0].refunded === true
                  ? "red.400"
                  : charges.data[0].amount_refunded > 0
                  ? "red.400"
                  : charges.data[0].status === "failed"
                  ? "red.700"
                  : "green.400"
                : "gray.600"
            }
            border="1px solid"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="35px"
            h="35px"
          >
            {status === "succeeded" && charges.data.length > 0 ? (
              charges.data[0].refunded === true ? (
                <FaArrowDown />
              ) : charges.data[0].amount_refunded > 0 ? (
                <FaExclamationTriangle />
              ) : charges.data[0].status === "failed" ? (
                <FaArrowDown />
              ) : (
                <FaArrowUp />
              )
            ) : (
              <FaExclamationTriangle />
            )}
          </Box>
        ) : (
          <Icon as={logo} />
        )}
        <Flex direction="column" textTransform={"capitalize"}>
          <Text
            fontSize={{ sm: "sm", md: "sm", lg: "sm" }}
            color={
              status === "succeeded" && charges.data.length > 0
                ? charges.data[0].refunded === true
                  ? textRed
                  : charges.data[0].amount_refunded > 0
                  ? textRed
                  : charges.data[0].status === "failed"
                  ? textRed
                  : textGreen
                : textColor
            }
            fontWeight="bold"
          >
            {status === "succeeded"
              ? charges.data.length > 0
                ? charges.data[0].refunded === true
                  ? "Refunded"
                  : charges.data[0].amount_refunded > 0
                  ? "Partial Refund"
                  : charges.data[0].status
                : status
              : status.replaceAll("_", " ")}
          </Text>
          <Text
            fontSize={{ sm: "md", md: "lg", lg: "md" }}
            color={textColor}
            fontWeight="bold"
          >
            {name}
          </Text>

          <Text
            fontSize={{ sm: "xs", md: "sm", lg: "xs" }}
            color="gray.400"
            fontWeight="semibold"
          >
            {date}
          </Text>
        </Flex>
      </Flex>
      <Box
        color={
          price[0] === "+"
            ? "green.400"
            : price[0] === "-"
            ? "red.400"
            : { textColor }
        }
      >
        <Text fontSize={{ sm: "md", md: "lg", lg: "md" }} fontWeight="bold">
          {price}
        </Text>
      </Box>
    </Flex>
  );
}

export default TransactionRowBilling;
