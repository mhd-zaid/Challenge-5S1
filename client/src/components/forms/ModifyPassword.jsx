import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  VStack,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const ModifyPassword = ({ close }) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();
  const toast = useToast();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const newPassword = watch('newPassword', '');

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async values => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plainPassword: values.newPassword,
        }),
      });

      if (response.status === 200) {
        toast({
          title: 'Mot de passe mis à jour',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Échec de la mise à jour du mot de passe');
      }
    } catch (error) {
      toast({
        title: 'Erreur dans la mise à jour du mot de passe',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      close();
      setIsSubmitting(false);
    }
  };

  return (
    <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.newPassword} isRequired>
        <FormLabel>{t('auth.new-pwd')}</FormLabel>
        <Input
          type="password"
          placeholder={t('auth.new-pwd')}
          {...register('newPassword', {
            required: 'Ce champ est requis',
            minLength: {
              value: 8,
              message: 'Le mot de passe doit contenir au moins 8 caractères',
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
            },
          })}
        />
        <FormErrorMessage>
          {errors.newPassword && errors.newPassword.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.confirmPassword} isRequired>
        <FormLabel>{t('auth.confirm-pwd')}</FormLabel>
        <Input
          type="password"
          placeholder="Confirmer le nouveau mot de passe"
          {...register('confirmPassword', {
            required: 'Ce champ est requis',
            validate: value =>
              value === newPassword || 'Les mots de passe ne correspondent pas',
          })}
        />
        <FormErrorMessage>
          {errors.confirmPassword && errors.confirmPassword.message}
        </FormErrorMessage>
      </FormControl>

      <Button
        w={'full'}
        type="submit"
        isLoading={isSubmitting}
        loadingText="En cours..."
        spinner={<Spinner size="sm" />}
      >
        {t('auth.pwd-edit')}
      </Button>
    </VStack>
  );
};

export default ModifyPassword;
