import { useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup, InputLeftElement,
  Select,
  Text
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { apiService } from '@/services/apiService.js';
import z from 'zod';

const FormCompany = () => {
  const [listIxServices, setListIxServices] = useState([]);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({});


  function onSubmit(values) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2))
        resolve()
      }, 2000)
    })
  }

  const getIxServices = async () => {
    const data = await apiService.getAll("services").then((data) => data['hydra:member']);
    // const companyVerify = fetch("https://localhost/api/companyVerify", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ siret: "12345678945612" }),
    // })
    // console.log('companyVerify', companyVerify);
    setListIxServices(data);
  }

  useEffect(() => {
    getIxServices();
    console.log('listIxServices', listIxServices);
  }, []);

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
      <form onSubmit={handleSubmit(onSubmit)} aria-autocomplete={"both"} autoComplete={"on"}>
        <Flex>
          <Box w='50%' pr={2}>
            {/* Champ Nom */}
            <FormControl isInvalid={errors.name} isRequired>
              <FormLabel htmlFor='nom'>Nom</FormLabel>
              <Input
                id='nom'
                autoFocus={true}
                autoComplete={"name"}
                placeholder='Entrer votre nom'
                {...register('name', {
                  required: 'Ce champ est requis',
                  minLength: { value: 2, message: 'La longueur minimale est de 2 caractères' },
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box w='50%' pl={2}>
            {/* Champ Prénom */}
            <FormControl isInvalid={errors.firstname} isRequired>
              <FormLabel htmlFor='name'>Prénom</FormLabel>
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

        <Flex>
          <Box w='50%' pr={2}>
            {/* Champ Code Postal */}
            <FormControl isInvalid={errors.codePostal} mt={4} isRequired>
              <FormLabel htmlFor='codePostal'>Code Postal</FormLabel>
              <Input
                id='codePostal'
                placeholder='XXXXX'
                autoComplete={"postal-code"}
                {...register('codePostal', {
                  required: 'Ce champ est requis',
                  pattern: {
                    value: /^[0-9]{5}$/,
                    message: 'Code postal invalide, il doit contenir 5 chiffres',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.codePostal && errors.codePostal.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box w='50%' pl={2}>
            {/* Champ Téléphone Portable */}
            <FormControl isInvalid={errors.telephone} mt={4} isRequired>
              <FormLabel htmlFor='telephone'>Téléphone Portable</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon icon="twemoji:flag-for-flag-france" />
                </InputLeftElement>
                <Input
                  id='telephone'
                  placeholder='06XXXXXXXX'
                  autoComplete={"tel"}
                  {...register('telephone', {
                    required: 'Ce champ est requis',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Numéro de téléphone invalide, il doit contenir 10 chiffres',
                    },
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.telephone && errors.telephone.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
        </Flex>

        {/* Champ Votre Spécialité */}
        <FormControl isInvalid={errors.specialite} mt={4} isRequired>
          <FormLabel htmlFor='specialite'>Votre spécialité</FormLabel>
          <Select
            id='specialite'
            placeholder='- Selectionner -'
            {...register('specialite', {
              required: 'Ce champ est requis',
            })}
          >
            {listIxServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.specialite && errors.specialite.message}
          </FormErrorMessage>
        </FormControl>

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
          <FormLabel htmlFor='kbis'>Fichier KBIS</FormLabel>
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
                  return validExtensions.includes(extension);
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