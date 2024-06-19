import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useCustomDate from '../hooks/useCustomDate';

const ReservationPage = () => {
  const { t } = useTranslation();
  const { id, service_id } = useParams();
  const d = useCustomDate();
  return (
    <Box w="full" p={8} py={24}>
      {id}
      {service_id}
    </Box>
  );
};

export default ReservationPage;
