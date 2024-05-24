import { Icon } from '@iconify/react';
import { useDebounce, useClickAway } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import { Box, Flex, Text, Heading } from '@chakra-ui/react';

const Searchbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickAway(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (search.length > 2) {
      setIsOpen(true);
    }
  }, [search]);

  useEffect(() => {
    handleSearch();
  }, [debouncedSearch]);

  const handleSearch = async () => {
    setSearchResults([]);
    if (debouncedSearch.length < 3) return;
    setIsLoading(true);
    await fetch(import.meta.env.VITE_BACKEND_URL + '/search', {
      method: 'POST',
      body: JSON.stringify({ message: debouncedSearch }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        try {
          if (Array.isArray(JSON.parse(data.content))) {
            setSearchResults(JSON.parse(data.content));
          }
        } catch (e) {
          console.log(e);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Icon
            icon="line-md:search"
            fontSize={20}
            style={{ color: '#facc15' }}
          />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Une recette, un ingrédient ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {isOpen && (
          <Flex
            pos="absolute"
            top="110%"
            rounded={'lg'}
            w="full"
            minH={12}
            maxH={'90vh'}
            bgColor="lightyellow"
            ref={ref}
            flexDir="column"
            overflowY={'scroll'}
          >
            {isLoading && (
              <Flex alignItems="center" pos={'relative'} p={4}>
                <Icon
                  icon="eos-icons:three-dots-loading"
                  width={24}
                  height={24}
                  pos={'absolute'}
                />
                <Text as="small" ml={2}>
                  Recherche en cours
                </Text>
              </Flex>
            )}
            {!isLoading && searchResults.length === 0 && (
              <Flex p={4}>
                <Text as="small" textAlign="center">
                  Aucun résultat
                </Text>
              </Flex>
            )}
            {!isLoading && searchResults.length > 0 && (
              <Box>
                <Heading fontSize="md" p={4} pb={2}>
                  Résultats de recherche
                </Heading>
                {searchResults.map((result, index) => (
                  <Flex
                    key={index}
                    p={4}
                    as="a"
                    href={`/recettes/${result.url}`}
                    rounded="lg"
                    _hover={{ bgColor: 'lightgoldenrodyellow' }}
                    onClick={() => {
                      setSearch(result.title);
                      setSearchResults([]);
                      onclose();
                    }}
                  >
                    <Text>{result.title}</Text>
                  </Flex>
                ))}
              </Box>
            )}
          </Flex>
        )}
      </div>
    </div>
  );
};

export default Searchbar;