import {
  Avatar,
  Badge,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Th,
  TableCaption,
  TableContainer,
  Td,
  Tr,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
  Box,
  Stack,
  Tooltip,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Select,
} from "@chakra-ui/react";
import { InfoIcon, DeleteIcon } from "@chakra-ui/icons";
import React, { useRef, useEffect, useState } from "react";
import { editUsersRole, deleteUsers } from "api/ApiListing";

const UsersTable = (props) => {
  const {
    srno,
    userid,
    name,
    status,
    email,
    date,
    role,
    setReloadHandler,
  } = props;
  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.200", "#1a202c");
  const bgStatusVerified = useColorModeValue("green.400", "#1a202c");
  const bgStatusNotVerified = useColorModeValue("red.400", "#1a202c");
  const bgStatusRunning = useColorModeValue("orange.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    
  }, []);

  return (
    <Tr payment-data={userid}>
      <Td>
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Text>{srno}</Text>
        </Flex>
      </Td>

      <Td>
        <Text fontSize="sm" color={textColor} fontWeight="bold" pb=".5rem">
          {name}
        </Text>
      </Td>

      <Td>
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Text
            fontSize="sm"
            color="black.400"
            fontWeight="600"
            textTransform="lowercase"
          >
            {email}
          </Text>
        </Flex>
      </Td>

      <Td>
        <Text
          fontSize="sm"
          color={textColor}
          fontWeight="bold"
          pb=".5rem"
          whiteSpace={"nowrap"}
          id="userRole"
        >
          {role}
        </Text>
      </Td>

      <Td>
        <ChangeUserRoleDialog
          userid={userid}
          name={name}
          email={email}
          status={status}
          bgStatus={bgStatus}
          bgStatusVerified={bgStatusVerified}
          bgStatusNotVerified={bgStatusNotVerified}
          bgStatusRunning={bgStatusRunning}
          colorStatus={colorStatus}
          toast={toast}
          setReloadHandler={setReloadHandler}
          role={role}
        />
      </Td>

      <Td>
        <Badge
          w={"100%"}
          bg={status !== "Not Verfied" ? bgStatusVerified : bgStatusNotVerified}
          color={colorStatus}
          fontSize="16px"
          p="3px 10px"
          textAlign="center"
        >
          {status}
        </Badge>
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

      <Td textAlign="center">
        <DeleteJob
          userid={userid}
          name={name}
          email={email}
          status={status}
          bgStatus={bgStatus}
          bgStatusVerified={bgStatusVerified}
          bgStatusNotVerified={bgStatusNotVerified}
          bgStatusRunning={bgStatusRunning}
          colorStatus={colorStatus}
          toast={toast}
          setReloadHandler={setReloadHandler}
        />
      </Td>
    </Tr>
  );
};

export default UsersTable;

const ChangeUserRoleDialog = (jobObj) => {
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  let userRole = document.getElementById("userRole");
  const [roleReq, setRole] = useState("");
  const [isRoleSelected, setRoleSelected] = useState(false);
  

  const handleRole = () => {
    editUsersRole(jobObj.email, roleReq)
      .then((res) => {
        if (res !== undefined && res.status === 200) {
          jobObj.toast({
            title: "User Role Changed!",
            description: "",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          return jobObj.setReloadHandler(true);
        } else {
          
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          jobObj.toast({
            title: "Email or Role is missing!",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
          return jobObj.setReloadHandler(true);
        } else {
          jobObj.toast({
            title: "Can't change the user role!",
            description: "Contact to administrator",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        }
      });
    onClose();
    setRoleSelected(false);
  };

  const handleUserRole = (e) => {
    setRole(e.target.value);
    setRoleSelected(true);
    let currentRole = e.target.value;
  };

  return (
    <>
      <Button
        id="triggerChange"
        onClick={onOpen}
        bg="white"
        color="red.500"
        _hover={{ bg: "gray.100" }}
      >
        Change Role
      </Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Change User Role</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to change this User's role?
            <Select onChange={handleUserRole} defaultValue="DEFAULT" mb={5}>
              <option disabled value="DEFAULT">
                Change role to: {roleReq}
              </option>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </Select>
            <Text mt={1}>
              <i>Following details for current user</i>
            </Text>
            <Text>
              *Current Role: <strong>{jobObj.role}</strong>
            </Text>
            <Text>
              *Requested Role for:
              <Badge
                fontSize="16px"
                p="0px 10px"
                color="white"
                bg={roleReq ? "gray.400" : "orange.400"}
              >
                {roleReq ? roleReq : "Please select a role"}
              </Badge>
            </Text>
            <Text>
              *User Name: <strong>{jobObj.name}</strong>
            </Text>
            <Text>
              *Email: <strong>{jobObj.email}</strong>
            </Text>
            <Text>
              *Status:
              <Badge
                bg={
                  jobObj.status !== "Not Verfied"
                    ? jobObj.bgStatusVerified
                    : jobObj.bgStatusNotVerified
                }
                color={jobObj.colorStatus}
                fontSize="16px"
                p="0px 10px"
                textAlign="center"
              >
                {jobObj.status}
              </Badge>
            </Text>
          </AlertDialogBody>
          {isRoleSelected ? (
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setRoleSelected(false);
                  setRole("");
                  onClose();
                }}
              >
                No
              </Button>
              <Button colorScheme="red" ml={3} onClick={handleRole}>
                Yes
              </Button>
            </AlertDialogFooter>
          ) : (
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                bg="black"
                color="white"
                _hover={{ bg: "gray.600" }}
                onClick={() => {
                  setRoleSelected(false);
                  setRole("");
                  onClose();
                }}
              >
                Close
              </Button>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const DeleteJob = (jobObj) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleDelete = () => {
    deleteUsers(jobObj.email, jobObj.userid)
      .then((res) => {
        if (res.status === 200) {
          jobObj.toast({
            title: "User deleted successfully!",
            description: "You've deleted the User",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          return jobObj.setReloadHandler(true);
        } else {
          
        }
      })
      .catch((err) =>
        err
          ? jobObj.toast({
              title: "Getting Error!",
              description: "Error while deleteing this user",
              status: "error",
              duration: 5000,
              isClosable: true,
            }) 
          : null
      );
    onClose();
  };

  return (
    <>
      <Button
        onClick={onOpen}
        bg="white"
        color="red.500"
        _hover={{ bg: "gray.100" }}
      >
        <DeleteIcon />
      </Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete this User?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this User it won't be recover?
            <br />
            <Text mt={1}>
              <i>Following details for current user</i>
            </Text>
            <Text>
              *User Name: <strong>{jobObj.name}</strong>
            </Text>
            <Text>
              *Email: <strong>{jobObj.email}</strong>
            </Text>
            <Text>
              *Status:
              <Badge
                bg={
                  jobObj.status !== "Not Verfied"
                    ? jobObj.bgStatusVerified
                    : jobObj.bgStatusNotVerified
                }
                color={jobObj.colorStatus}
                fontSize="16px"
                p="0px 10px"
                textAlign="center"
              >
                {jobObj.status}
              </Badge>
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
