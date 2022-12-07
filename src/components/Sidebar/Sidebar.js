/*eslint-disable*/
import { HamburgerIcon } from "@chakra-ui/icons";
// chakra imports
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import { CreativeTimLogo } from "components/Icons/Icons";
import { Separator } from "components/Separator/Separator";
import { SidebarHelp } from "components/Sidebar/SidebarHelp";
import PropTypes from "prop-types";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "auth-context/auth.context";
import { RocketIcon } from "components/Icons/Icons";
// FUNCTIONS

function Sidebar(props) {
  // to check for active links and opened collapses
  let location = useLocation();
  const { user } = useAuth();
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { sidebarVariant } = props;
    // Chakra Color Mode
    let activeBg = useColorModeValue("white", "gray.700");
    let inactiveBg = useColorModeValue("white", "gray.700");
    let activeColor = useColorModeValue("gray.700", "white");
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    let sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";
    // Here are all the props that may change depending on sidebar's state.(Opaque or transparent)
    if (sidebarVariant === "opaque") {
      activeBg = "transparent";
      inactiveBg = useColorModeValue("gray.100", "gray.600");
      activeColor = useColorModeValue("gray.700", "white");
      inactiveColor = useColorModeValue("gray.400", "gray.400");
      sidebarActiveShadow = "none";
    }

    return routes.map((prop, index) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <React.Fragment key={index}>
            <Text
              key={index + prop.key}
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: "12px",
              }}
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
            >
              {document.documentElement.dir === "rtl"
                ? prop.rtlName
                : prop.name}
            </Text>
            {createLinks(prop.views)}
          </React.Fragment>
        );
      }

      if (prop.layout === "/admin" && user && prop.role) {
        if (!prop.role.includes(user.role)) {
          return null;
        }
      }

      return (
        <React.Fragment key={index}>
          {prop.hide ? null : (
            <NavLink key={index + prop.key} to={prop.layout + prop.path}>
              {activeRoute(prop.layout + prop.path) === "active" ? (
                <Button
                  boxSize="initial"
                  justifyContent="flex-start"
                  alignItems="center"
                  boxShadow={sidebarActiveShadow}
                  bg={activeBg}
                  transition={variantChange}
                  mb={{
                    xl: "12px",
                  }}
                  mx={{
                    xl: "auto",
                  }}
                  ps={{
                    sm: "10px",
                    xl: "16px",
                  }}
                  py="12px"
                  borderRadius="15px"
                  _hover="none"
                  w="100%"
                  _active={{
                    bg: "inherit",
                    transform: "none",
                    borderColor: "transparent",
                  }}
                  _focus={{
                    boxShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <Flex>
                    {typeof prop.icon === "string" ? (
                      <Icon>{prop.icon}</Icon>
                    ) : (
                      <IconBox
                        bg="primaryColor"
                        color="white"
                        h="30px"
                        w="30px"
                        me="12px"
                        transition={variantChange}
                      >
                        {prop.icon}
                      </IconBox>
                    )}
                    <Text color={activeColor} my="auto" fontSize="sm">
                      {document.documentElement.dir === "rtl"
                        ? prop.rtlName
                        : prop.name}
                    </Text>
                  </Flex>
                </Button>
              ) : (
                <Button
                  boxSize="initial"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg="transparent"
                  mb={{
                    xl: "12px",
                  }}
                  mx={{
                    xl: "auto",
                  }}
                  py="12px"
                  ps={{
                    sm: "10px",
                    xl: "16px",
                  }}
                  borderRadius="15px"
                  _hover="none"
                  w="100%"
                  _active={{
                    bg: "inherit",
                    transform: "none",
                    borderColor: "transparent",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                >
                  <Flex>
                    {typeof prop.icon === "string" ? (
                      <Icon>{prop.icon}</Icon>
                    ) : (
                      <IconBox
                        bg={inactiveBg}
                        color="primaryColor"
                        h="30px"
                        w="30px"
                        me="12px"
                        transition={variantChange}
                      >
                        {prop.icon}
                      </IconBox>
                    )}
                    <Text color={inactiveColor} my="auto" fontSize="sm">
                      {document.documentElement.dir === "rtl"
                        ? prop.rtlName
                        : prop.name}
                    </Text>
                  </Flex>
                </Button>
              )}
            </NavLink>
          )}
        </React.Fragment>
      );
    });
  };
  const { logoText, routes, sidebarVariant } = props;

  var links = <>{createLinks(routes)}</>;
  //  BRAND
  //  Chakra Color Mode
  const mainText = useColorModeValue("gray.700", "gray.200");
  let sidebarBg = "none";
  let sidebarRadius = "0px";
  let sidebarMargins = "0px";
  if (sidebarVariant === "opaque") {
    sidebarBg = useColorModeValue("white", "gray.700");
    sidebarRadius = "16px";
    sidebarMargins = "16px 0px 16px 16px";
  }
  var brand = (
    <Box pt={"25px"} mb="12px">
      <Link
        href={`${process.env.PUBLIC_URL}/#/`}
        display="flex"
        lineHeight="100%"
        mb="30px"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
        fontSize="11px"
      >
        <CreativeTimLogo w="32px" h="32px" me="10px" />
        <Text fontSize="sm" mt="3px">
          {logoText}
        </Text>
      </Link>
      <Separator></Separator>
    </Box>
  );

  // SIDEBAR
  return (
    <Box ref={mainPanel}>
      <Box
        display={{ sm: "none", xl: "block" }}
        position="fixed"
        overflowY="auto"
      >
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="260px"
          maxW="260px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          borderRadius={sidebarRadius}
        >
          <Box>{brand}</Box>
          <Stack direction="column" mb="40px">
            <Box>{links}</Box>
          </Stack>
          <SidebarHelp></SidebarHelp>
        </Box>
      </Box>
    </Box>
  );
}

// FUNCTIONS MOBILE

export function SidebarResponsive(props) {
  let variantChange = "0.2s linear";

  const { user } = useAuth();
  // to check for active links and opened collapses

  let location = useLocation();
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const mainPanel = React.createRef();
  // verifies if routeName is the one active (in browser input)
  let currentPageURL = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );
  console.log(currentPageURL === "signin");
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    // Chakra Color Mode
    const activeBg = useColorModeValue("white", "gray.700");
    const inactiveBg = useColorModeValue("white", "gray.700");
    const activeColor = useColorModeValue("gray.700", "white");
    const inactiveColor = useColorModeValue("gray.400", "gray.400");
    let sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";

    {
      if (currentPageURL === "signin" || currentPageURL === "forgot-password") {
        return (
          <>
            <NavLink to="signin">
              <Flex alignItems="center">
                <IconBox
                  bg={inactiveBg}
                  color="primaryColor"
                  h="30px"
                  w="30px"
                  me="12px"
                  transition={variantChange}
                >
                  <RocketIcon color="inherit" />
                </IconBox>
                <Text
                  color={activeColor}
                  fontWeight="bold"
                  mb={{
                    xl: "12px",
                  }}
                  mx="auto"
                  py="12px"
                >
                  SignIn
                </Text>
              </Flex>
            </NavLink>
          </>
        );
      } else {
        return routes.map((prop, index) => {
          if (prop.redirect) {
            return null;
          }
          if (prop.category) {
            var st = {};
            st[prop["state"]] = !state[prop.state];
            return (
              <React.Fragment key={index}>
                <Text
                  color={activeColor}
                  fontWeight="bold"
                  mb={{
                    xl: "12px",
                  }}
                  mx="auto"
                  ps={{
                    sm: "10px",
                    xl: "16px",
                  }}
                  py="12px"
                >
                  {document.documentElement.dir === "rtl"
                    ? prop.rtlName
                    : prop.name}
                </Text>
                {createLinks(prop.views)}
              </React.Fragment>
            );
          }
          if (prop.layout === "/admin" && user && prop.role) {
            if (!prop.role.includes(user.role)) {
              return null;
            }
          }
          return (
            <React.Fragment key={index}>
              {prop.hide ? null : (
                <NavLink key={index + prop.key} to={prop.layout + prop.path}>
                  {activeRoute(prop.layout + prop.path) === "active" ? (
                    <Button
                      boxSize="initial"
                      justifyContent="flex-start"
                      alignItems="center"
                      boxShadow={sidebarActiveShadow}
                      bg={activeBg}
                      transition={variantChange}
                      mb={{
                        xl: "12px",
                      }}
                      mx={{
                        xl: "auto",
                      }}
                      ps={{
                        sm: "10px",
                        xl: "16px",
                      }}
                      py="12px"
                      borderRadius="15px"
                      _hover="none"
                      w="100%"
                      _active={{
                        bg: "inherit",
                        transform: "none",
                        borderColor: "transparent",
                      }}
                      _focus={{
                        boxShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <Flex>
                        {typeof prop.icon === "string" ? (
                          <Icon>{prop.icon}</Icon>
                        ) : (
                          <IconBox
                            bg="primaryColor"
                            color="white"
                            h="30px"
                            w="30px"
                            me="12px"
                            transition={variantChange}
                          >
                            {prop.icon}
                          </IconBox>
                        )}
                        <Text color={activeColor} my="auto" fontSize="sm">
                          {document.documentElement.dir === "rtl"
                            ? prop.rtlName
                            : prop.name}
                        </Text>
                      </Flex>
                    </Button>
                  ) : (
                    <Button
                      boxSize="initial"
                      justifyContent="flex-start"
                      alignItems="center"
                      bg="transparent"
                      mb={{
                        xl: "12px",
                      }}
                      mx={{
                        xl: "auto",
                      }}
                      py="12px"
                      ps={{
                        sm: "10px",
                        xl: "16px",
                      }}
                      borderRadius="15px"
                      _hover="none"
                      w="100%"
                      _active={{
                        bg: "inherit",
                        transform: "none",
                        borderColor: "transparent",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                    >
                      <Flex>
                        {typeof prop.icon === "string" ? (
                          <Icon>{prop.icon}</Icon>
                        ) : (
                          <IconBox
                            bg={inactiveBg}
                            color="primaryColor"
                            h="30px"
                            w="30px"
                            me="12px"
                            transition={variantChange}
                          >
                            {prop.icon}
                          </IconBox>
                        )}
                        <Text color={inactiveColor} my="auto" fontSize="sm">
                          {document.documentElement.dir === "rtl"
                            ? prop.rtlName
                            : prop.name}
                        </Text>
                      </Flex>
                    </Button>
                  )}
                </NavLink>
              )}
            </React.Fragment>
          );
        });
      }
    }
  };
  const { logoText, routes, ...rest } = props;

  var links = <>{createLinks(routes)}</>;
  // MOBILE?
  //  BRAND
  //  Chakra Color Mode
  const mainText = useColorModeValue("gray.700", "gray.200");
  let hamburgerColor = useColorModeValue("gray.500", "gray.200");
  if (props.secondary === true) {
    hamburgerColor = "white";
  }
  var brand = (
    <Box pt={"35px"} mb="8px">
      <Link
        href={`${process.env.PUBLIC_URL}/#/`}
        target="_blank"
        display="flex"
        lineHeight="100%"
        mb="30px"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
        fontSize="11px"
      >
        <CreativeTimLogo w="32px" h="32px" me="10px" />
        <Text fontSize="sm" mt="3px">
          {logoText}
        </Text>
      </Link>
      <Separator></Separator>
    </Box>
  );

  // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.createRef();
  // Color variables
  return (
    <Flex
      display={{ sm: "flex", xl: "none" }}
      ref={mainPanel}
      alignItems="center"
    >
      <HamburgerIcon
        color={hamburgerColor}
        w="18px"
        h="18px"
        ref={btnRef}
        colorscheme="teal"
        onClick={onOpen}
        cursor="pointer"
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          maxW="250px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          borderRadius="16px"
        >
          <DrawerCloseButton
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="100vh">
              <Box>{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
                {/* {routes.map((element, index) => {
                  {
                    element.hide === false ? console.log(element) : "";
                  }
                })} */}
              </Stack>
              <SidebarHelp></SidebarHelp>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
// PROPS

Sidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};
SidebarResponsive.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

export default Sidebar;
