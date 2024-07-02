import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Avatar,
  Stack,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import ManageAccount from '@/components/Modal/ManageAccount.jsx';
import BarChartAdmin from '@/components/BarChartAdmin.jsx';
import { useTranslation } from 'react-i18next';

const AdminProfile = ({ user }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);


  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSaveChanges = () => {
    setIsOpen(false);
  };

  return (
    <Box pt="80px" minH="100vh">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        mb={6}
      >
        <Box>
          <Avatar
            size="xl"
            name={`${user.firstname} ${user.lastname}`}
            src="https://bit.ly/broken-link"
            mb={4}
          />
          <Heading as="h1" size="xl" mb={2}>
            {user.firstname} {user.lastname}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {user.email}
          </Text>
          <ManageAccount />
        </Box>
      </Flex>
      <Stack spacing={4}>
        <Box m={4} p={4} bg="white" shadow="md" borderRadius="md">
          <BarChartAdmin />
        </Box>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>
            {t('profile.general-info')}
          </Heading>
          <Text>
            {t('profile.name')}: {user.firstname} {user.lastname}
          </Text>
          <Text>Email: {user.email}</Text>
          <Text>
            {t('profile.phone')}: {user.phone}
          </Text>
        </Box>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>
            {t('profile.roles')}
          </Heading>
          <Text>{t('profile.role')}: Administrateur</Text>
          <Text>
            {t('profile.permissions')}: {t('profile.company-handle')},{' '}
            {t('profile.studio-handle')}, {t('profile.user-handle')},{' '}
            {t('profile.stats-view')}
          </Text>
        </Box>
        <Box p={4} bg="white" shadow="md" borderRadius="md">
          <Heading as="h2" size="md" mb={2}>
            {t('profile.recent-activity')}
          </Heading>
          <Text>{t('profile.last-connection')}: 21 juin 2024</Text>
          <Text>
            {t('profile.recent-actions')}: {t('profile.user-edit')},{' '}
            {t('profile.company-validation')}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default AdminProfile;
