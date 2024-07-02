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
  Select,
  Text, Textarea, useToast,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const FormService = ({service, onSubmitForm}) => {
  const { token} = useAuth();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({});
  const [studioId, setStudioId] = useState(service ? service.studio.id : '');
  const [studios, setStudios] = useState([]);
  const [serviceData, setServiceData] = useState(service);
  const [isEditable, setIsEditable] = useState(!service);

  useEffect(() => {
    const fetchStudios = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/studios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/ld+json',
          'Authorization': 'Bearer ' + token,
        },
      });
      const data = await response.json();
      setStudios(data['hydra:member'].map((studio) => ({
        ...studio,
        id: data['@id'] + '/' + studio.id,
      })));
    };

    fetchStudios();
  }, []);

  async function upsertService(data) {
    const url = service ? import.meta.env.VITE_BACKEND_URL + '/services/' + service['@id'].split('/')[3] : `${import.meta.env.VITE_BACKEND_URL}/services`;
    const method = service ? 'PATCH' : 'POST';
    const contentType = service ? 'application/merge-patch+json' : 'application/ld+json';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': contentType,
      },
      body: JSON.stringify({
        ...data,
        duration:dayjs.utc(`1970-01-01T01:00:00+00:00`),
        cost: parseInt(data.cost),
      }),
    });

    const result = await response.json();

    if (result.error) {
      console.error('error', result.error);
    }else {
      onSubmitForm(true);
      setIsEditable(false);
      setServiceData(result);
    }
  }

  const onSubmit = async (values) => {
    const confirmAction = confirm('Etes-vous sûr de vouloir enregistrer ces modifications ?');
    if (!confirmAction) {
      return;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        upsertService(values)
        resolve()
      }, 1000)
    }).then(() => {
      toast({
        title: {serviceData} ? 'Modifications enregistrées' : 'service créé',
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
          {serviceData && (
            <Heading as='h2' size='sm' textAlign='center' mb={10}>
              {serviceData?.studio?.name}
            </Heading>
          )}

          {!serviceData && (
            <FormControl isRequired={isEditable}>
              <FormLabel>Studio</FormLabel>
              <Select
                defaultValue={studioId}
                onChange={(e) => setStudioId(e.target.value)}
                {...(!serviceData && register('studio', {
                  required: 'Ce champ est requis',
                }))}
              >
                <option value="">Sélectionner un studio</option>
                {studios.map((studio) => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Champ Nom du serviceData */}
          <FormControl isInvalid={errors.name} mt={4} isRequired={isEditable}>
            <FormLabel htmlFor='name'>Nom du service</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='name'
                  autoFocus={true}
                  placeholder='Entrer le nom de votre entreprise'
                  defaultValue={serviceData?.name}
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
              <Text>{serviceData?.name}</Text>
            )}
          </FormControl>

          {/* Description du serviceData */}
          <FormControl isInvalid={errors.description} mt={4} isRequired={isEditable}>
            <FormLabel htmlFor='description'>Description du service</FormLabel>
            {isEditable ? (
              <>
                <Textarea
                  id='description'
                  placeholder="Entrer une description de l'entreprise"
                  defaultValue={serviceData?.description}
                  {...register('description', {
                    required: 'Ce champ est requis',
                    minLength: { value: 20, message: 'La longueur minimale est de 20 caractères' },
                  })}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{serviceData?.description}</Text>
            )}
          </FormControl>

          <Flex gap={8}>
            <Box w='50%'>
              {/* Coût */}
              <FormControl isInvalid={errors.cost} mt={4} isRequired={isEditable}>
                <FormLabel htmlFor='cost'>Coût</FormLabel>
                {isEditable ? (
                  <>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon icon="material-symbols:euro"  style={{color: "black"}} />
                      </InputLeftElement>
                      <Input
                        id='cost'
                        placeholder='100'
                        defaultValue={serviceData?.cost}
                        {...register('cost', {
                          required: 'Ce champ est requis',
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Le coût doit être un nombre',
                          },
                        })}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.cost && errors.cost.message}
                    </FormErrorMessage>
                  </>
                ) : (
                  <Text>{serviceData?.cost} €</Text>
                )}
              </FormControl>
            </Box>
          </Flex>

          <Flex gap={8}>
            <Box w='50%'>
              {/* Durée */}
              <FormControl isInvalid={errors.duration} mt={4}>
                <FormLabel htmlFor='duration'>Durée</FormLabel>
                {isEditable ? (
                  <>
                <Input
                  id={'duration'}
                  type="time"
                  placeholder='08:00'
                  disabled={true}
                  defaultValue={"01:00"}
                  {...register('duration', {
                  })}
                />
                <FormErrorMessage>
                  {errors.duration && errors.duration.message}
                </FormErrorMessage>
                  </>
                ) : (
                  <Text>{serviceData?.duration} h</Text>
                )}
              </FormControl>
            </Box>
          </Flex>

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

export default FormService;