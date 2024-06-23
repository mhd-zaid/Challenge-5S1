import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Spinner
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AuthService from '@/services/AuthService';

const ForgetPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSendEmail = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await AuthService.forget_password(data.email);
      if (response.status === 200) {
        setIsEmailSent(true);
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de l'envoi de l'e-mail de réinitialisation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} py={24} maxWidth="400px" mx="auto">
      <Heading as="h2" size="lg" textAlign="center" mb={2}>Réinitialiser le mot de passe</Heading>
      {!isEmailSent ? (
        <form onSubmit={handleSubmit(handleSendEmail)}>
          <Stack spacing={4}>
            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Email"
                {...register('email', {
                  required: 'Email obligatoire',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Adresse e-mail invalide'
                  }
                })}
              />
              {errors.email && <Text color="red.500" mt={2}>{errors.email.message}</Text>}
            </FormControl>
            <Button type="submit" colorScheme="blue" size="lg" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" color="white" /> : "Envoyer l'e-mail de réinitialisation"}
            </Button>
          </Stack>
        </form>
      ) : (
        <Text color="green.500" textAlign="center" mt={4}>Un e-mail de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.</Text>
      )}
      {error && (
        <Text color="red.500" mt={4} textAlign="center">{error}</Text>
      )}
      <Box mt={4} pt={4}>
        <Link to="/auth/login">
          <Text textAlign="left" mr={6} fontSize="lg" as="u">
          Retour à la connexion          
          </Text>
        </Link>

        <Link to="/auth/signup">
        <Text textAlign="left" fontSize="lg" as="u">
          Créer un compte          
        </Text>
        </Link>
      </Box>
    </Box>
  );
};

export default ForgetPasswordPage;
