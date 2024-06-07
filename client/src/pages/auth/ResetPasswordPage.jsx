import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import du composant Link pour créer un lien
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
import AuthService from '@/services/AuthService';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const toast = useToast();

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await AuthService.reset_password(newPassword, token);
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
      <Box p={4} maxWidth="400px" mx="auto">
        <Text color="red.500" textAlign="center">{error}</Text>
      </Box>
    );
  }

  if (isPasswordReset) {
    return (
      <Box p={4} maxWidth="400px" mx="auto">
        <Heading as="h2" size="lg" textAlign="center" mb={6}>Mot de passe réinitialisé</Heading>
        <Text color="green.500" textAlign="center">Votre mot de passe a été réinitialisé avec succès.</Text>
        <Box textAlign="center" mt={4}>
          <Button colorScheme="blue" as={Link} to="/auth/login">Retour à la connexion</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={4} maxWidth="400px" mx="auto">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>Réinitialisation du mot de passe</Heading>
      <form onSubmit={handleResetPassword}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Nouveau mot de passe</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" size="lg" isLoading={isLoading}>
            Réinitialiser le mot de passe
          </Button>
        </Stack>
      </form>
      {error && (
        <Text color="red.500" mt={4} textAlign="center">{error}</Text>
      )}
      <Box textAlign="center" mt={4}>
        <Button colorScheme="blue" as={Link} to="/auth/login">Retour à la connexion</Button>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
