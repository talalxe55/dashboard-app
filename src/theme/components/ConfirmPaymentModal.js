import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select,
    Flex,
    Stack,
    Text,
    Tooltip,
    Editable,
    EditableInput,
    EditablePreview,
    useEditableControls,
    IconButton,
    ButtonGroup,
    Heading,
    Divider,
    Radio,
    Box,
    Checkbox,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
  } from "@chakra-ui/react";
  import {
    TriangleDownIcon,
    InfoIcon,
    EditIcon,
    CheckIcon,
    CloseIcon,
  } from "@chakra-ui/icons";
  import ReactSelect from "react-select";
  import Currency from "../../api/CountriesCurrency";
  //import { CreditCard } from "./CreditCard";
  import {
    getCustomersList,
    getAllPayments,
    getAllRefunds,
    createPayment,
  } from "api/ApiListing";
  // import { isReturnStatement } from "typescript";
  import {
    AlertUnauthorized,
    AlertDataNotFound,
    AlertPaymentCreated,
  } from "theme/components/AlertDialog";


const ConfirmPaymentModal = (props) => {

    const [errorData, seterrorData] = useState(null);
    const [isUnauthorized, setisUnauthorized] = useState(null);
    const [isSuccess, setisSuccess] = useState(false);
    const [isConfirmClosed, setisConfirmClosed] = useState(false);
    const { validateHandler, isConfirm, setisConfirm, payload, chargePayment, setpaymentbtnLoader, setisbtnDisabled, isbtnDisabled, setCreatepaymentBtnText, paymentbtnLoader, CreatepaymentBtnText, initialRef, finalRef } = props;
    // const initialRef = React.useRef(null);
    // const finalRef = React.useRef(null);
    //const { onClose, isOpen, onOpen } = useDisclosure();
    const { isOpen, onToggle, onClose } = useDisclosure()
    console.log('reached here');
    const AlertBox = () => {
    const { isOpen: isVisible, onClose, onOpen } = useDisclosure({
        defaultIsOpen: true,
    });

    
    return errorData !== null ? (
        <Alert status={errorData.status}>
        <AlertIcon />
        <Box>
            <AlertTitle>{errorData.title}</AlertTitle>
            <AlertDescription>{errorData.message}</AlertDescription>
        </Box>
        <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={() => {setCreatepaymentBtnText("Create Payment"); seterrorData(null);}}
        />
        </Alert>
    ) : (
        ""
    );
    };
    return (
    <>
        {isUnauthorized ? <AlertUnauthorized /> : null}
        {isSuccess ? <AlertPaymentCreated setisSuccess={setisSuccess}/>: null}

       
    <Popover
      initialFocusRef={initialRef}
      placement='top'
      closeOnBlur={false}
    >
      <PopoverTrigger>
      <Button isDisabled={isbtnDisabled} isLoading={paymentbtnLoader} loadingText='Creating Payment!' colorScheme="blue" mr={3} onClick = {validateHandler}>
             {CreatepaymentBtnText}
        </Button>
      </PopoverTrigger>
      {isConfirm ? 
      <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Review Details
        </PopoverHeader>
        <PopoverArrow bg='blue.800' />
        <PopoverCloseButton />
        <PopoverBody>
            Please review details before proceeding. After proceeding, you can not go back!
            {/* <Text>Amount: {payload.amount}</Text>
            <Text>Customer: {payload.customer}</Text>
            <Text>Currency: {payload.currency}</Text>
            <Text>Description: {payload.description}</Text>
            <Text>Statement Descriptor: {payload.statement_descriptor}</Text>
            <Text>Source: {payload.source}</Text> */}
        </PopoverBody>
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
          <Box fontSize='sm'>Step 2 of 4</Box>
          <ButtonGroup size='sm'>
            <Button colorScheme='green'>Proceed</Button>
            <Button colorScheme='blue' ref={initialRef}>
              Stop
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
                        : ""}
    </Popover>
        
    </>
    );

}


export default ConfirmPaymentModal;