import {
    Avatar,
    Badge,
    Button,
    Flex,
    Td,
    Text,
    Tr,
    useColorModeValue,
    Checkbox,
    CheckboxGroup
  } from "@chakra-ui/react";
  import React from "react";
  import { NavLink, Route, Link } from "react-router-dom";
  import Payment from '../../views/Dashboard/SinglePayment';

  
  function UsersRow(props) {
    const { name, status, email, date, role, userid } = props;
    const textColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "#1a202c");
    const colorStatus = useColorModeValue("white", "gray.400");


    return (
      <Tr payment-data={userid}>

        <Td minWidth={{ sm: "100px" }} pl="0px">
          <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
            {/* <Avatar src={logo} w="50px" borderRadius="12px" me="18px" /> */}
            <Flex direction="column">
            <Checkbox outline="1px solid #ccc"></Checkbox>
            </Flex>
          </Flex>
        </Td>
        <Td minWidth={{ sm: "100px" }} pl="0px">
          <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
            {/* <Avatar src={logo} w="50px" borderRadius="12px" me="18px" /> */}
            <Flex direction="column">
              <Text
                fontSize="md"
                color={textColor}
                fontWeight="bold"
                minWidth="100%"
              >
                {name}
              </Text>
            </Flex>
          </Flex>
        </Td>

        <Td minWidth={{ sm: "100px" }} pl="0px">
          <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
            {/* <Avatar src={logo} w="50px" borderRadius="12px" me="18px" /> */}
            {/* {status==="Succeeded"? <Flex direction="column">
        <Text
          fontSize="sm"
          color="green.400"
          fontWeight="600"
        >
          {status}
        </Text>
      </Flex> : <Flex direction="column">
        <Text
          fontSize="sm"
          color="black.400"
          fontWeight="600"
        >
          {status}
        </Text>
      </Flex>} */}
              
       
        <Text
          fontSize="sm"
          color="black.400"
          fontWeight="600"
          textTransform={"lowercase"}
        >
          {email}
        </Text>
      
          </Flex>
        </Td>
  
        <Td>
          <Flex direction="column">
            {/* <Text fontSize="md" color={textColor} fontWeight="bold">
              {domain}
            </Text> */}
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              {status}
            </Text>
          </Flex>
        </Td>
        <Td>
          {/* <Badge
            bg={status === "VISA" ? "blue.400" : bgStatus}
            color={status === "VISA" ? "white" : colorStatus}
            fontSize="16px"
            p="3px 10px"
            borderRadius="8px"
            textAlign={"center"}
          >
            {customer}
          </Badge> */}
          <Text fontSize="sm" color="gray.400" fontWeight="normal" textTransform={"lowercase"}>
              {role}
            </Text>
        </Td>
        <Td>
          <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
            {date}
          </Text>
        </Td>
        {/* <Td>
            
          <NavLink  to={"/admin/detail/"+viewprofile}>
            <Button p="0px" bg="transparent" variant="no-hover">
              <Text
                fontSize="md"
                fontWeight="bold"
                cursor="pointer"
                color={"teal.300"}
              >
                View Payment
              </Text>
            </Button>
          </NavLink>
          
 
        </Td> */}
      </Tr>
    );
  }
  
  export default UsersRow;
  