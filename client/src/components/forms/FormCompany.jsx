import { useForm } from 'react-hook-form';
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

const FormCompany = ({company, onSubmitForm}) => {
  const { token } = useAuth();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({});

  async function updateCompany(data) {

    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/companies/' + company.id, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/merge-patch+json'
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('result', result);

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
        updateCompany(values)
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
            Informations sur l'entreprise
          </Heading>
          {/* Champ Nom de l'entreprise */}
          <FormControl isInvalid={errors.name} mt={4} isRequired>
            <FormLabel htmlFor='name'>Nom de l'entreprise</FormLabel>
            <Input
              id='name'
              autoFocus={true}
              placeholder='Entrer le nom de votre entreprise'
              defaultValue={company?.name}
              {...register('name', {
                required: 'Ce champ est requis',
                minLength: { value: 4, message: 'La longueur minimale est de 4 caractères' },
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          {/* Description de l'entreprise */}
          <FormControl isInvalid={errors.description} mt={4} isRequired>
            <FormLabel htmlFor='description'>Description de l'entreprise</FormLabel>
            <Textarea
              id='description'
              placeholder="Entrer une description de l'entreprise"
              defaultValue={company?.description}
              {...register('description', {
                required: 'Ce champ est requis',
              })}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>

          <Flex gap={8}>
            <Box w='50%'>
              {/* Code Postal */}
              <FormControl isInvalid={errors.zipCode} mt={4} isRequired>
                <FormLabel htmlFor='zipCode'>Code Postal</FormLabel>
                <Input
                  id='zipCode'
                  placeholder='XXXXX'
                  defaultValue={company?.zipCode}
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
            <Box w='50%'>
              {/*Ville*/}
              <FormControl isInvalid={errors.city} mt={4} isRequired>
                <FormLabel htmlFor='city'>Ville</FormLabel>
                <Input
                  id='city'
                  placeholder='Entrer la ville'
                  defaultValue={company?.city}
                  {...register('city', {
                    required: 'Ce champ est requis',
                  })}
                />
                <FormErrorMessage>
                  {errors.city && errors.city.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Flex>

          <Flex gap={8}>
            <Box w='50%'>
              {/* Champ Téléphone Portable */}
              <FormControl isInvalid={errors.phone} mt={4} isRequired>
                <FormLabel htmlFor='phone'>Téléphone</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon icon="twemoji:flag-for-flag-france" />
                  </InputLeftElement>
                  <Input
                    id='phone'
                    placeholder='01XXXXXXXX'
                    defaultValue={company?.phone}
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
                  defaultValue={company?.email}
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
          </Flex>

          <Flex gap={8}>
            <Box w='50%'>
              {/* Numéro de siren */}
              <FormControl mt={4}>
                <FormLabel htmlFor='siren'>Numéro de siren</FormLabel>
                <Input
                  disabled={true}
                  id='siren'
                  placeholder='Entrer votre numéro de siren'
                  value={company?.siren}
                />
              </FormControl>
            </Box>
          </Flex>

          <FormControl isInvalid={errors.website} mt={4}>
            <FormLabel htmlFor='website'>Site web de l'entreprise</FormLabel>
            <Input
              id='website'
              type='url'
              placeholder="Entrer le site web de l'entreprise"
              defaultValue={company?.website}
              autoComplete={"url"}
              {...register('website')}
            />
            <FormErrorMessage>
              {errors.website && errors.website.message}
            </FormErrorMessage>
          </FormControl>

          {/* Réseaux sociaux de l'entreprise */}
          <FormControl isInvalid={errors.socialMedia} mt={4}>
            <FormLabel htmlFor='socialMedia'>Réseaux sociaux de l'entreprise</FormLabel>
            <Input
              id='socialMedia'
              type='url'
              placeholder="Entrer les réseaux sociaux de l'entreprise"
              defaultValue={company?.socialMedia}
              autoComplete={"url"}
              {...register('socialMedia')}
            />
            <FormErrorMessage>
              {errors.socialMedia && errors.socialMedia.message}
            </FormErrorMessage>
          </FormControl>

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

export default FormCompany;