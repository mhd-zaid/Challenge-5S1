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
import useCustomDate from '@/hooks/useCustomDate.js';

const FormStudioOpeningTime = ({studioOpeningTime, onSubmitForm}) => {
  const { token } = useAuth();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({});
  const [studioOpeningTimesData, setStudioOpeningTimesData] = useState(studioOpeningTime);
  const [isEditable, setIsEditable] = useState(!studioOpeningTime);
  const [studios, setStudios] = useState([]);
  const [studioId, setStudioId] = useState(studioOpeningTime ? studioOpeningTime.studio.id : '');
  const dayjs = useCustomDate();
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

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
      setStudios(data['hydra:member']);
    };

    fetchStudios();
  }, []);

  async function upsertStudio(data) {
    const url = studioOpeningTime ? import.meta.env.VITE_BACKEND_BASE_URL + studioOpeningTime['@id'] : `${import.meta.env.VITE_BACKEND_URL}/studio_opening_times`;
    const method = studioOpeningTime ? 'PATCH' : 'POST';
    const contentType = studioOpeningTime ? 'application/merge-patch+json' : 'application/ld+json';
    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': contentType,
      },
      body: JSON.stringify({
        ...data,
        day: parseInt(data.day),
        startTime:dayjs.utc(`1970-01-01T${data.startTime}`),
        endTime: dayjs.utc(`1970-01-01T${data.endTime}`)
      }),
    });

    const result = await response.json();

    if (result.error) {
      console.error('error', result.error);
    }else {
      setIsEditable(false);
      setStudioOpeningTimesData(result);
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
        title: {studioOpeningTimesData} ? 'Modifications enregistrées' : 'studioOpeningTime créé',
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
          {studioOpeningTimesData && (
            <Heading as='h2' size='sm' textAlign='center' mb={10}>
              {studioOpeningTimesData?.studio?.name}
            </Heading>
          )}

          {!studioOpeningTimesData && (
            <FormControl isRequired={isEditable}>
              <FormLabel>Studio</FormLabel>
              <Select
                defaultValue={studioId}
                onChange={(e) => setStudioId(e.target.value)}
                {...(!studioOpeningTimesData && register('studio', {
                  required: 'Ce champ est requis',
                }))}
              >
                <option value="">Sélectionner un studio</option>
                {studios.map((studio) => (
                  <option key={studio.id} value={studio['@id']}>
                    {studio.name} - {studio.id}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Champ Nom du studioOpeningTimesData */}
          <FormControl isInvalid={errors.day} mt={4} isRequired={isEditable}>
            <FormLabel htmlFor='name'>Jour</FormLabel>
            {isEditable ? (
              <>
                <Select
                  id='day'
                  placeholder='Sélectionner un jour'
                  defaultValue={studioOpeningTimesData?.day}
                  {...register('day', {
                    required: 'Ce champ est requis',
                  })}
                >
                  {days.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.day && errors.day.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{days[studioOpeningTimesData?.day]}</Text>
            )}
          </FormControl>

          {/* Heure d'ouverture */}
          <FormControl isInvalid={errors.startTime} mt={4} isRequired={isEditable}>
            <FormLabel htmlFor='startTime'>Horaire d'ouverture</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='startTime'
                  type="time"
                  placeholder='08:00'
                  defaultValue={dayjs(studioOpeningTimesData?.startTime).format('HH:mm')}
                  {...register('startTime', {
                    required: 'Ce champ est requis',
                    pattern: {
                      value: /^[0-9]{2}:[0-9]{2}$/,
                      message: 'Horaire invalide, il doit être au format HH:MM',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.startTime && errors.startTime.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{dayjs.utc(studioOpeningTimesData?.startTime).format('HH:mm')}</Text>
            )}
          </FormControl>

          {/* Heure de fermeture */}
          <FormControl isInvalid={errors.endTime} mt={4} isRequired={isEditable}>
            <FormLabel htmlFor='endTime'>Horaire d'ouverture</FormLabel>
            {isEditable ? (
              <>
                <Input
                  id='endTime'
                  placeholder='08:00'
                  type="time"
                  defaultValue={dayjs(studioOpeningTimesData?.endTime).format('HH:mm')}
                  {...register('endTime', {
                    required: 'Ce champ est requis',
                    pattern: {
                      value: /^[0-9]{2}:[0-9]{2}$/,
                      message: 'Horaire invalide, il doit être au format HH:MM',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.endTime && errors.endTime.message}
                </FormErrorMessage>
              </>
            ) : (
              <Text>{dayjs.utc(studioOpeningTimesData?.endTime).format('HH:mm')}</Text>
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

export default FormStudioOpeningTime;