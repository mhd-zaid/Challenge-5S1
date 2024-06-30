import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button,
  Tabs, TabList, Tab, TabPanels, TabPanel, useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import ManageAccountForm from '../forms/ManageAccountForm';
import { EditIcon } from '@chakra-ui/icons';
import ModifyPassword from '../forms/ModifyPassword';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ManageAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State for deletion loading

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const toast = useToast();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleDeleteAccount = async () => {
    setIsDeleting(true); 
    try {
      await fetch(`${BASE_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/ld+json',
          'Authorization': `Bearer ${token}`
        }
      }).then((response) => {
        if (response.status === 204) {
          logout();
          navigate('/auth/login');
        }
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression de votre compte",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  }

  return (
    <>
      <EditIcon boxSize={6} color="blue.500" cursor="pointer" onClick={openModal} />

      <Modal isOpen={isOpen} onClose={closeModal} size='xl'>
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
                <Tab>Supprimer mon compte</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ManageAccountForm close={closeModal} />
                </TabPanel>
                <TabPanel>
                  <ModifyPassword close={closeModal} />
                </TabPanel>
                <TabPanel>
                  <Button colorScheme="red" onClick={openDeleteModal} isLoading={isDeleting} loadingText="Suppression en cours...">
                    Supprimer mon compte
                  </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation de la suppression du compte</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Êtes-vous sûr de vouloir supprimer votre compte ?
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeDeleteModal} isDisabled={isDeleting}>
              Annuler
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleDeleteAccount} isLoading={isDeleting} loadingText="Suppression en cours..." isDisabled={isDeleting}>
              Supprimer mon compte
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManageAccount;
