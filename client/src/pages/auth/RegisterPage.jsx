import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`,{
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phoneNumber,
        plainPassword: data.password,
      },
      {
        headers: {
          'Content-Type': 'application/ld+json',
        },
      });
      if (response.status === 201) {
        setIsAccountCreated(true);
      } else {
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la création du compte.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création du compte.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} maxWidth="400px" mx="auto">
      {isAccountCreated ? (
        <Box textAlign="center">
          <Heading as="h2" size="lg" mb={6}>Compte créé</Heading>
          <Text>Un email de confirmation a été envoyé à votre adresse email. Veuillez vérifier votre email pour confirmer votre compte.</Text>
        </Box>
      ) : (
        <>
          <Heading as="h2" size="lg" textAlign="center" mb={6}>Créer un compte</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={errors.firstname}>
                <FormLabel>Prénom</FormLabel>
                <Input
                  type="text"
                  placeholder="Entrez votre prénom"
                  {...register('firstname', {
                    required: 'Le prénom est obligatoire',
                  })}
                />
                {errors.firstname && <Text color="red.500" mt={2}>{errors.firstname.message}</Text>}
              </FormControl>
              <FormControl isInvalid={errors.lastname}>
                <FormLabel>Nom</FormLabel>
                <Input
                  type="text"
                  placeholder="Entrez votre nom"
                  {...register('lastname', {
                    required: 'Le nom est obligatoire',
                  })}
                />
                {errors.lastname && <Text color="red.500" mt={2}>{errors.lastname.message}</Text>}
              </FormControl>
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Entrez votre adresse email"
                  {...register('email', {
                    required: 'L\'adresse email est obligatoire',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Adresse email invalide'
                    }
                  })}
                />
                {errors.email && <Text color="red.500" mt={2}>{errors.email.message}</Text>}
              </FormControl>
              <FormControl isInvalid={errors.phoneNumber}>
                <FormLabel>Numéro de téléphone</FormLabel>
                <Input
                  type="tel"
                  placeholder="Entrez votre numéro de téléphone"
                  {...register('phoneNumber', {
                    required: 'Le numéro de téléphone est obligatoire',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Numéro de téléphone invalide'
                    }
                  })}
                />
                {errors.phoneNumber && <Text color="red.500" mt={2}>{errors.phoneNumber.message}</Text>}
              </FormControl>
              <FormControl isInvalid={errors.password}>
                <FormLabel>Mot de passe</FormLabel>
                <Input
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  {...register('password', {
                    required: 'Le mot de passe est obligatoire',
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
                {errors.password && <Text color="red.500" mt={2}>{errors.password.message}</Text>}
              </FormControl>
              <FormControl isInvalid={errors.confirmPassword}>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  {...register('confirmPassword', {
                    required: 'Veuillez confirmer le mot de passe',
                    validate: value => value === password || 'Les mots de passe ne correspondent pas'
                  })}
                />
                {errors.confirmPassword && <Text color="red.500" mt={2}>{errors.confirmPassword.message}</Text>}
              </FormControl>
              <Button type="submit" colorScheme="blue" size="lg" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : 'Créer un compte'}
              </Button>
            </Stack>
          </form>
      <Box  mt={4}>
        <Link to="/auth/login">
          <Text textAlign="left" mr={6} fontSize="lg" as="u">
          Retour à la connexion          
          </Text>
        </Link>      
      </Box>
        </>
      )}
    </Box>
  );
};

export default RegisterPage;
