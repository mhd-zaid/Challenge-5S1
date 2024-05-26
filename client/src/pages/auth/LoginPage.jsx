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
  useToast,
  Spinner
} from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';


import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false); // Nouvel état pour suivre l'état de renvoi de l'e-mail
  const toast = useToast();
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (response.ok) {
        const { token } = await response.json();
        login(token);
        toast({
          title: 'Connexion réussie',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/profile');
      } else {
        const errorData = await response.json();
        if (errorData.error === 'User is not validated') {
          setError('Votre email n\'a pas encore été validé. Veuillez vérifier votre boîte de réception et valider votre compte.');
        } else {
          setError('Nom d\'utilisateur ou mot de passe incorrect.');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setError('Erreur lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async (e) => {
    e.preventDefault();
    setIsResendingEmail(true); 
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/users/send-email-verification/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        toast({
          title: 'Email de validation renvoyé',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setError('');
      } else {
        setError("Erreur lors de l'envoi du mail.");
      }
    } catch (error) {
      setError("Erreur lors de l'envoi du mail.");
    } finally {
      setIsResendingEmail(false); 
    }
  };

  return (
    <Box p={4} maxWidth="400px" mx="auto">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>Connexion</Heading>
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Link to="/auth/forgetpassword">
            <Button mt={4}>Mot de passe oublié</Button>
          </Link>
          <Button type="submit" colorScheme="blue" size="lg" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" color="white" /> : "Se connecter"}
          </Button>
        </Stack>
      </form>
      {error && (
        <Text color="red.500" mb={4} textAlign="center">
          {error}
          {error === 'Votre email n\'a pas encore été validé. Veuillez vérifier votre boîte de réception et valider votre compte.' && (
            <Button variant="link" onClick={handleResendEmail} disabled={isResendingEmail}>
              {isResendingEmail ? <Spinner size="sm" color="blue.500" /> : "Renvoyer l'email de validation"}
            </Button>
          )}
        </Text>
      )}
      <Link to="/auth/login">
            <Button mt={4}>Créer un compte</Button>
          </Link>
    </Box>
  );
};

export default LoginPage;
