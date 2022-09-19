import React, { useState, detailef, useCallback } from "react";
import ReactCreditCards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { FormControl, Flex, Input, Box, Stack } from "@chakra-ui/react";

export const CreditCard = () => {
  const [focus, setFocus] = useState("");
  const [detail, setDetail] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setDetail((preval) => {
      return {
        ...preval,
        [name]: value,
      };
    });
    console.log(e.target.value);
  };
  const handleInputFocus = (e) => {
    setFocus({ focus: e.target.name });
    // console.log(e.target.name);
  };
  return (
    <Box>
      <FormControl>
        <Stack my={5}>
          <ReactCreditCards
            cvc={detail.cvc}
            expiry={detail.expiry}
            focused={focus.focus}
            name={detail.name}
            number={detail.number}
          />
        </Stack>
        <Flex gap={3}>
          <Input
            type="tel"
            name="number"
            placeholder="Card Number"
            pattern="[\d| ]{16,22}"
            maxLength={16}
            required
            value={detail.number}
            onChange={handleInputs}
            onFocus={handleInputFocus}
          />
          <Input
            type="text"
            name="name"
            placeholder="Name"
            maxLength={25}
            required
            value={detail.name}
            onChange={handleInputs}
            onFocus={handleInputFocus}
          />
        </Flex>
        <Flex gap={3} mt={3}>
          <Input
            type="tel"
            name="expiry"
            placeholder="Valid Thru"
            pattern="\d\d/\d\d"
            maxLength={4}
            minLength={4}
            required
            value={detail.expiry}
            onChange={handleInputs}
            onFocus={handleInputFocus}
          />
          <Input
            type="tel"
            name="cvc"
            placeholder="CVC"
            pattern="\d{3,4}"
            maxLength={3}
            required
            value={detail.cvc}
            onChange={handleInputs}
            onFocus={handleInputFocus}
          />
        </Flex>
      </FormControl>
    </Box>
  );
};
