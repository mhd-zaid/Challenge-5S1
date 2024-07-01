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
  const dayjs = useCustomDate();
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  async function updateStudioOpeningTimes(data) {
    const url = import.meta.env.VITE_BACKEND_URL + '/studio_opening_times/' + studioOpeningTime['@id'].split('/')[3];
    const method = 'PATCH';
    const contentType = 'application/merge-patch+json';
    return await fetch(url, {
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
  }

  const onSubmit = async (values) => {
    const confirmAction = confirm('Etes-vous sûr de vouloir enregistrer ces modifications ?');
    if (!confirmAction) {
      return;
    }
    values.studio = studioOpeningTime.studio['@id'];
    values.day = studioOpeningTime.day;

    await updateStudioOpeningTimes(values).then(() => {
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
          <Heading as='h2' size='sm' textAlign='center' mb={10}>
            {studioOpeningTimesData?.studio?.name}
          </Heading>

          {/* Champ Nom du studioOpeningTimesData */}
          <FormControl isInvalid={errors.day} mt={4}>
            <FormLabel htmlFor='name'>Jour</FormLabel>
            <Text>{days[studioOpeningTimesData?.day]}</Text>
          </FormControl>

          {/* Heure d'ouverture */}
          <FormControl isInvalid={errors.startTime} mt={4} isRequired>
            <FormLabel htmlFor='startTime'>Horaire d'ouverture</FormLabel>
            <Input
              id='startTime'
              type="time"
              placeholder='08:00'
              defaultValue={studioOpeningTimesData?.startTime}
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
          </FormControl>

          {/* Heure de fermeture */}
          <FormControl isInvalid={errors.endTime} mt={4} isRequired>
            <FormLabel htmlFor='endTime'>Horaire de fermeture</FormLabel>
            <Input
              id='endTime'
              placeholder='08:00'
              type="time"
              defaultValue={studioOpeningTimesData?.endTime}
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
          </FormControl>

          <Flex p={4} gap={4} justifyContent={"end"}>
            <Button bg="black" color='white' isLoading={isSubmitting} type='submit'>
              Enregistrer
            </Button>
            <Button>
              Annuler
            </Button>
          </Flex>
        </Box>

      </form>
    </>
  )
}

export default FormStudioOpeningTime;