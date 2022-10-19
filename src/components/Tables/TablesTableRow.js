import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

function TablesTableRow(props) {
  const {
    logo,
    name,
    email,
    desc,
    domain,
    status,
    date,
    viewprofile,
    cusid,
  } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");

  return (
    <Tr customer-data={cusid}>
      <Td minWidth={{ sm: "250px" }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Avatar src={logo} w="50px" borderRadius="12px" me="18px" />
          <Flex direction="column">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {name}
            </Text>
            <Text
              fontSize="sm"
              textTransform={"lowercase"}
              color="gray.400"
              fontWeight="normal"
            >
              {email}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {domain}
          </Text>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {desc}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Badge
          bg={status === "VISA" ? "blue.400" : bgStatus}
          color={status === "VISA" ? "white" : colorStatus}
          fontSize="16px"
          p="3px 10px"
          borderRadius="8px"
          textAlign={"center"}
        >
          {status}
        </Badge>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {date}
        </Text>
      </Td>
      <Td>
        <NavLink to={"billing/" + viewprofile}>
          <Button p="0px" bg="transparent" variant="no-hover">
            <Text
              fontSize="md"
              color="gray.400"
              fontWeight="bold"
              cursor="pointer"
            >
              View Profile
            </Text>
          </Button>
        </NavLink>
      </Td>
    </Tr>
  );
}

export default TablesTableRow;
