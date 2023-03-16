import React, { useRef, useState } from "react";
import axios from "axios";
import {
  API_SERVER,
  TOKEN_TYPE,
  TOKEN,
  ACCEPT_TYPE,
} from "../../config/constant";
import {
  FormLabel,
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
  useToast,
} from "@chakra-ui/react";
import { FileDrop } from "react-file-drop";
import { useEffect } from "react";
import { AlertFileUploaded } from "./AlertDialog";

const UploadCSVModal = ({ setReloadHandler }) => {
  const [selectFile, setSelectedFile] = useState();
  const [fileName, setFileName] = useState("");
  const [fileDesc, setFileDesc] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const [uploadingMsg, setUploadedMsg] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);
  const toast = useToast();

  const postCSVFile = async () => {
    try {
      if (fileDesc === null || !fileDesc) {
        return toast({
          title: "Description is empty!",
          description:
            "Please fill the description first before uploading file.",
          status: "error",
          duration: 1500,
          isClosable: true,
        });
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectFile);
      formData.append("description", fileDesc);
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
      setLoading(false);
      setFileDesc("");
      if (res.status === 200) {
        setUploadedMsg(res.data.message);
        setAlert(true);
        setReloadHandler(true);
      }
    } catch (err) {
      setSelectedFile(null);
      setFileName("");
      if (err.response.status === 404) {
        setLoading(false);
      } else if (err.response.status === 401) {
        setLoading(false);
      } else if (err.response.status === 400) {
        toast({
          title: "Bad file uploaded!",
          description: "Please upload only CSV file of max 2MB size. Download SAMPLE FILE",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
      } else {
        toast({
          title: "Server error!",
          description: "err",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
      }
    }
    onClose();
  };

  const onFileInputChange = (event) => {
    const { files } = event.target;
    setSelectedFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
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
                      <Text as={"h4"} zIndex={1}>
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
                        bg="transparent"
                        fontWeight={400}
                        border="1px solid"
                        borderColor="primaryColor"
                        _hover={{ bg: "primaryColor", color: "#fff" }}
                        onClick={() =>
                          document.getElementById("theFile").click()
                        }
                      >
                        Select File
                      </Button>
                      <Text fontSize="smaller">Max File Size: 2MB</Text>
                    </Flex>
                  </Flex>
                </FormControl>
              </form>
            </Box>
            {fileName ? (
              <Flex direction="column">
                <FormControl>
                  <Heading as="h4" fontSize="xl">
                    {"File name: " + fileName.slice(0, -4)}
                  </Heading>
                </FormControl>
                <FormControl isRequired mt={2}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    variant="filled"
                    onChange={(e) => setFileDesc(e.target.value)}
                    // focusBorderColor="primaryColor"
                    placeholder="Enter the description of file*"
                  />
                </FormControl>
              </Flex>
            ) : (
              ""
            )}
          </ModalBody>
          {fileName ? (
            <ModalFooter>
              <Button
                isLoading={isLoading}
                color="#fff"
                bg="primaryColor"
                me={3}
                onClick={postCSVFile}
                _hover={{ bg: "#ca243d" }}
              >
                Upload
              </Button>
              <Button
                bg="black"
                _hover={{ bg: "gray.600" }}
                color="white"
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          ) : (
            <ModalFooter>
              <Button
                bg="black"
                _hover={{ bg: "gray.600" }}
                color="white"
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadCSVModal;
