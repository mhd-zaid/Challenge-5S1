import { useState } from 'react';
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
import axios from 'axios';

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false); // Nouvel état pour suivre l'état de l'envoi de l'e-mail

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/users/forget-password/${email}`, {
        email: email
      });
      
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
    <Box p={4} maxWidth="400px" mx="auto">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>Réinitialiser le mot de passe</Heading>
      {!isEmailSent ? (
        <form onSubmit={handleSendEmail}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Adresse e-mail</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" size="lg" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" color="white" /> : "Envoyer l'e-mail de réinitialisation"}
            </Button>
          </Stack>
        </form>
      ) : (
        <Text color="green.500" textAlign="center" mt={4}>Un e-mail de réinitialisation a été envoyé à {email}. Veuillez vérifier votre boîte de réception.</Text>
      )}
      {error && (
        <Text color="red.500" mt={4} textAlign="center">{error}</Text>
      )}
      <Box textAlign="center" mt={6}>
        <Button as={Link} to="/auth/login" variant="link">Retour à la connexion</Button>
        <Button as={Link} to="/auth/signup" variant="link" ml={2}>Créer un compte</Button>
      </Box>
    </Box>
  );
};

export default ForgetPasswordPage;
