import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, Center, Heading, Text, Spinner } from '@chakra-ui/react';
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
          <Text color="green.600">Your email has been successfully verified!</Text>
        )}
        {verificationStatus === 'error' && (
          <Text color="red.600">An error occurred while verifying your email.</Text>
        )}
        {verificationStatus !== 'pending' && (
          <Link to="/auth/login">
            <Button mt={4}>Go to Login</Button>
          </Link>
        )}
      </Box>
    </Center>
  );
};

export default EmailVerifiedPage;
