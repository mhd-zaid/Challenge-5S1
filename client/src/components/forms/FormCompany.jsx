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
import { useState } from 'react';

const FormCompany = ({company, onSubmitForm}) => {
  const { token } = useAuth();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({});
  const [isEditable, setIsEditable] = useState(!company);
  const [companyData, setCompanyData] = useState(company);

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

    if (result.error) {
      console.error('error', result.error);
    }else {
      setIsEditable(false);
      setCompanyData(result);
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
        <Box py={4}>
          <Heading as='h2' size='sm' textAlign='center' mb={10}>
            Informations sur l'entreprise
          </Heading>
          {/* Champ Nom de l'entreprise */}
          <FormControl isInvalid={errors.name} mt={4} isRequired={isEditable}>
            <FormLabel htmlFor='name'>Nom de l'entreprise</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='name'
                  autoFocus={true}
                  placeholder='Entrer le nom de votre entreprise'
                  defaultValue={companyData?.name}
                  {...register('name', {
                    required: 'Ce champ est requis',
                    minLength: { value: 4, message: 'La longueur minimale est de 4 caractères' },
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{companyData?.name}</Text>
            )}
          </FormControl>

          {/* Description de l'entreprise */}
          <FormControl isInvalid={errors.description} mt={4} isRequired={isEditable}>
            <FormLabel htmlFor='description'>Description de l'entreprise</FormLabel>
            {isEditable ? (
              <>
                <Textarea
                  id='description'
                  placeholder="Entrer une description de l'entreprise"
                  defaultValue={companyData?.description}
                  {...register('description', {
                    required: 'Ce champ est requis',
                  })}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{companyData?.description}</Text>
            )}
          </FormControl>

          <Flex gap={8}>
            <Box w='50%'>
              {/* Code Postal */}
              <FormControl isInvalid={errors.zipCode} mt={4} isRequired={isEditable}>
                <FormLabel htmlFor='zipCode'>Code Postal</FormLabel>
                {isEditable ? (
                  <>
                    <Input
                      id='zipCode'
                      placeholder='XXXXX'
                      defaultValue={companyData?.zipCode}
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
                  </>
                ) : (
                  <Text>{companyData?.zipCode}</Text>
                )}
              </FormControl>
            </Box>
            <Box w='50%'>
              {/*Ville*/}
              <FormControl isInvalid={errors.city} mt={4} isRequired={isEditable}>
                <FormLabel htmlFor='city'>Ville</FormLabel>
                {isEditable ? (
                  <>
                    <Input
                      id='city'
                      placeholder='Entrer la ville'
                      defaultValue={companyData?.city}
                      {...register('city', {
                        required: 'Ce champ est requis',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.city && errors.city.message}
                    </FormErrorMessage>
                  </>
                ) : (
                  <Text>{companyData?.city}</Text>
                )}
              </FormControl>
            </Box>
          </Flex>

          <Flex gap={8}>
            <Box w='50%'>
              {/* Champ Téléphone Portable */}
              <FormControl isInvalid={errors.phone} mt={4} isRequired={isEditable}>
                <FormLabel htmlFor='phone'>Téléphone</FormLabel>
                {isEditable ? (
                  <>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon icon="twemoji:flag-for-flag-france" />
                      </InputLeftElement>
                      <Input
                        id='phone'
                        placeholder='01XXXXXXXX'
                        defaultValue={companyData?.phone}
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
                  <Text>{companyData?.phone}</Text>
                )}
              </FormControl>
            </Box>
            <Box w='50%'>
              {/* Champ Email */}
              <FormControl isInvalid={errors.email} mt={4} isRequired={isEditable}>
                <FormLabel htmlFor='email'>Email</FormLabel>
                {isEditable ? (
                  <>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Email'
                      defaultValue={companyData?.email}
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
                  <Text>{companyData?.email}</Text>
                )}
              </FormControl>
            </Box>
          </Flex>

          <Flex gap={8}>
            <Box w='50%'>
              {/* Numéro de siren */}
              <FormControl mt={4} isInvalid={errors.siren} isRequired={isEditable}>
                <FormLabel htmlFor='siren'>Numéro de siren</FormLabel>
                {isEditable ? (
                  <>
                    <Input
                      id='siren'
                      placeholder='Entrer votre numéro de siren'
                      defaultValue={companyData?.siren}
                      {...register('siren', {
                        required: 'Ce champ est requis',
                        pattern: {
                          value: /^[0-9]{9}$/,
                          message: 'Numéro de siren invalide, il doit contenir 9 chiffres',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.siren && errors.siren.message}
                    </FormErrorMessage>
                  </>
                ) : (
                  <Text>{companyData?.siren}</Text>
                )}
              </FormControl>
            </Box>
          </Flex>

          <FormControl isInvalid={errors.website} mt={4}>
            <FormLabel htmlFor='website'>Site web de l'entreprise</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='website'
                  type='url'
                  placeholder="Entrer le site web de l'entreprise"
                  defaultValue={companyData?.website}
                  autoComplete={"url"}
                  {...register('website')}
                />
                <FormErrorMessage>
                  {errors.website && errors.website.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{companyData?.website}</Text>
            )}
          </FormControl>

          {/* Réseaux sociaux de l'entreprise */}
          <FormControl isInvalid={errors.socialMedia} mt={4}>
            <FormLabel htmlFor='socialMedia'>Réseaux sociaux de l'entreprise</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='socialMedia'
                  type='url'
                  placeholder="Entrer les réseaux sociaux de l'entreprise"
                  defaultValue={companyData?.socialMedia}
                  autoComplete={"url"}
                  {...register('socialMedia')}
                />
                <FormErrorMessage>
                  {errors.socialMedia && errors.socialMedia.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{companyData?.socialMedia}</Text>
            )}
          </FormControl>

          {isEditable ? (
            <Flex p={4} gap={4} justifyContent={"end"}>
              <Button bg="black" color='white' isLoading={isSubmitting} type='submit'>
                Enregistrer
              </Button>
              <Button variant={"outline"} onClick={() => {
                setIsEditable(false);
              }}>
                Annuler
              </Button>
            </Flex>
          ) : (
            <Flex p={4} gap={4} justifyContent={"end"}>
              <Button bg="black" color='white' onClick={(e) => {
                e.preventDefault();
                setIsEditable(true);
              }}>
                Modifier
              </Button>
            </Flex>
          )}
        </Box>

      </form>
    </>
  )
}

export default FormCompany;