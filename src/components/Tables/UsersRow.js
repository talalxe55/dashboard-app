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
  CheckboxGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { getBulkPayments } from "api/ApiListing";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { NavLink, Route, Link } from "react-router-dom";
import Payment from "../../views/Dashboard/SinglePayment";

const UsersRow = (props) => {
  const { name, status, email, desc, date, role, userid } = props;
  const [runJob, setRunJob] = useState();
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.200", "#1a202c");
  const bgStatusVerified = useColorModeValue("green.400", "#1a202c");
  const bgStatusNotVerified = useColorModeValue("red.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");

  useEffect(() => {
    getBulkPayments()
      .then((res) => (res ? console.log(res.data) : console.log(res)))
      .catch((err) => console.log(err));
  }, []);

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
      {/* <Td minWidth={{ sm: "100px" }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
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
      </Td> */}

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

      {/* <Td>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {domain}
          </Text>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {status}
          </Text>
        </Flex>
      </Td> */}

      {/* <Td>
        <Text
          fontSize="sm"
          color="gray.400"
          fontWeight="normal"
          textTransform={"lowercase"}
        >
          {role}
        </Text>
      </Td> */}
      <Td>
        <Badge
          w={"100%"}
          bg={status === "uploaded" ? bgStatusNotVerified : bgStatusVerified}
          color={colorStatus}
          fontSize="16px"
          p="3px 10px"
          borderRadius="3px"
          textAlign="center"
        >
          {status}
        </Badge>
      </Td>
      <Td>
        <Text fontSize="sm" color={textColor} fontWeight="bold" pb=".5rem">
          {desc}
        </Text>
      </Td>
      <Td>
        <Text
          fontSize="sm"
          color={textColor}
          fontWeight="bold"
          pb=".5rem"
          whiteSpace={"nowrap"}
        >
          {date}
        </Text>
      </Td>
      <Td>
        {status === "uploaded" ? (
          <NavLink
            to={`bulk-payments/${
              status === "uploaded" ? "run" : "log"
            }/${userid}`}
          >
            <Button
              p="0 20px"
              bg={"gray.800"}
              borderRadius={2}
              _hover={{ bg: "teal.300" }}
              w="100%"
              fontSize="md"
              fontWeight="400"
              cursor="pointer"
              color={"#fff"}
            >
              Run Log
            </Button>
          </NavLink>
        ) : (
          <LogModal />
        )}
      </Td>
    </Tr>
  );
};

export default UsersRow;

const LogModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        p="0 20px"
        bg={"gray.600"}
        borderRadius={2}
        _hover={{ bg: "teal.300" }}
        w="100%"
        fontSize="md"
        fontWeight="400"
        cursor="pointer"
        color={"#fff"}
        onClick={onOpen}
      >
        View Log
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Amet commodo id dolore velit ullamco in esse occaecat sint.
              Nostrud officia aute officia in. Sit cupidatat pariatur aliqua
              mollit ipsum ut magna ut Lorem quis nostrud commodo do eu. Ea
              ipsum tempor do cupidatat excepteur ullamco officia esse officia
              consectetur ipsum id ullamco sunt. Anim do Lorem voluptate eu
              laborum velit.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
