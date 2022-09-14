import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { TriangleDownIcon } from "@chakra-ui/icons";

import Currency from "../../api/CountriesCurrency";

const PaymentForm = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currency, setCurrency] = useState("USD$");
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <>
      <Button
        bg={props.bg}
        color="white"
        variant="no-hover"
        onClick={onOpen}
        width={{ sm: "200px" }}
        borderRadius={{ sm: 10 }}
      >
        Create Payment
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent minWidth={{ sm: "35%" }}>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY={{ sm: "auto" }}>
            <FormControl isRequired>
              <FormLabel>Amount</FormLabel>
              <Text mb={"-31px"} mt={4} ms={2} fontSize="small" color="gray">
                {currency}
              </Text>

              <Flex gap={3}>
                <Input
                  ref={initialRef}
                  type="number"
                  name="amt"
                  placeholder=""
                  autoComplete="off"
                  ps={12}
                />
                <Stack width={200}>
                  <Select
                    id="currencysym"
                    icon={<TriangleDownIcon />}
                    onChange={() =>
                      setCurrency(
                        document.getElementById("currencysym").value === "USD"
                          ? "USD$"
                          : document.getElementById("currencysym").value
                      )
                    }
                  >
                    {Currency.map((val, index) => {
                      return (
                        <option value={val.abbreviation} key={index}>
                          {val.abbreviation + " - " + val.currency}
                        </option>
                      );
                    })}
                  </Select>
                </Stack>
              </Flex>
            </FormControl>
            <FormControl mt={4}>
              <Flex>
                <FormLabel>Customer </FormLabel>
                <Text color="gray">(Optional)</Text>
              </Flex>
              <Input placeholder="Last name" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Submit Payment
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentForm;
