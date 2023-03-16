import {
    Button,
    Flex,
    Td,
    Tr,
    Text,
    useColorModeValue,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Table,
    Tbody,
  } from "@chakra-ui/react";
  import React, { useRef, useEffect, useState } from "react";
  import { FaEye } from "react-icons/fa";
  
  const BulkPaymentEntriesTable = (props) => {
    const {
      srno,
      id,
      amount,
      cus_id,
      source_id,
      currency,
      st_desc,
      desc,
      status,
      dateCreated,
      dateUpdated,
      setReloadHandler
    } = props;
    const textColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.200", "#1a202c");
    const bgStatusVerified = useColorModeValue("green.400", "#1a202c");
    const bgStatusNotVerified = useColorModeValue("red.400", "#1a202c");
    const bgStatusRunning = useColorModeValue("orange.400", "#1a202c");
    const colorStatus = useColorModeValue("white", "gray.400");
    const [isLoading, setLoading] = useState(false);
  
    useEffect(() => {}, []);
    return (
      <Tr payment-data={id}>
        <Td>
          <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
            <Text>{srno}</Text>
          </Flex>
        </Td>
  
        <Td>
          <Text             fontSize="sm"
            color={textColor}
            fontWeight="bold"
            pb=".5rem"
            whiteSpace={"nowrap"}>
            ${amount}
          </Text>
        </Td>

        <Td>
          <Text fontSize="sm" color={textColor} fontWeight="bold" pb=".5rem">
            {cus_id}
          </Text>
        </Td>

        <Td>
          <Text fontSize="sm" color={textColor} fontWeight="bold" pb=".5rem">
            {source_id}
          </Text>
        </Td>

        {/* <Td>
          <Text fontSize="sm" color={textColor} fontWeight="bold" pb=".5rem">
            {status==1?"Attempted":"Not Attempted"}
          </Text>
        </Td> */}
  
        <Td>
          <Text
            fontSize="sm"
            color={textColor}
            fontWeight="bold"
            pb=".5rem"
            whiteSpace={"nowrap"}
          >
            {status==1?"Attempted":"Not Attempted"}
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
            {dateCreated}
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
            {dateUpdated}
          </Text>
        </Td>
  
        {/* <Td textAlign="center">
          <ViewLog
            options={properties ? properties.options : ""}
            setReloadHandler={setReloadHandler}
          />
        </Td> */}
      </Tr>
    );
  };
  
  export default BulkPaymentEntriesTable;
  
  const ViewLog = (logProperties) => {
    const dataamount = (amount) => {
      let cents = amount;
      var formatedDollars = (cents / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      //formatedDateTime = formatedDateTime.toLocaleString();
      return formatedDollars;
    };
    let ObjEntries = Object.entries(logProperties.options);
  
    // ObjEntries.forEach(([key, value]) => {
    //   if (typeof value !== "object") {
    //     console.log(key);
    //   }
    // });
  
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
  
    return (
      <>
        <Button
          onClick={onOpen}
          bg="white"
          color="primaryColor"
          _hover={{ bg: "gray.100" }}
        >
          <FaEye />
        </Button>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />
  
          <AlertDialogContent maxWidth={600}>
            <AlertDialogHeader>Log</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Table>
                <Tbody>
                  {ObjEntries.map(([key, value], index) => {
                    if (typeof value !== "object") {
                      return (
                        <div key={index}>
                          <Tr>
                            <Td p={2} textTransform={"capitalize"}>
                              {key.replaceAll("_", " ")}
                            </Td>
                            <Td p={2} textTransform={"capitalize"}>
                              {key==='amount'?dataamount(value):value}
                            </Td>
                          </Tr>
                        </div>
                      );
                    }
                  })}
                </Tbody>
              </Table>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };
  