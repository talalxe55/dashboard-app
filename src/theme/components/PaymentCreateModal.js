import React from "react";
import {
  Flex,
  Text,
  Button,
  Box,
  Input,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import ReactSelect from "react-select";
// import { getCustomerID } from "api/ApiListing";
import { useEffect } from "react";
import { API_SERVER, TOKEN_TYPE, TOKEN, ACCEPT_TYPE } from "config/constant";
import axios from "axios";
import { useParams } from "react-router-dom";
const PaymentCreateModal = () => {
  let { id } = useParams();
  console.log(id);
  const getCustomerID = async () => {
    try {
      const res = await axios.get(`${API_SERVER}customers/cus_MUAJ4H3JWVHQiR`, {
        headers: {
          Authorization: `${TOKEN_TYPE} ${TOKEN}`,
          Accept: `${ACCEPT_TYPE}`,
          "Content-Type": `${ACCEPT_TYPE}`,
        },
      });
      // let data = await res.json();
      console.log(res.data.data);
      console.log(res.status);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCustomerID();
  }, []);
  const [selectCountry, setSelectedCountries] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const options = [
    { value: "USD 1", label: "USD 1" },
    { value: "USD 2", label: "USD 2" },
    { value: "USD 3", label: "USD 3" },
  ];

  return (
    <>
      <Button onClick={onOpen}>Create</Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <form>
          <ModalContent className="create_payment_modal">
            <ModalHeader>Create a new payment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <Flex>
                  <FormLabel>Currency</FormLabel>
                  <ReactSelect
                    className="select_drop"
                    options={options}
                    placeholder="Find Customer"
                    name="customers"
                    value={options.filter((obj) => obj.value === selectCountry)}
                    onChange={(e) => {
                      setSelectedCountries(e.value);
                    }}
                  />
                </Flex>
              </FormControl>
              <FormControl>
                <Flex>
                  <FormLabel>Amount</FormLabel>
                  <Box>
                    <Text mb={"-30px"} ms={1}>
                      USD
                    </Text>
                    <Input placeholder="" value={0.0} ps={10} />
                  </Box>
                </Flex>
              </FormControl>
              <FormControl>
                <Flex>
                  <FormLabel>Payment method</FormLabel>
                  <Select>
                    <option value="card 1">card 1</option>
                    <option value="card 2">card 2</option>
                    <option value="card 3">card 3</option>
                  </Select>
                </Flex>
              </FormControl>
              <FormControl>
                <Flex>
                  <FormLabel>Statement desc</FormLabel>
                  <Input value="FOXTAIL-TURF" />
                </Flex>
              </FormControl>
              <FormControl>
                <Flex>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Products or services associated with payment" />
                </Flex>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button bg={"teal.300"} color="white" _hover={"none"} mr={3}>
                Create Payment
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default PaymentCreateModal;
