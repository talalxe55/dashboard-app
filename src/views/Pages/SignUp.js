// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import BgSignUp from "assets/img/blackboard-bg.jpg";
import React, { useState } from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

import AuthApi from "../../api/auth";
import { useHistory } from "react-router-dom";

function SignUp() {
  const history = useHistory();
  const titleColor = useColorModeValue("primaryColor", "teal.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const bgIcons = useColorModeValue("teal.200", "rgba(255, 255, 255, 0.5)");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [buttonText, setButtonText] = useState("Register");
  const [error, setError] = useState(undefined);

  const register = async (event) => {
    if (event) {
      event.preventDefault();
    }
    if (name === "") {
      return setError("You must enter your name.");
    }
    if (email === "") {
      return setError("You must enter your email.");
    }
    if (password === "") {
      return setError("You must enter a password.");
    }
    if (password !== repassword) {
      return setError("Password is not same.");
    }
    try {
      setButtonText("Registering...");
      let response = await AuthApi.Register({
        name: name,
        email: email,
        password: password,
        password_confirmation: repassword,
      });
      if (response.data && response.data.success === true) {
        setButtonText("Register");
      }
      return history.push("/admin/users");
    } catch (err) {
      setButtonText("Register");
      if (err.response.status === 400) {
        if (err.response.data.message.name) {
          return setError(err.response.data.message.name);
        }
        if (err.response.data.message.email) {
          return setError(err.response.data.message.email);
        }
        if (err.response.data.message.password) {
          return setError(err.response.data.message.password);
        }
      }
      setButtonText("Register");
      if (message.response) {
        return setError(message.response.data.msg);
      }
      return setError("There has been an error.");
    }
  };

  return (
    <Flex
      direction="column"
      alignSelf="center"
      justifySelf="center"
      overflow="hidden"
    >
      <Box
        position="absolute"
        minH={{ base: "70vh", md: "50vh" }}
        // w={{ md: "calc(100vw - 50px)" }}
        borderRadius={{ md: "15px" }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        // bgImage={BgSignUp}
        bg="primaryColor"
        bgSize="cover"
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
      ></Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        mb="30px"
      >
        <Text fontSize="4xl" color="white" fontWeight="bold">
          Welcome!
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}
        >
          Please fill new user details in fields
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Flex
          direction="column"
          w="445px"
          background="transparent"
          borderRadius="15px"
          p="40px"
          mx={{ base: "100px" }}
          bg={bgColor}
          boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
          <Text
            fontSize="xl"
            color={textColor}
            fontWeight="bold"
            textAlign="center"
            mb="22px"
          >
            Register
          </Text>
          <FormControl>
            <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
              Name
            </FormLabel>
            <Input
              fontSize="sm"
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder="Your full name"
              mb="24px"
              size="lg"
              onChange={(event) => {
                setName(event.target.value);
                setError(undefined);
              }}
            />
            <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
              Email
            </FormLabel>
            <Input
              fontSize="sm"
              ms="4px"
              borderRadius="15px"
              type="email"
              placeholder="Your email address"
              mb="24px"
              size="lg"
              onChange={(event) => {
                setEmail(event.target.value);
                setError(undefined);
              }}
            />
            <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
              Password
            </FormLabel>
            <Input
              fontSize="sm"
              ms="4px"
              borderRadius="15px"
              type="password"
              placeholder="Your password"
              mb="24px"
              size="lg"
              onChange={(event) => {
                setPassword(event.target.value);
                setError(undefined);
              }}
            />
            <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
              Confirm Password
            </FormLabel>
            <Input
              fontSize="sm"
              ms="4px"
              borderRadius="15px"
              type="password"
              placeholder="Please re-enter password"
              mb="24px"
              size="lg"
              onChange={(event) => {
                setrePassword(event.target.value);
                setError(undefined);
              }}
            />
            {/* <FormControl display="flex" alignItems="center" mb="24px">
              <Switch id="remember-login" colorScheme="teal" me="10px" />
              <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal">
                Remember me
              </FormLabel>
            </FormControl> */}
            <h4
              style={{
                fontSize: ".9em",
                color: "red",
                textAlign: "center",
                fontWeight: 400,
                transition: ".2s all",
                marginBottom: "1em",
              }}
            >
              {error}
            </h4>
            <Button
              type="submit"
              bg="primaryColor"
              fontSize="md"
              color="white"
              fontWeight="bold"
              w="100%"
              h="45"
              mb="24px"
              _hover={{
                bg: "primaryColor",
              }}
              _active={{
                bg: "primaryColorHover",
              }}
              onClick={register}
            >
              {buttonText}
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColor} fontWeight="medium">
              Dashboard for NLS
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
