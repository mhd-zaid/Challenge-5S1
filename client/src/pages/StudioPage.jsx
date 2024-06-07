import { Center, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

const StudioPage = () => {
  const { id } = useParams();
  const [studioData, setStudioData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getStudioData = async () => {
      setIsLoading(true);
      await fetch(import.meta.env.VITE_BACKEND_URL + `/studios/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 404) {
            return;
          }
          setStudioData(data);
        })
        .finally(() => setIsLoading(false));
    };

    if (id) getStudioData();
  }, [id]);
  console.log(studioData);

  if (!id || isLoading)
    return (
      <Flex w="full" h="full" justifyContent="center" alignItems="center">
        <Spinner size={'xl'} />
      </Flex>
    );
  if (!studioData) return <NotFoundPage />;

  return <div></div>;
};

export default StudioPage;
