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
} from "@chakra-ui/react";
import { InfoIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import {
  API_SERVER,
  TOKEN_TYPE,
  TOKEN,
  ACCEPT_TYPE,
} from "../../config/constant";
import { runJobPaymentID, deleteJobPaymentID } from "api/ApiListing";

const UsersRow = (props) => {
  const { status, email, desc, date, userid, setReloadHandler } = props;
  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.200", "#1a202c");
  const bgStatusVerified = useColorModeValue("green.400", "#1a202c");
  const bgStatusNotVerified = useColorModeValue("red.400", "#1a202c");
  const bgStatusRunning = useColorModeValue("orange.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(userid);
  }, []);
  const handleRunLog = () => {
    setLoading(true);
    runJobPaymentID(userid)
      .then((res) => {
        if (res !== undefined && res.status === 200) {
          toast({
            title: "Compeleted",
            description: "The Job has been run successfully!",
            status: "success",
            duration: 9000,
            isClosable: true,
          }) &&
            setLoading(false) &&
            console.log(res);
          return setReloadHandler(true);
        } else {
          setLoading(false) && console.log(res);
        }
      })
      .catch((err) =>
        err
          ? toast({
              title: "Getting Error! Try again!",
              description: "Error while running log",
              status: "error",
              duration: 9000,
              isClosable: true,
            }) &&
            setLoading(false) &&
            console.log(err)
          : setLoading(false) && console.log(err)
      );
    // alert(userid);
  };

  return (
    <Tr payment-data={userid}>
      <Td>
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          {/* <Checkbox outline="1px solid #ccc"></Checkbox> */}
          <Text>{userid}</Text>
        </Flex>
      </Td>

      <Td>
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
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
        <Badge
          w={"100%"}
          bg={
            status === "uploaded"
              ? bgStatusNotVerified
              : status === "running"
              ? bgStatusRunning
              : bgStatusVerified
          }
          color={colorStatus}
          fontSize="16px"
          p="3px 10px"
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
          <Button
            p="0 20px"
            bg={"teal.300"}
            _hover={{ opacity: "0.9" }}
            w="100%"
            fontSize="md"
            fontWeight="400"
            cursor="pointer"
            color={"white"}
            onClick={handleRunLog}
            isLoading={isLoading}
          >
            Run Log
          </Button>
        ) : status === "running" ? (
          <Box textAlign="center">
            <Tooltip
              hasArrow
              label="Wait until compelte log is run"
              bg="#000"
              color="white"
            >
              <InfoIcon />
            </Tooltip>
          </Box>
        ) : (
          <LogModal userid={userid} />
        )}
      </Td>

      <Td textAlign="center">
        <DeleteJob
          userid={userid}
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

export default UsersRow;

const LogModal = (jobObj) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [getJobData, setJobData] = useState(null);
  const [sumVal, setSumVal] = useState(0);
  const [userID, setUserID] = useState(0);
  // console.log(jobObj);

  const logJobPayment = async () => {
    try {
      const res = await axios.get(`${API_SERVER}bulk-payments/log/${userID}`, {
        headers: {
          Authorization: `${TOKEN_TYPE} ${TOKEN}`,
          Accept: `${ACCEPT_TYPE}`,
          "Content-Type": `${ACCEPT_TYPE}`,
        },
      });
      let data = res.data.data;

      setJobData(data);
      console.log(res.data.data);
    } catch (err) {
      if (err.response.status === 404) {
        console.log("Resource could not be found!");
      } else if (err.response.status === 401) {
        console.log("Unauthorized!");
      } else {
        console.log(err.message);
      }
    }
  };

  const handleLog = () => {
    onOpen();
    logJobPayment();
  };

  // Converting date
  const datadate = (created) => {
    var formatedDateTime = new Date(created);
    formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDateTime;
  };

  useEffect(() => {
    setUserID(jobObj.userid);
    let total = 0;
    if (getJobData !== null && getJobData.length > 0) {
      getJobData.map((elem) => {
        total += elem.amount;
      });
      // console.log(total);
      setSumVal(total);
    }
  }, [getJobData]);

  return (
    <>
      <Button
        p="0 20px"
        bg={"gray.500"}
        _hover={{ bg: "gray.900" }}
        w="100%"
        fontSize="md"
        fontWeight="400"
        cursor="pointer"
        color={"#fff"}
        onClick={handleLog}
      >
        View Log
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Job Log</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {getJobData !== null && getJobData.length > 0 ? (
              <TableContainer>
                <Table variant="striped" colorScheme="gray">
                  <TableCaption>Compelete log of Job</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Sr. No.</Th>
                      <Th>Customer ID</Th>
                      <Th>Payment ID</Th>
                      <Th>Source ID</Th>
                      <Th>Status</Th>
                      <Th>Created At</Th>
                      <Th>Updated At</Th>
                      <Th isNumeric>Amount ($)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getJobData.map((element, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{index + 1}</Td>
                          <Td>{element.customer_id}</Td>
                          <Td>{element.payment_id}</Td>
                          <Td>{element.source_id}</Td>
                          <Td>
                            <Badge
                              w={"100%"}
                              bg={
                                element.status === "succeeded"
                                  ? "green.400"
                                  : "red.400"
                              }
                              color="white"
                              fontSize="16px"
                              p="3px 10px"
                              textAlign="center"
                            >
                              {element.status}
                            </Badge>
                          </Td>
                          <Td>{datadate(element.created_at)}</Td>
                          <Td>{datadate(element.updated_at)}</Td>
                          <Td isNumeric>{element.amount * 0.01}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th></Th>
                      <Th></Th>
                      <Th></Th>
                      <Th></Th>
                      <Th></Th>
                      <Th></Th>
                      <Th isNumeric>Total: ($)</Th>
                      <Th textAlign="end">{sumVal * 0.01}</Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            ) : (
              <Stack>
                <Skeleton height="35px" />
                <Skeleton height="35px" />
                <Skeleton height="35px" />
                <Skeleton height="35px" />
                <Skeleton height="35px" />
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="black" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const DeleteJob = (jobObj) => {
  // console.log(jobObj);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleDeleteJob = () => {
    deleteJobPaymentID(jobObj.userid)
      .then((res) => {
        if (res !== undefined && res.status === 200) {
          jobObj.toast({
            title: "Job deleted successfully!",
            description: "You've deleted the Job",
            status: "success",
            duration: 9000,
            isClosable: true,
          }) && console.log(res);
          return jobObj.setReloadHandler(true);
        } else {
          console.log(res);
        }
      })
      .catch((err) =>
        err
          ? jobObj.toast({
              title: "Getting Error!",
              description: "Error while deleteing this job",
              status: "error",
              duration: 9000,
              isClosable: true,
            }) && console.log(err)
          : console.log(err)
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
          <AlertDialogHeader>Delete this job?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this job it won't be recover?
            <br />
            *Your're deleting Job ID {jobObj.userid} <br />
            *Status:{" "}
            <Badge
              bg={
                jobObj.status === "uploaded"
                  ? jobObj.bgStatusNotVerified
                  : jobObj.status === "running"
                  ? jobObj.bgStatusRunning
                  : jobObj.bgStatusVerified
              }
              color={jobObj.colorStatus}
              fontSize="16px"
              p="3px 10px"
              textAlign="center"
            >
              {jobObj.status}
            </Badge>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleDeleteJob}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
