import {
  Avatar,
  AvatarGroup,
  Flex,
  Icon,
  Progress,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import PropTypes from "prop-types";

function DashboardTableRow(props) {
  const { logo, name, members, budget, progression, id, index } = props;
  
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Tr key={index+id} class={"asdas"}>
      <Td minWidth={{ sm: "250px" }} pl="0px" key={index+id+logo}>
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Icon as={logo} h={"24px"} w={"24px"} pe="5px" />
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
          >
            {name}
          </Text>
        </Flex>
      </Td>

      <Td key={index+id+members[0]}>
        <AvatarGroup size="sm">
          {members.map((member) => {
            return (
              <Avatar
                name="Ryan Florence"
                src={member}
                _hover={{ zIndex: "3", cursor: "pointer" }}
              />
            );
          })}
        </AvatarGroup>
      </Td>
      <Td key={index+id+budget}>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {budget}
        </Text>
      </Td>
      <Td key={index+id+progression}>
        <Flex direction="column">
          <Text
            fontSize="md"
            color="teal.300"
            fontWeight="bold"
            pb=".2rem"
          >{`${progression}%`}</Text>
          <Progress
            colorScheme={progression === 100 ? "teal" : "cyan"}
            size="xs"
            value={progression}
            borderRadius="15px"
          />
        </Flex>
      </Td>
    </Tr>
  );
}
// DashboardTableRow.propTypes = {
//   key: PropTypes
// };
export default DashboardTableRow;
