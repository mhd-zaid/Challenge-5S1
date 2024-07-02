import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import ManageAccountForm from '../forms/ManageAccountForm';
import { EditIcon } from '@chakra-ui/icons';
import ModifyPassword from '../forms/ModifyPassword';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const ManageAccount = () => {
  const { t } = useTranslation();
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
          Authorization: `Bearer ${token}`,
        },
      }).then(response => {
        if (response.status === 204) {
          logout();
          navigate('/auth/login');
        }
      });
    } catch (error) {
      toast({
        title: 'Erreur lors de la suppression de votre compte',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  return (
    <>
      <EditIcon
        boxSize={6}
        color="blue.500"
        cursor="pointer"
        onClick={openModal}
      />

      <Modal isOpen={isOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('profile.account-edit')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>{t('profile.my-info')}</Tab>
                <Tab>{t('profile.security')}</Tab>
                <Tab>{t('profile.account-delete')}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ManageAccountForm close={closeModal} />
                </TabPanel>
                <TabPanel>
                  <ModifyPassword close={closeModal} />
                </TabPanel>
                <TabPanel>
                  <Button
                    colorScheme="red"
                    onClick={openDeleteModal}
                    isLoading={isDeleting}
                    loadingText="Suppression en cours..."
                  >
                    {t('profile.account-delete')}
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
          <ModalHeader>
            {t('profile.account-delete-confirmation-title')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{t('profile.account-delete-confirmation-text')}</ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              isDisabled={isDeleting}
            >
              {t('global.cancel')}
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              loadingText="Suppression en cours..."
              isDisabled={isDeleting}
            >
              {t('profile.account-delete')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManageAccount;
