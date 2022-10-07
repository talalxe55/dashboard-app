import {
  Button,
  ButtonGroup,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";

const AddCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Add
        </MenuButton>
        <MenuList>
          <MenuItem>
            <Button onClick={onOpen}>Add US Bank Account</Button>
          </MenuItem>
          <MenuItem>Add Card</MenuItem>
        </MenuList>
      </Menu>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Aute in dolore consequat excepteur reprehenderit proident sint
            dolore dolore mollit incididunt elit. Do proident dolor duis labore
            commodo in. Id id magna elit id adipisicing excepteur amet
            consectetur veniam excepteur dolor. Lorem commodo voluptate velit
            minim deserunt. Enim reprehenderit dolore ex aliquip. Elit ullamco
            culpa officia sint elit.
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddCard;
