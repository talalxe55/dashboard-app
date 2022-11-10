import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Box,
  Heading,
  Image,
} from "@chakra-ui/react";
import UsersTable from "components/Tables/UsersTable";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import LoadingGif from "assets/svg/loading-infinite.svg";
import { useLocation } from "react-router-dom";
import {
  AlertUnauthorized,
  AlertDataNotFound,
} from "theme/components/AlertDialog";
import { getUsers } from "api/ApiListing";

// PARENT COMPONENT
function Users() {
  const { search } = useLocation();
  let query = React.useMemo(() => new URLSearchParams(search), [search]);
  const [newUsers, setNewUsers] = useState(null);
  const [isloading, setLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const textColor = useColorModeValue("gray.700", "white");
  const [unauthorizedWarning, setUnauthorizedWarning] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const setReloadHandler = (value) => {
    console.log(value);
    if (value === true) {
      setLoading(true);
      getUsers()
        .then((res) => {
          if (res !== undefined && res.status === 200) {
            setNewUsers(res.data.data);
            setLoading(false);
          } else {
            console.log(res);
          }
        })
        .catch((err) => console.log(err) && setLoading(false));
    }
  };

  // Converting date
  const datadate = (created) => {
    var formatedDateTime = new Date(created);
    formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDateTime;
  };

  useEffect(() => {
    if (newUsers === null) {
      setLoading(true);
      getUsers()
        .then((res) => {
          if (res !== undefined && res.status === 200) {
            setNewUsers(res.data.data);
            setLoading(false);
          } else {
            console.log(res);
          }
        })
        .catch((err) => console.log(err) && setLoading(false));
    }
  }, []);

  // Filtering Email
  const customerListing =
    newUsers !== null && newUsers !== undefined
      ? newUsers.filter((customer) => {
          if (emailFilter == "") {
            return customer;
          } else if (emailFilter != "") {
            return customer.email == emailFilter ? customer : false;
          }
        })
      : null;

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {unauthorizedWarning ? <AlertUnauthorized /> : null}
      {noDataFound ? <AlertDataNotFound /> : null}
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="0 0 30px 0">
          <Text
            fontSize="xl"
            color={textColor}
            fontWeight="bold"
            textAlign={"start"}
          >
            All Users
          </Text>
        </CardHeader>
        {!isloading ? (
          <>
            <CardBody>
              <Table
                variant="simple"
                color={textColor}
                className="customer-listing"
              >
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th color="gray.400">Sr. No.</Th>
                    <Th color="gray.400">Name</Th>
                    <Th color="gray.400">Email</Th>
                    <Th color="gray.400">Role</Th>
                    <Th color="gray.400">Change User Role</Th>
                    <Th color="gray.400">Status</Th>
                    <Th color="gray.400">Created at</Th>
                    <Th color="gray.400">Delete Job</Th>
                  </Tr>
                </Thead>
                <Tbody className="customer_body" textTransform={"capitalize"}>
                  {newUsers !== null
                    ? customerListing.map((val, index) => {
                        {
                          /* console.log(val); */
                        }
                        return (
                          <UsersTable
                            key={index}
                            srno={index + 1}
                            userid={val.id}
                            name={val.name}
                            email={val.email}
                            status={
                              val.email_verified_at === null
                                ? "Not Verfied"
                                : "Verified"
                            }
                            role={val.role}
                            date={datadate(val.created_at)}
                            setReloadHandler={setReloadHandler}
                          />
                        );
                      })
                    : ""}
                </Tbody>
              </Table>
            </CardBody>
          </>
        ) : (
          <Flex
            justifyContent="center"
            alignItems="center"
            direction={"column"}
          >
            <Heading>Listing Payments Job...</Heading>
            <Image src={LoadingGif} w={100} />
          </Flex>
        )}
        <Box>
          <Flex
            mt={5}
            justifyContent="center"
            alignItems="center"
            direction={"column"}
          >
            <p>
              Showing {newUsers !== null ? newUsers.length : 0} of Payments Job
            </p>
          </Flex>
        </Box>
      </Card>
    </Flex>
  );
}

export default Users;
