import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage, FormHelperText,
  FormLabel,
  Input,
  InputGroup, InputLeftElement,
  Select,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const FormCompany = () => {
  const [listIxServices, setListIxServices] = useState([]);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({});
  
  async function createCompany(data) {
    const formData = new FormData();
    formData.append('ownerName', data.ownerName);
    formData.append('ownerFirstname', data.ownerFirstname);
    formData.append('zipCode', data.zipCode);
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    formData.append('name', data.name);
    formData.append('siret', data.siret);
    formData.append('kbis', data.kbis[0]);

    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
      },
      // mode: 'no-cors',
      body: formData,
    });

    const result = await response.json();

    if (result.error) {
      console.error('error', result.error);
    } else {

    }
  }

  const onSubmit = async (values) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2))
        createCompany(values)
        resolve()
      }, 2000)
    });
  }

  return (
    <Box
      p={10}
      borderWidth='1px'
      borderRadius='lg'
      boxShadow='lg'
      bg='white'
      w='100%'
      maxW='600px'
      mx='auto'
      mt={8}
      rounded='md'
    >
      <Text fontSize='xl' mb={10} textAlign={"center"}>
        Vous êtes un professionnel de l'image et vous souhaitez rejoindre notre réseau de photographes et vidéastes ?
      </Text>
      <form onSubmit={handleSubmit(onSubmit)} aria-autocomplete={"both"} autoComplete={"on"} autoSave={"on"}>
        <Flex>
          <Box w='50%' pr={2}>
            {/* Champ Nom */}
            <FormControl isInvalid={errors.ownerName} isRequired>
              <FormLabel htmlFor='nom'>Nom</FormLabel>
              <Input
                id='ownerName'
                autoFocus={true}
                autoComplete={"ownerName"}
                placeholder='Entrer votre nom'
                {...register('ownerName', {
                  required: 'Ce champ est requis',
                  minLength: { value: 2, message: 'La longueur minimale est de 2 caractères' },
                })}
              />
              <FormErrorMessage>
                {errors.ownerName && errors.ownerName.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box w='50%' pl={2}>
            {/* Champ Prénom */}
            <FormControl isInvalid={errors.ownerFirstname} isRequired>
              <FormLabel htmlFor='ownerFirstname'>Prénom</FormLabel>
              <Input
                id='ownerFirstname'
                placeholder='Entrer votre prénom'
                autoComplete={"given-name"}
                {...register('ownerFirstname', {
                  required: 'Ce champ est requis',
                  minLength: { value: 4, message: 'La longueur minimale est de 4 caractères' },
                })}
              />
              <FormErrorMessage>
                {errors.ownerFirstname && errors.ownerFirstname.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
        </Flex>

        <Flex>
          <Box w='50%' pr={2}>
            {/* Champ Code Postal */}
            <FormControl isInvalid={errors.zipCode} mt={4} isRequired>
              <FormLabel htmlFor='zipCode'>Code Postal</FormLabel>
              <Input
                id='zipCode'
                placeholder='XXXXX'
                autoComplete={"postal-code"}
                {...register('zipCode', {
                  required: 'Ce champ est requis',
                  pattern: {
                    value: /^[0-9]{5}$/,
                    message: 'Code postal invalide, il doit contenir 5 chiffres',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.zipCode && errors.zipCode.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box w='50%' pl={2}>
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
        </Flex>

        {/* Champ Email */}
        <FormControl isInvalid={errors.email} mt={4} isRequired>
          <Flex alignContent={"center"}>
            <FormLabel htmlFor='email'>Email</FormLabel>
          </Flex>
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

        {/* Champ Nom de l'entreprise */}
        <FormControl isInvalid={errors.name} mt={4} isRequired>
          <FormLabel htmlFor='name'>Nom de l'entreprise</FormLabel>
          <Input
            id='name'
            placeholder='Entrer le nom de votre entreprise'
            {...register('name', {
              required: 'Ce champ est requis',
              minLength: { value: 4, message: 'La longueur minimale est de 4 caractères' },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        {/* Numéro de siret */}
        <FormControl isInvalid={errors.siret} mt={4} isRequired>
          <FormLabel htmlFor='siret'>Numéro de siret</FormLabel>
          <Input
            id='siret'
            placeholder='Entrer votre numéro de siret'
            {...register('siret', {
              required: 'Ce champ est requis',
              pattern: {
                value: /^[0-9]{14}$/,
                message: 'Numéro de siret invalide, il doit contenir 14 chiffres',
              },
            })}
          />
          <FormErrorMessage>
            {errors.siret && errors.siret.message}
          </FormErrorMessage>
        </FormControl>

        {/* Fichier KBIS */}
        <FormControl isInvalid={errors.kbis} mt={4} isRequired>
          <FormLabel htmlFor='kbis'>Fichier KBIS (.pdf)</FormLabel>
          <Input
            id='kbis'
            type='file'
            onChange={(e) => {
              console.log('e.target.files', e.target.files);
            }}
            {...register('kbis', {
              required: 'Ce champ est requis',
              validate: {
                isImage: (value) => {
                  const validExtensions = ['pdf'];
                  const extension = value[0].name.split('.').pop();
                  if(!validExtensions.includes(extension)) {
                    return 'Le fichier doit être un PDF';
                  }
                },
              },
            })}
          />
          <FormErrorMessage>
            {errors.kbis && errors.kbis.message}
          </FormErrorMessage>
        </FormControl>


        <Button mt={10} bg="black" color='white' isLoading={isSubmitting} type='submit' w={"full"}>
          Découvrir gratuitement
        </Button>
      </form>
    </Box>
  )
}

export default FormCompany;