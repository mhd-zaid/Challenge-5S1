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
  InputGroup, InputLeftElement, List, ListItem,
  Select, SimpleGrid,
  Text, Textarea, useToast, VStack,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext.jsx';
import { useEffect, useState } from 'react';

const FormStudio = ({studio, onSubmitForm}) => {
  const { token, isAdministrator } = useAuth();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({});
  const [companyId, setCompanyId] = useState(studio ? studio.company.id : '');
  const [companies, setCompanies] = useState([]);
  const [studioData, setStudioData] = useState(studio);
  const [isEditable, setIsEditable] = useState(!studio);
  const [studioOpeningTimes, setStudioOpeningTimes] = useState({
    1: { start: null, end: null },
    2: { start: null, end: null },
    3: { start: null, end: null },
    4: { start: null, end: null },
    5: { start: null, end: null },
    6: { start: null, end: null },
    7: { start: null, end: null },
  });


  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/companies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/ld+json',
          'Authorization': 'Bearer ' + token,
        },
      });
      const data = await response.json();
      setCompanies(data['hydra:member'].map((company) => ({
        ...company,
        id: data['@id'] + '/' + company.id,
      })));
    };

    if (isAdministrator) fetchCompanies();
  }, []);

  async function upsertStudio(data) {
    const url = studio ? import.meta.env.VITE_BACKEND_BASE_URL + studio['@id'] : `${import.meta.env.VITE_BACKEND_URL}/studios`;
    const method = studio ? 'PATCH' : 'POST';
    const contentType = studio ? 'application/merge-patch+json' : 'application/ld+json';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': contentType,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.error) {
      console.error('error', result.error);
    }else {
      setIsEditable(false);
      setStudioData(result);
    }
  }

  const onSubmit = async (values) => {
    console.log("values", values);
    const confirmAction = confirm('Etes-vous sûr de vouloir enregistrer ces modifications ?');
    if (!confirmAction) {
      return;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        upsertStudio(values)
        resolve()
      }, 1000)
    }).then(() => {
      onSubmitForm(true);
      toast({
        title: {studioData} ? 'Modifications enregistrées' : 'Studio créé',
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
          {studioData && (
            <Heading as='h2' size='sm' textAlign='center' mb={10}>
              Entreprise - {studioData?.company?.name}
            </Heading>
          )}

          {!studioData && (
            <FormControl isRequired={isEditable}>
              <FormLabel>Entreprise</FormLabel>
              <Select
                defaultValue={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                {...(!studioData && register('company', {
                  required: 'Ce champ est requis',
                }))}
              >
                <option value="">Sélectionner une entreprise</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Champ Nom du studioData */}
          <FormControl isInvalid={errors.name} mt={4} isRequired={isEditable}>
            <FormLabel htmlFor='name'>Nom du studio</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='name'
                  autoFocus={true}
                  placeholder='Entrer le nom de votre entreprise'
                  defaultValue={studioData?.name}
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
              <Text>{studioData?.name}</Text>
            )}
          </FormControl>

          {/* Description du studioData */}
          <FormControl isInvalid={errors.description} mt={4} isRequired={isEditable}>
            <FormLabel htmlFor='description'>Description du studio</FormLabel>
            {isEditable ? (
              <>
                <Textarea
                  id='description'
                  placeholder="Entrer une description de l'entreprise"
                  defaultValue={studioData?.description}
                  {...register('description', {
                    required: 'Ce champ est requis',
                  })}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{studioData?.description}</Text>
            )}
          </FormControl>

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
                        defaultValue={studioData?.phone}
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
                  <Text>{studioData?.phone}</Text>
                )}
              </FormControl>
            </Box>
            {/*<Box w='50%'>*/}
            {/*  /!* Numéro de siret *!/*/}
            {/*  <FormControl mt={4}>*/}
            {/*    <FormLabel htmlFor='siret'>Numéro de siret</FormLabel>*/}
            {/*    <Input*/}
            {/*      disabled={true}*/}
            {/*      id='siret'*/}
            {/*      placeholder='Entrer votre numéro de siret'*/}
            {/*      value={studioData?.siret}*/}
            {/*    />*/}
            {/*  </FormControl>*/}
            {/*</Box>*/}
          </Flex>

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
                      defaultValue={studioData?.zipCode}
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
                  <Text>{studioData?.zipCode}</Text>
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
                      defaultValue={studioData?.city}
                      {...register('city', {
                        required: 'Ce champ est requis',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.city && errors.city.message}
                    </FormErrorMessage>
                  </>
                ) : (
                  <Text>{studioData?.city}</Text>
                )}
              </FormControl>
            </Box>
          </Flex>

          <FormControl isInvalid={errors.address} mt={4}>
            <FormLabel htmlFor='address'>Adresse du studio</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='address'
                  type='text'
                  placeholder="Entrer l'adresse du studio"
                  defaultValue={studioData?.address}
                  autoComplete={"address"}
                  {...register('address')}
                />
                <FormErrorMessage>
                  {errors.address && errors.address.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{studioData?.address}</Text>
            )}
          </FormControl>

          {/*Horaire d'ouverture*/}
          {isEditable ? (
            Array.from(Object.keys(studioOpeningTimes)).map((day, index) => (
              <Flex gap={4}>
                <FormLabel htmlFor={`studioOpeningTimes.${day}.start`}>Ouverture {day}</FormLabel>
                <FormControl isInvalid={errors[`studioOpeningTimes.${day}.start`]}>
                  <Input
                    id={`studioOpeningTimes.${day}.start`}
                    type='time'
                    defaultValue={studioData?.studioOpeningTimes[day].start}
                    {...register(`studioOpeningTimes.${day}.start`, {
                    })}
                  />
                  <FormErrorMessage>
                    {errors[`studioOpeningTimes.${day}.start`] && errors[`studioOpeningTimes.${day}.start`].message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors[`studioOpeningTimes.${day}.end`]} IsRequired={studioOpeningTimes[day].start}>
                  <Input
                    id={`studioOpeningTimes.${day}.end`}
                    type='time'
                    defaultValue={studioData?.studioOpeningTimes[day].end}
                    {...register(`studioOpeningTimes.${day}.end`, {
                    })}
                  />
                  <FormErrorMessage>
                    {errors[`studioOpeningTimes.${day}.end`] && errors[`studioOpeningTimes.${day}.end`].message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
            ))
          ) : (
            <List>
              {studioData?.studioOpeningTimes.map((day, index) => (
                <ListItem key={index}>
                  {day.startTime.split('T')[1].split(':')[0]}h{day.startTime.split('T')[1].split(':')[1]} : {day.endTime.split('T')[1].split(':')[0]}h{day.endTime.split('T')[1].split(':')[1]}
                </ListItem>
              ))}
            </List>
          )}

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

export default FormStudio;