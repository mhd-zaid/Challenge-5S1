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
  Text, Textarea, VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const FormCompanyRequest = () => {
  const [listIxServices, setListIxServices] = useState([]);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({});
  const [step, setStep] = useState(1);

  async function createCompany(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('zipCode', data.zipCode);
    formData.append('city', data.city);
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    formData.append('siren', data.siren);
    formData.append('file', data.kbis[0]);

    formData.append('website', data.website);
    formData.append('socialMedia', data.socialMedia);

    formData.append('ownerName', data.ownerName);
    formData.append('ownerFirstname', data.ownerFirstname);
    formData.append('ownerPhone', data.ownerPhone);
    formData.append('ownerEmail', data.ownerEmail);
    formData.append('password', data.password);


    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/companies', {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/ld+json',
      // },
      body: formData,
    });

    const result = await response.json();
    console.log('result', result);

    if (result.error) {
      console.error('error', result.error);
    } else {
    }
  }

  const onSubmit = async (values) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // console.log(JSON.stringify(values, null, 2))
        createCompany(values)
        resolve()
      }, 2000)
    });
  }

  const prevStep = () => {
    setStep(step - 1);
  }

  const nextStep = () => {
    setStep(step + 1);
  }

  return (
    <>
      <Box
      >
        <form onSubmit={handleSubmit(onSubmit)} aria-autocomplete={"both"} autoComplete={"on"} autoSave={"on"}>

          {step === 1 && (
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
                  {...register('description', {
                    required: 'Ce champ est requis',
                  })}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>

              {/*/!* Adresse complète de l'entreprise *!/*/}
              {/*<FormControl isInvalid={errors.address} mt={4} isRequired>*/}
              {/*  <FormLabel htmlFor='address'>Adresse de l'entreprise</FormLabel>*/}
              {/*  <Textarea*/}
              {/*    id='address'*/}
              {/*    placeholder="Entrer l\'adresse de l\'entreprise"*/}
              {/*    {...register('address', {*/}
              {/*      required: 'Ce champ est requis',*/}
              {/*    })}*/}
              {/*  />*/}
              {/*  <FormErrorMessage>*/}
              {/*    {errors.address && errors.address.message}*/}
              {/*  </FormErrorMessage>*/}
              {/*</FormControl>*/}

              <Flex gap={8}>
                <Box w='50%'>
                  {/* Code Postal */}
                  <FormControl isInvalid={errors.zipCode} mt={4} isRequired>
                    <FormLabel htmlFor='zipCode'>Code Postal</FormLabel>
                    <Input
                      id='zipCode'
                      placeholder='XXXXX'
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
              </Flex>

              <Flex gap={8}>
                <Box w='50%'>
                  {/* Numéro de siren */}
                  <FormControl isInvalid={errors.siren} mt={4} isRequired>
                    <FormLabel htmlFor='siren'>Numéro de siren</FormLabel>
                    <Input
                      id='siren'
                      placeholder='Entrer votre numéro de siren'
                      {...register('siren', {
                        required: 'Ce champ est requis',
                        pattern: {
                          value: /^[0-9]{9}$/,
                          message: 'Numéro de siren invalide, il doit contenir 14 chiffres',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.siren && errors.siren.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
                <Box w='50%'>
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
                </Box>
              </Flex>

              <Button mt={10} bg="black" color='white' onClick={handleSubmit(nextStep)} mx={"auto"}>
                Suivant
              </Button>

            </Box>
          )}

          {step === 2 && (
            <Box>
              <Heading as='h2' size='sm' textAlign='center' mb={10}>
                Informations complémentaires
              </Heading>
              {/* Champ Site web de l'entreprise */}
              <FormControl isInvalid={errors.website} mt={4}>
                <FormLabel htmlFor='website'>Site web de l'entreprise</FormLabel>
                <Input
                  id='website'
                  type='url'
                  placeholder="Entrer le site web de l'entreprise"
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
                  autoComplete={"url"}
                  {...register('socialMedia')}
                />
                <FormErrorMessage>
                  {errors.socialMedia && errors.socialMedia.message}
                </FormErrorMessage>
              </FormControl>

              <Flex>
                <Button mt={10} bg="black" color='white' onClick={prevStep} mx={"auto"}>
                  Précédent
                </Button>
                <Button mt={10} bg="black" color='white' onClick={nextStep} mx={"auto"}>
                  Suivant
                </Button>
              </Flex>
            </Box>
          )}

          {step === 3 && (
            <Box>
              <Heading as='h2' size='sm' textAlign='center' mb={10}>
                Informations personnelles
              </Heading>
              <Flex gap={8}>
                <Box w='50%'>
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
                <Box w='50%'>
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
              <Flex gap={8}>
                <Box w='50%'>
                  {/* Champ Téléphone Portable */}
                  <FormControl isInvalid={errors.ownerPhone} mt={4} isRequired>
                    <FormLabel htmlFor='ownerPhone'>Téléphone Portable</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon icon="twemoji:flag-for-flag-france" />
                      </InputLeftElement>
                      <Input
                        id='ownerPhone'
                        placeholder='06XXXXXXXX'
                        autoComplete={"tel"}
                        {...register('ownerPhone', {
                          required: 'Ce champ est requis',
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Numéro de téléphone invalide, il doit contenir 10 chiffres',
                          },
                        })}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.ownerPhone && errors.ownerPhone.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
                <Box w='50%'>
                  {/* Champ Email */}
                  <FormControl isInvalid={errors.ownerEmail} mt={4} isRequired>
                    <Flex alignContent={"center"}>
                      <FormLabel htmlFor='ownerEmail'>Email</FormLabel>
                    </Flex>
                    <Input
                      id='ownerEmail'
                      type='ownerEmail'
                      placeholder='Email'
                      autoComplete={"email"}
                      {...register('ownerEmail', {
                        required: 'Ce champ est requis',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Adresse email invalide',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.ownerEmail && errors.ownerEmail.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </Flex>
              <Flex gap={8}>
                <Box w={"50%"}>
                  {/* Champ Mot de passe */}
                  <FormControl isInvalid={errors.password} mt={4} isRequired>
                    <FormLabel htmlFor='password'>Mot de passe</FormLabel>
                    <Input
                      id='password'
                      type='password'
                      placeholder='Mot de passe'
                      autoComplete={"new-password"}
                      {...register('password', {
                        required: 'Ce champ est requis',
                        minLength: { value: 8, message: 'La longueur minimale est de 8 caractères' },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                    <FormHelperText>
                      Votre mot de passe doit contenir au moins 8 caractères
                    </FormHelperText>
                  </FormControl>
                </Box>
                <Box w={"50%"}>
                  {/* Champ Confirmation du mot de passe */}
                  <FormControl isInvalid={errors.passwordConfirmation} mt={4} isRequired>
                    <FormLabel htmlFor='passwordConfirmation'>Confirmation du mot de passe</FormLabel>
                    <Input
                      id='passwordConfirmation'
                      type='password'
                      placeholder='Confirmation du mot de passe'
                      autoComplete={"new-password"}
                      {...register('passwordConfirmation', {
                        required: 'Ce champ est requis',
                        minLength: { value: 8, message: 'La longueur minimale est de 8 caractères' },
                        validate: (value) =>
                          value === document.getElementById('password').value || 'Les mots de passe ne correspondent pas',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.passwordConfirmation && errors.passwordConfirmation.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </Flex>


              <Flex>
                <Button mt={10} bg="black" color='white' onClick={prevStep} mx={"auto"}>
                  Précédent
                </Button>
                <Button mt={10} bg="black" color='white' isLoading={isSubmitting} type='submit' mx={"auto"}>
                  Envoyer
                </Button>
              </Flex>

            </Box>
          )}

          {/*<Flex>*/}
          {/*  <Button mt={10} bg="black" color='white' isLoading={isSubmitting} type='submit' w={"50%"} mx={"auto"}>*/}
          {/*    Découvrir gratuitement*/}
          {/*  </Button>*/}
          {/*</Flex>*/}
        </form>
      </Box>
    </>
  )
}

export default FormCompanyRequest