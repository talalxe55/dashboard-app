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
import LogsTable from "components/Tables/LogsTable";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import LoadingGif from "assets/svg/loading-infinite.svg";
import { useLocation } from "react-router-dom";
import {
  AlertUnauthorized,
  AlertDataNotFound,
} from "theme/components/AlertDialog";
import { getLogs, getUsers } from "api/ApiListing";

// PARENT COMPONENT
export default function Logs() {
  const { search } = useLocation();
  let query = React.useMemo(() => new URLSearchParams(search), [search]);
  const [newLogs, setNewLogs] = useState(null);
  const [isloading, setLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const textColor = useColorModeValue("gray.700", "white");
  const [unauthorizedWarning, setUnauthorizedWarning] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const setReloadHandler = (value) => {
    if (value === true) {
      setLoading(true);
      getLogs()
        .then((res) => {
          if (res !== undefined && res.status === 200) {
            setNewLogs(res.data.data.data);
            setLoading(false);
          } else {
          }
        })
        .catch((err) => {
          if (err.response.status == 401) {
            setUnauthorizedWarning(true);
          }
          setLoading(false);
        });
    }
  };

  // Converting date
  const datadate = (created) => {
    var formatedDateTime = new Date(created);
    formatedDateTime = formatedDateTime.toLocaleString();
    return formatedDateTime;
  };

  useEffect(() => {
    if (newLogs === null) {
      setLoading(true);
      getLogs()
        .then((res) => {
          if (res !== undefined && res.status === 200) {
            setNewLogs(res.data.data.data);
            setLoading(false);
          } else {
          }
        })
        .catch((err) => {
          if (err.response.status == 401) {
            setUnauthorizedWarning(true);
          }
          if (err.response.status == 404) {
            setNoDataFound(true);
          }
          setLoading(false);
        });
    }
  }, []);

  // Filtering Email
  // const customerListing =
  //   newLogs !== null && newLogs !== undefined
  //     ? newLogs.filter((customer) => {
  //         if (emailFilter == "") {
  //           return customer;
  //         } else if (emailFilter != "") {
  //           return customer.email == emailFilter ? customer : false;
  //         }
  //       })
  //     : null;

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {unauthorizedWarning ? <AlertUnauthorized /> : null}
      {noDataFound ? (
        <AlertDataNotFound setNoDataFound={setNoDataFound} />
      ) : null}
      <Card overflowX={{ sm: "scroll", xl: "scroll" }}>
        <CardHeader p="0 0 30px 0">
          <Text
            fontSize="xl"
            color={textColor}
            fontWeight="bold"
            textAlign={"start"}
          >
            All Logs
          </Text>
        </CardHeader>
        {!isloading ? (
          <>
            <CardBody>
              <Table
                variant="simple"
                color={textColor}
                className="customer-listing"
                overflowX={"auto"}
              >
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th color="gray.400">Sr. No.</Th>
                    <Th color="gray.400">Description</Th>
                    <Th color="gray.400">Created at</Th>
                    <Th color="gray.400">Updated at</Th>
                    <Th color="gray.400">View Details</Th>
                  </Tr>
                </Thead>
                <Tbody textTransform="capitalize">
                  {newLogs !== null
                    ? newLogs.map((val, index) => {
                        return (
                          <LogsTable
                            key={index}
                            srno={index + 1}
                            userid={val.id}
                            desc={val.description}
                            properties={val.properties}
                            dateCreated={datadate(val.created_at)}
                            dateUpdated={datadate(val.updated_at)}
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
            <Heading className="title_listing">Listing Logs...</Heading>
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
            <p>Showing {newLogs !== null ? newLogs.length : 0} of Logs</p>
          </Flex>
        </Box>
      </Card>
    </Flex>
  );
}
