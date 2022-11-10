import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBell,
  FaCreditCard,
  FaFilePdf,
  FaHtml5,
  FaShoppingCart,
} from "react-icons/fa";

function TransactionRow(props) {
  const textColor = useColorModeValue("gray.700", "white");
  const iconTeal = useColorModeValue("primaryColor", "primaryColor");
  const { name, date, logo, price, refund } = props;
  const datadate = (created) => {
    let epochDate = created;
    var formatedDateTime = new Date(epochDate * 1000);

    formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDateTime;
  };
  const dataamount = (amount) => {
    let cents = amount;
    var formatedDollars = (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    //formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDollars;
  };
  return (
    <>
      <Flex my="1rem" justifyContent="space-between">
        <Flex alignItems="center">
          <Box
            me="12px"
            borderRadius="50%"
            color={
              price[0] === "+"
                ? "green.400"
                : price[0] === "-"
                ? "red.400"
                : "gray.400"
            }
            border="1px solid"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="35px"
            h="35px"
          >
            <Icon as={FaArrowUp} />
          </Box>
          <Flex direction="column">
            <Text
              fontSize={{ sm: "md", md: "lg", lg: "md" }}
              color={"green.300"}
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

      {refund.data.length > 0
        ? refund.data.map((row, index) => {
            return (
              <Flex
                my="1rem"
                justifyContent="space-between"
                style={{ transform: "scale(0.9)" }}
              >
                <Flex alignItems="center">
                  <Box
                    me="12px"
                    borderRadius="50%"
                    color={
                      price[0] === "+"
                        ? "green.400"
                        : price[0] === "-"
                        ? "red.400"
                        : "gray.400"
                    }
                    border="1px solid"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="35px"
                    h="35px"
                  >
                    <Icon as={FaArrowDown} />
                  </Box>
                  <Flex direction="column">
                    <Text
                      fontSize={{ sm: "md", md: "sm", lg: "sm" }}
                      color={iconTeal}
                      fontWeight="bold"
                      textTransform={"capitalize"}
                    >
                      Refund {row.status}
                    </Text>
                    <Text
                      fontSize={{ sm: "xs", md: "xs", lg: "xs" }}
                      color="gray.400"
                      fontWeight="semibold"
                    >
                      {datadate(row.created)}
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
                  <Text
                    fontSize={{ sm: "md", md: "lg", lg: "md" }}
                    fontWeight="bold"
                  >
                    {dataamount(row.amount)}
                  </Text>
                </Box>
              </Flex>
            );
          })
        : ""}

      {/* Small one */}
    </>
  );
}

export default TransactionRow;
