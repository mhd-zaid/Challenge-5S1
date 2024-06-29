import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage, FormHelperText,
  FormLabel, Heading,
  Input,
  InputGroup, InputLeftElement,
  Select, SimpleGrid,
  Text, Textarea, useToast, VStack,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext.jsx';

const FormUser = ({user, onSubmitForm}) => {
  const { token } = useAuth();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({});
  const [isEditable, setIsEditable] = useState(!user);
  const [userData, setUserDate] = useState(user);

  async function updateUser(data) {
    const response = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + user['@id'], {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/merge-patch+json'
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.error) {
      console.error('error', result.error);
    }
  }

  const onSubmit = async (values) => {
    const confirmAction = confirm('Etes-vous sûr de vouloir enregistrer ces modifications ?');
    if (!confirmAction) {
      return;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        updateUser(values)
        resolve()
      }, 1000)
    }).then(() => {
      onSubmitForm(true);
      toast({
        title: 'Modifications enregistrées',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} aria-autocomplete={"both"} autoComplete={"on"} autoSave={"on"}>

        <Box>
          <Heading as='h2' size='sm' textAlign='center' mb={10}>
            Entreprise - {user?.company?.name}
          </Heading>
          <Flex gap={8}>
            <Box w='50%'>
              {/* Champ Nom */}
              <FormControl isInvalid={errors.lastname} isRequired>
                <FormLabel htmlFor='lastname'>Nom</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='lastname'
                  autoFocus={true}
                  autoComplete={"lastname"}
                  placeholder='Entrer votre nom'
                  defaultValue={user?.lastname}
                  {...register('lastname', {
                    required: 'Ce champ est requis',
                    minLength: { value: 2, message: 'La longueur minimale est de 2 caractères' },
                  })}
                />
                <FormErrorMessage>
                  {errors.lastname && errors.lastname.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{user?.lastname}</Text>
            )}
              </FormControl>
            </Box>
            <Box w='50%'>
              {/* Champ Prénom */}
              <FormControl isInvalid={errors.firstname} isRequired>
                <FormLabel htmlFor='firstname'>Prénom</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='firstname'
                  placeholder='Entrer votre prénom'
                  defaultValue={user?.firstname}
                  autoComplete={"given-name"}
                  {...register('firstname', {
                    required: 'Ce champ est requis',
                    minLength: { value: 4, message: 'La longueur minimale est de 4 caractères' },
                  })}
                />
                <FormErrorMessage>
                  {errors.firstname && errors.firstname.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{user?.firstname}</Text>
            )}
              </FormControl>
            </Box>
          </Flex>
          <Flex gap={8}>
            <Box w='50%'>
              {/* Champ Téléphone Portable */}
              <FormControl isInvalid={errors.phone} mt={4} isRequired>
                <FormLabel htmlFor='phone'>Téléphone Portable</FormLabel>
            {isEditable ? (
              <>
                <InputGroup>
                  <InputLeftElement>
                    <Icon icon="twemoji:flag-for-flag-france" />
                  </InputLeftElement>
                  <Input
                    id='phone'
                    placeholder='06XXXXXXXX'
                    defaultValue={user?.phone}
                    autoComplete={"tel"}
                    {...register('phone', {
                      required: 'Ce champ est requis',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Numéro de téléphone invalide, il doit contenir 10 chiffres',
                      },
                    })}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.phone && errors.phone.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{user?.phone}</Text>
            )}
              </FormControl>
            </Box>
            <Box w='50%'>
              {/* Champ Email */}
              <FormControl isInvalid={errors.email} mt={4} isRequired>
                  <FormLabel htmlFor='email'>Email</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='email'
                  type='email'
                  placeholder='Email'
                  defaultValue={user?.email}
                  autoComplete={"email"}
                  {...register('email', {
                    required: 'Ce champ est requis',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Adresse email invalide',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{user?.email}</Text>
            )}
              </FormControl>
            </Box>
          </Flex>

          <Flex p={4} gap={4} justifyContent={"end"}>
            <Button bg="black" color='white' isLoading={isSubmitting} type='submit'>
              Enregistrer
            </Button>
            <Button variant={"outline"} onClick={() => onSubmitForm(false)}>
              Annuler
            </Button>
          </Flex>
        </Box>

      </form>
    </>
  )
}

export default FormUser;