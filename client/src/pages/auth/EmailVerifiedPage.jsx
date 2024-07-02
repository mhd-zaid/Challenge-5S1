import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Center, Heading, Text, Spinner } from '@chakra-ui/react';
import AuthService from '@/services/AuthService';

const EmailVerifiedPage = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('pending');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await AuthService.verify_email(token);
        if (response.status === 200) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Center h="100vh">
      <Box textAlign="center">
        <Heading mb={4}>Email Verification</Heading>
        {verificationStatus === 'pending' && <Spinner size="xl" color="blue.500" />}
        {verificationStatus === 'success' && (
          <Text textAlign="center" color="green.600">Email vérifié !</Text>
        )}
        {verificationStatus === 'error' && (
          <Text textAlign="center" color="red.600">Une erreur s'est produite durant la vérification.</Text>
        )}
        {verificationStatus !== 'pending' && (
          <Link to="/auth/login">
            <Text textAlign="center" as='u' mt={4}>
              Page de connexion
            </Text>
          </Link>
        )}
      </Box>
    </Center>
  );
};

export default EmailVerifiedPage;
