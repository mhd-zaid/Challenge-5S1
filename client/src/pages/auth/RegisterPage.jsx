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
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    plainPassword: '',
    confirmPassword: '',
    address: '',
    country: '',
    zipcode: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, formData);
      if (response.status === 201) {
        setIsSuccess(true);
        toast({
          title: 'Compte créé',
          description: 'Un email de confirmation a été envoyé à votre adresse email.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setIsSuccess(false);
        setError('Erreur lors de la création du compte.');
      }
    } catch (error) {
      setIsSuccess(false);
      setError('Erreur lors de la création du compte.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} maxWidth="400px" mx="auto">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>Créer un compte</Heading>
      {!isSuccess ? (
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Prénom</FormLabel>
              <Input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Mot de passe</FormLabel>
              <Input
                type="password"
                name="plainPassword"
                value={formData.plainPassword}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Adresse</FormLabel>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Pays</FormLabel>
              <Input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Code postal</FormLabel>
              <Input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" size="lg" isLoading={isLoading}>
              Créer un compte
            </Button>
          </Stack>
        </form>
      ) : (
        <Text color="green.500" textAlign="center" mt={4}>
          Un email de confirmation a été envoyé à votre adresse email.
        </Text>
      )}
      {error && (
        <Text color="red.500" mt={4} textAlign="center">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default RegisterPage;
