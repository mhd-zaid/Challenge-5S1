import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Heading,
  Text,
  useToast,
  RadioGroup,
  Radio,
  HStack
} from '@chakra-ui/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const getFeedback = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feedback/${id}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const FeedbackForm = () => {
    const { id } = useParams();
    const [feedback, setFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const toast = useToast();

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const fetchedFeedback = await getFeedback(id);
                setFeedback(fetchedFeedback);
            } catch (error) {
                toast({
                    title: 'Erreur',
                    description: 'Impossible de charger le feedback.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        fetchFeedback();
    }, [id, toast]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                },
                body: JSON.stringify({
                    rating: parseInt(data.rating),
                    message: data.message,
                }),
            });
            if (response.status === 200) {
                toast({
                    title: 'Succès',
                    description: 'Feedback envoyé avec succès.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Erreur',
                    description: 'Erreur lors de l\'envoi du feedback.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Erreur',
                description: 'Erreur lors de l\'envoi du feedback.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!feedback) {
        return <Box p={4}>Chargement...</Box>;
    }
    
    if (feedback.reservation.status !== 'COMPLETED') {
        return (
            <Box p={4} maxWidth="500px" mx="auto">
                <Heading as="h2" size="lg" textAlign="center" mb={10} mt={20}>Vous ne pouvez pas donner un feedback pour cette réservation</Heading>
            </Box>
        );
    }

    if (feedback.note == null) {
        return (
            <Box p={4} maxWidth="500px" mx="auto">
                <Heading as="h2" size="lg" textAlign="center" mb={6} mt={16}>Donnez nous votre avis</Heading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Note</FormLabel>
                            <RadioGroup defaultValue="1">
                                <HStack spacing="24px">
                                    <Radio {...register('rating')} value="1">1</Radio>
                                    <Radio {...register('rating')} value="2">2</Radio>
                                    <Radio {...register('rating')} value="3">3</Radio>
                                    <Radio {...register('rating')} value="4">4</Radio>
                                    <Radio {...register('rating')} value="5">5</Radio>
                                </HStack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl isInvalid={errors.message}>
                            <FormLabel>Message</FormLabel>
                            <Textarea
                                placeholder="Votre feedback"
                                {...register('message', {
                                    required: 'Le message est obligatoire',
                                })}
                            />
                            {errors.message && <Text color="red.500" mt={2}>{errors.message.message}</Text>}
                        </FormControl>
                        <Button type="submit" colorScheme="blue" size="lg" isLoading={isLoading} disabled={isLoading}>
                            Envoyer
                        </Button>
                    </Stack>
                </form>
            </Box>
        );
    } else {
        return (
            <Box p={4} maxWidth="500px" mx="auto">
                <Heading as="h2" size="lg" textAlign="center" mb={6} mt={16}>Feedback déjà envoyé</Heading>
            </Box>
        );
    }
};

export default FeedbackForm;