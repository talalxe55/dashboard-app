import React from "react";
import ReactCreditCards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { FormControl, Flex, Input, Box, Stack } from "@chakra-ui/react";

export class CreditCard extends React.Component {
  state = {
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  };
  handleInputFocus = (e) => {
    this.setState({ focus: e.target.name });
  };
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    console.log(name);
  };
  render() {
    return (
      <Box>
        <FormControl>
          <Stack my={5}>
            <ReactCreditCards
              cvc={this.state.cvc}
              expiry={this.state.expiry}
              focused={this.state.focus}
              name={this.state.name}
              number={this.state.number}
            />
          </Stack>
          <Flex gap={3}>
            <Input
              type="tel"
              name="number"
              className="form-control"
              placeholder="Card Number"
              pattern="[\d| ]{16,22}"
              required
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
            <Input
              type="text"
              name="name"
              placeholder="Name"
              required
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
          </Flex>
          <Flex gap={3} mt={3}>
            <Input
              type="tel"
              name="expiry"
              className="form-control"
              placeholder="Valid Thru"
              pattern="\d\d/\d\d"
              required
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
            <Input
              type="tel"
              name="cvc"
              className="form-control"
              placeholder="CVC"
              pattern="\d{3,4}"
              required
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
          </Flex>
        </FormControl>
      </Box>
    );
  }
}
