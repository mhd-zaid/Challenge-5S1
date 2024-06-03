import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Heading,
  Text,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BiShowAlt, BiHide  } from "react-icons/bi";


import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false); // Nouvel état pour suivre l'état de renvoi de l'e-mail
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(validForm()){
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
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
          setError({
            api:'Votre email n\'a pas encore été validé. Veuillez vérifier votre boîte de réception et valider votre compte.'
        });
        } else {
          setError({
            api:'Nom d\'utilisateur ou mot de passe incorrect.'}
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setError({
        api: 'Erreur lors de la connexion.'});
    } finally {
      setIsLoading(false);
    }
  }
  };

  const validForm = () => {
    let errors = {};
    if (!email) {
      errors.email = "Email requis";
    }
    if (!password) {
      errors.password = "Le mot de passe est requis";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  }

  const handleResendEmail = async (e) => {
    e.preventDefault();
    setIsResendingEmail(true); 
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/users/send-email-verification/${email}`, {
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
        setError({
          apiMail: "Erreur lors de l'envoi du mail."
      });
      }
    } catch (error) {
      setError({
        apiMail: "Erreur lors de l'envoi du mail."});
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && <Text color="red.500" mb={4} pt={1}>
            {error.email}
          </Text> }

          </FormControl>
          <FormControl>
            <FormLabel>Mot de passe</FormLabel>
            <InputGroup size='md'>
            <Input
              type={show ? 'text' : 'password'}
              placeholder='Mot de passe'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputRightElement width='4.5rem'>
            {show ? <BiShowAlt onClick={()=> {setShow(!show)}}/> : <BiHide onClick={()=> {setShow(!show)}}/>}
            </InputRightElement>  
            </InputGroup>
            
            {error.password && <Text color="red.500" mb={4} pt={1}>
            {error.password}
            </Text> }
          
          </FormControl>
          <Link to="/auth/forgetpassword">
            <Button mt={4}>Mot de passe oublié</Button>
          </Link>
          <Button type="submit" bg="black" size="lg" color="white">
            {isLoading ? <Spinner size="sm" color="white" /> : "Se connecter"}
          </Button>
        </Stack>
      </form>
      {error.api && (
        <Text color="red.500" mb={4} textAlign="center">
          {error.api}
          {error.api === 'Votre email n\'a pas encore été validé. Veuillez vérifier votre boîte de réception et valider votre compte.' && (
            <Button variant="link" onClick={handleResendEmail} disabled={isResendingEmail}>
              {isResendingEmail ? <Spinner size="sm" color="blue.500" /> : "Renvoyer l'email de validation"}
            </Button>
          )}
        </Text>
      )}
      <Text textAlign="center" mt={4}>
        Pas encore de compte ?
      </Text>
      <Link to="/auth/login">
        <Button size="lg" mt={4}>Créer un compte</Button>
      </Link>
    </Box>
  );
};

export default LoginPage;
