import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  CircularProgress,
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const ManageAccountForm = ({ close }) => {
  const { t } = useTranslation();
  const { user, token, setUser } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false); // État local pour gérer le chargement

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
    },
  });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async values => {
    setIsLoading(true); // Activer le chargement au début de la soumission

    try {
      const response = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        toast({
          title: 'User updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setUser({ ...user, ...values });
        close();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={2} boxShadow="md" borderRadius="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.email} mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.firstname} mb={4}>
          <FormLabel>{t('profile.firstname')}</FormLabel>
          <Input
            type="text"
            {...register('firstname', {
              required: 'First name is required',
            })}
          />
          <FormErrorMessage>
            {errors.firstname && errors.firstname.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.lastname} mb={4}>
          <FormLabel>{t('profile.lastname')}</FormLabel>
          <Input
            type="text"
            {...register('lastname', {
              required: 'Last name is required',
            })}
          />
          <FormErrorMessage>
            {errors.lastname && errors.lastname.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.phone} mb={4}>
          <FormLabel>{t('profile.phone')}</FormLabel>
          <Input
            type="tel"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Invalid phone number',
              },
            })}
          />
          <FormErrorMessage>
            {errors.phone && errors.phone.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={isLoading}
          loadingText="Saving..."
        >
          {t('global.save')}
        </Button>
      </form>
    </Box>
  );
};

export default ManageAccountForm;
