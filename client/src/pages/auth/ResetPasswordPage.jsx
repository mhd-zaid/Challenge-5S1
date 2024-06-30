import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import AuthService from '@/services/AuthService';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const toast = useToast();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const newPassword = watch('newPassword');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await AuthService.check_token(token);
        if (response.status === 200) {
          setIsValidToken(true);
        } else {
          setError('Token invalide. Veuillez vérifier le lien de réinitialisation.');
        }
      } catch (error) {
        setError('Une erreur s\'est produite lors de la vérification du token.');
      }
    };

    verifyToken();
  }, [token]);

  const handleResetPassword = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await AuthService.reset_password(data.newPassword, token);
      if (response.status === 200) {
        toast({
          title: 'Mot de passe réinitialisé',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsPasswordReset(true);
      } else {
        setError('Une erreur s\'est produite lors de la réinitialisation du mot de passe.');
      }
    } catch (error) {
      setError('Une erreur s\'est produite lors de la réinitialisation du mot de passe.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <Box p={4} py={24} maxWidth="400px" mx="auto">
        <Text color="red.500" textAlign="center">{error}</Text>
      </Box>
    );
  }

  if (isPasswordReset) {
    return (
      <Box p={8} py={24} maxWidth="400px" mx="auto">
        <Heading as="h2" size="lg" textAlign="center" mb={6}>Mot de passe réinitialisé</Heading>
        <Text color="green.500" textAlign="center">Votre mot de passe a été réinitialisé avec succès.</Text>
        <Box textAlign="center" mt={4}>
        <Link to="/auth/login">
          <Text textAlign="left" mr={6} fontSize="lg" as="u">
          Retour à la connexion          
          </Text>
        </Link>      
        </Box>
      </Box>
    );
  }

  return (
    <Box p={4} py={24} maxWidth="400px" mx="auto">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>Réinitialisation du mot de passe</Heading>
      <form onSubmit={handleSubmit(handleResetPassword)}>
        <Stack spacing={4}>
          <FormControl isInvalid={errors.newPassword}>
            <FormLabel>Nouveau mot de passe</FormLabel>
            <Input
              type="password"
              placeholder='Nouveau mot de passe'
              {...register('newPassword', {
                required: 'Le nouveau mot de passe est obligatoire',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères'
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial'
                }
              })}
            />
            {errors.newPassword && <Text color="red.500" mt={2}>{errors.newPassword.message}</Text>}
          </FormControl>
          <FormControl isInvalid={errors.confirmPassword}>
            <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
            <Input
              type="password"
              placeholder='Confirmer le nouveau mot de passe'
              {...register('confirmPassword', {
                required: 'Veuillez confirmer le nouveau mot de passe',
                validate: value => value === newPassword || 'Les mots de passe ne correspondent pas'
              })}
            />
            {errors.confirmPassword && <Text color="red.500" mt={2}>{errors.confirmPassword.message}</Text>}
          </FormControl>
          <Button type="submit" colorScheme="blue" size="lg" isLoading={isLoading}>
            Réinitialiser le mot de passe
          </Button>
        </Stack>
      </form>
      {error && (
        <Text color="red.500" mt={4} textAlign="center">{error}</Text>
      )}
      <Box  mt={4}>
        <Link to="/auth/login">
          <Text textAlign="left" mr={6} fontSize="lg" as="u">
          Retour à la connexion          
          </Text>
        </Link>      
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
