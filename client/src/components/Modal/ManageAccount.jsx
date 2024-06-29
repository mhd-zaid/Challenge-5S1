import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button,
  Tabs, TabList, Tab, TabPanels, TabPanel
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import ManageAccountForm from '../forms/ManageAccountForm';

const ManageAccount = () => {
  const { register, handleSubmit, setValue, reset, getValues, watch, formState: { errors } } = useForm();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button onClick={openModal}>Ouvrir la gestion de compte</Button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Gestion de votre compte
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>Mes informations</Tab>
                <Tab>Sécurité</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ManageAccountForm close={closeModal} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManageAccount;
