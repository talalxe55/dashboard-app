import React, { useRef, useState } from "react";
import axios from "axios";
import {
  API_SERVER,
  TOKEN_TYPE,
  TOKEN,
  ACCEPT_TYPE,
} from "../../config/constant";
import {
  Flex,
  Text,
  Button,
  Box,
  Input,
  useDisclosure,
  FormControl,
  Collapse,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Progress,
  Badge,
  Heading,
} from "@chakra-ui/react";
import { FileDrop } from "react-file-drop";
import { useEffect } from "react";
import { AlertFileUploaded } from "./AlertDialog";

const UploadCSVModal = () => {
  const [selectFile, setSelectedFile] = useState();
  const [fileName, setFileName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const [uploadingMsg, setUploadedMsg] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);
  const postCSVFile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectFile);
      formData.append("description", "test payment");
      //   console.log(formData);
      const res = await axios.post(
        `${API_SERVER}bulk-payments/create`,
        formData,
        {
          headers: {
            Authorization: `${TOKEN_TYPE} ${TOKEN}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      let data = res.data;
      console.log(data);
      setLoading(false);
      if (res.status === 200) {
        setUploadedMsg(res.data.message);
        setAlert(true);
      }
    } catch (err) {
      if (err.response.status === 404) {
        console.log("Resource could not be found!");
      } else if (err.response.status === 401) {
        console.log("Unauthorized!");
      } else {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    // postCSVFile();
  }, [selectFile]);

  const onFileInputChange = (event) => {
    const { files } = event.target;
    setSelectedFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
    console.log(selectFile);
  };

  const onDropFiles = (files, event) => {
    setSelectedFile(files[0]);
    setFileName(files[0].name);
  };

  const onTargetClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {showAlert ? (
        <AlertFileUploaded setAlert={setAlert} fileUploadMsg={uploadingMsg} />
      ) : (
        ""
      )}
      <Button
        onClick={onOpen}
        mb={3}
        ms="auto"
        display="block"
        borderRadius={2}
        bg="gray.900"
        color="#fff"
        fontWeight={400}
        _hover={{ bg: "gray" }}
      >
        Upload CSV
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size={"4xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload A CSV File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p="40px" color="white" bg="gray.100" rounded="md" mb={3}>
              <form>
                <FormControl>
                  <Flex
                    justifyContent="center"
                    direction="column"
                    alignItems="center"
                    color="black"
                  >
                    <FileDrop
                      onTargetClick={onTargetClick}
                      //   onFrameDragEnter={(event) =>
                      //     console.log("onFrameDragEnter", event)
                      //   }
                      //   onFrameDragLeave={(event) =>
                      //     console.log("onFrameDragLeave", event)
                      //   }
                      //   onFrameDrop={(event) => console.log("onFrameDrop", event)}
                      //   onDragOver={(event) => console.log("onDragOver", event)}
                      //   onDragLeave={(event) => console.log("onDragLeave", event)}
                      onDrop={onDropFiles}
                    >
                      <Text transform="translateY(-30px)">
                        Drop files to upload
                      </Text>
                    </FileDrop>
                    <Flex
                      justifyContent="center"
                      direction="column"
                      alignItems="center"
                      mt="100px"
                      transform="translateY(-20px)"
                    >
                      <Text as={"h6"} zIndex={1}>
                        or
                      </Text>
                      <Input
                        display="none"
                        onChange={onFileInputChange}
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        id="theFile"
                        accept="text/csv"
                      />
                      <Button
                        px="30px"
                        borderRadius={6}
                        bg="transparent"
                        fontWeight={400}
                        border="1px solid"
                        borderColor="teal.300"
                        _hover={{ bg: "teal.300", color: "#fff" }}
                        onClick={() =>
                          document.getElementById("theFile").click()
                        }
                      >
                        Select File
                      </Button>
                      <Text fontSize="smaller">File limit 10mb</Text>
                    </Flex>
                  </Flex>
                </FormControl>
              </form>
            </Box>
            <Flex>
              <Heading as="h4" fontSize="xl">
                {fileName ? "File Name: " + fileName.slice(0, -4) : ""}
              </Heading>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              color="#fff"
              borderRadius={6}
              bg="teal.300"
              me={3}
              onClick={postCSVFile}
              _hover={{ bg: "#ca243d" }}
            >
              Upload
            </Button>
            <Button
              bg="black"
              _hover={{ bg: "gray.600" }}
              borderRadius={6}
              color="white"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <Flex
        gap={5}
        mb={3}
        justifyContent="start"
        alignItems="center"
        color="#000"
      >
        <Flex
          boxShadow="lg"
          bg="gray.100"
          rounded="md"
          p={6}
          h={100}
          justifyContent="center"
          alignItems="center"
        >
          <Text>File name</Text>
        </Flex>
        <Flex
          boxShadow="lg"
          bg="gray.100"
          rounded="md"
          p={6}
          h={100}
          justifyContent="center"
          alignItems="center"
        >
          <Text>File name</Text>
        </Flex>
        <Flex
          boxShadow="lg"
          bg="gray.100"
          rounded="md"
          p={6}
          h={100}
          justifyContent="center"
          alignItems="center"
        >
          <Text>File name</Text>
        </Flex>
      </Flex> */}
      {/* <Button onClick={postCSVFile}>Upload a file</Button> */}
    </>
  );
};

export default UploadCSVModal;
