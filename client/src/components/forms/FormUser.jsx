import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel, Heading,
  Input,
  InputGroup, InputLeftElement,
  useToast, Select
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext.jsx';

const FormUser = ({ user, onSubmitForm }) => {
  const { token, isAdministrator } = useAuth();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      lastname: user?.lastname || '',
      firstname: user?.firstname || '',
      phone: user?.phone || '',
      email: user?.email || '',
      roles: user?.roles[0] || '',
    }
  });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  async function processUser(data) {
    if (user) {
      const response = await fetch(BASE_URL + '/users/' + user['@id'].split('/')[3], {
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
    } else {
      const response = await fetch(BASE_URL + '/users', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/ld+json'
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.error) {
        console.error('error', result.error);
      }
    }
  }

  const onSubmit = async (values) => {
    const confirmAction = confirm('Etes-vous sûr de vouloir enregistrer ces modifications ?');
    if (!confirmAction) {
      return;
    }

    await processUser(values).then(() => {
      onSubmitForm(false);
      toast({
        title: 'Modifications enregistrées',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
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
                <Input
                  id='lastname'
                  autoFocus={true}
                  autoComplete={"lastname"}
                  placeholder='Entrer votre nom'
                  {...register('lastname', {
                    required: 'Ce champ est requis',
                    minLength: { value: 2, message: 'La longueur minimale est de 2 caractères' },
                  })}
                />
                <FormErrorMessage>
                  {errors.lastname && errors.lastname.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box w='50%'>
              {/* Champ Prénom */}
              <FormControl isInvalid={errors.firstname} isRequired>
                <FormLabel htmlFor='firstname'>Prénom</FormLabel>
                <Input
                  id='firstname'
                  placeholder='Entrer votre prénom'
                  autoComplete={"given-name"}
                  {...register('firstname', {
                    required: 'Ce champ est requis',
                    minLength: { value: 4, message: 'La longueur minimale est de 4 caractères' },
                  })}
                />
                <FormErrorMessage>
                  {errors.firstname && errors.firstname.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>
          <Flex gap={8}>
            <Box w='50%'>
              {/* Champ Téléphone Portable */}
              <FormControl isInvalid={errors.phone} mt={4} isRequired>
                <FormLabel htmlFor='phone'>Téléphone Portable</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon icon="twemoji:flag-for-flag-france" />
                  </InputLeftElement>
                  <Input
                    id='phone'
                    placeholder='06XXXXXXXX'
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
              </FormControl>
            </Box>
            <Box w='50%'>
              {/* Champ Email */}
              <FormControl isInvalid={errors.email} mt={4} isRequired>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='Email'
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
              </FormControl>
            </Box>
            <Box w='50%'>
              <FormControl mt={4} isRequired>
                <FormLabel htmlFor='roles'>Role</FormLabel>
                <Select
                id='roles'
                placeholder="Role"
                {...register('roles', {
                  required: 'Ce champ est requis',
                })}
              >
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_PRESTA">Prestataire</option>
                <option value="ROLE_EMPLOYEE">Employé</option>
                <option value="ROLE_CUSTOMER">Client</option>
              </Select>
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
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
