import { Box, Button, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import backgroundImage from '../assets/home-page-background.jpg';
import Slider from '../components/slider';
import slider1 from '../assets/slider/slider-1.jpg';
import slider2 from '../assets/slider/slider-2.jpg';
import slider3 from '../assets/slider/slider-3.jpg';
import slider4 from '../assets/slider/slider-4.jpg';
import slider5 from '../assets/slider/slider-5.jpg';
import Searchbar from '../components/searchBar';
const HomePage = () => {
  const style = {
    height: '100vh',
    width: '100vw',
  };

  const sliders = [
    {
      image: slider1,
      title: 'Prestation de mariage',
      description:
        "Capturez les moments inoubliables de votre grand jour avec notre service de mariage. Nos séances de shooting en studio offrent un cadre élégant et professionnel pour des photos de couple, des portraits de famille et des clichés intimes qui dureront toute une vie. Faites de vos souvenirs de mariage des œuvres d'art intemporelles.",
    },
    {
      image: slider2,
      title: 'Prestation de mode',
      description:
        "Faites ressortir votre style unique avec notre service de mode. Que ce soit pour des portfolios professionnels, des séances de mode avant-gardistes ou des projets créatifs, nos studios équipés vous permettent de réaliser des séances de shooting exceptionnelles. Profitez d'un environnement contrôlé et des conseils de nos photographes expérimentés pour des résultats époustouflants.",
    },
    {
      image: slider3,
      title: 'Prestation événementiel',
      description:
        "Immortalisez vos événements spéciaux avec notre service de shooting événementiel. Des fêtes d'anniversaire aux célébrations d'anniversaires de mariage, nos studios sont parfaits pour créer des souvenirs mémorables. Nos photographes capturent l'essence de chaque moment, assurant que chaque détail soit parfait.",
    },
    {
      image: slider4,
      title: 'Prestation culinaire',
      description:
        'Mettez en valeur vos créations culinaires avec notre service de photographie culinaire. Nos studios sont équipés pour capturer les détails et les textures de vos plats, rendant vos créations encore plus appétissantes. Idéal pour les chefs, les restaurants, et les blogueurs culinaires, nos séances de shooting en studio garantissent des images de haute qualité qui mettent en valeur votre talent.',
    },
    {
      image: slider5,
      title: 'Prestation de naisance',
      description:
        "Préservez les précieux moments de l'arrivée de votre bébé avec notre service de photographie de naissance. Nos studios offrent un environnement sûr et confortable pour les nouveau-nés, permettant de capturer ces premiers instants de vie avec douceur et beauté. Nos photographes spécialisés en photographie de naissance veillent à ce que chaque photo reflète la tendresse et la joie de ce moment unique.",
    },
  ];

  return (
    <>
      {/* Section 1 */}
      <Box
        style={style}
        bgImage={`url(${backgroundImage})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Text
          fontSize="5xl"
          fontWeight="bold"
          color="white"
          fontFamily="Poppins, sans-serif"
        >
          Réserver votre séance de shooting
        </Text>
        <Searchbar />
      </Box>
      {/* Section 2 */}
      <Box display="flex" flexDirection="column" bg="black" color="white">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="6em"
        >
          <Heading
            fontSize="4xl"
            fontFamily="Poppins, sans-serif"
            fontWeight="bold"
          >
            Découvrez nos chef d'oeuvre
          </Heading>
        </Box>
        <Box
          display="flex"
          marginTop="8em"
          alignSelf="center"
          paddingBottom="8em"
        >
          <Slider sliders={sliders} />
        </Box>
      </Box>
      {/* Section 3 */}
      <Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginTop="6em"
          gap="8"
        >
          <Heading
            fontSize="4xl"
            fontFamily="Poppins, sans-serif"
            fontWeight="bold"
          >
            Vous êtes un professionnel de la photographie ?
          </Heading>
          <Heading
            fontSize="4xl"
            fontFamily="Poppins, sans-serif"
            fontWeight="bold"
          >
            Découvrez la prise de RDV en ligne !
          </Heading>
        </Box>
        <SimpleGrid
          columns={2}
          spacingX="40px"
          spacingY="20px"
          margin="10% 10%"
          fontFamily="Poppins, sans-serif"
        >
          <Box
            height="sm"
            bg="gray.300"
            boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
            position="relative"
            overflow="hidden"
            transition="box-shadow 0.3s"
            _hover={{
              boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.4)',
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            onMouseEnter={e =>
              (e.currentTarget.querySelector('.button').style.opacity = 1)
            }
            onMouseLeave={e =>
              (e.currentTarget.querySelector('.button').style.opacity = 0)
            }
          >
            <Heading size="xl">+ 50%</Heading>
            <Text fontSize="md">de fréquence sur les rdv pris en ligne</Text>
            <Box className="button" opacity={0} transition="opacity 0.3s">
              <Button
                bg="black"
                color="white"
                variant="outline"
                size="sm"
                mt="1rem"
              >
                Ajouter votre établissement
              </Button>
            </Box>
          </Box>
          <Box
            height="sm"
            bg="gray.300"
            boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
            position="relative"
            overflow="hidden"
            transition="box-shadow 0.3s"
            _hover={{
              boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.4)',
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            onMouseEnter={e =>
              (e.currentTarget.querySelector('.button').style.opacity = 1)
            }
            onMouseLeave={e =>
              (e.currentTarget.querySelector('.button').style.opacity = 0)
            }
          >
            <Heading size="xl">4x</Heading>
            <Text fontSize="md">
              moins d'oublis avec les rappels sms des rendez-vous
            </Text>
            <Box className="button" opacity={0} transition="opacity 0.3s">
              <Button
                bg="black"
                color="white"
                variant="outline"
                size="sm"
                mt="1rem"
              >
                Ajouter votre établissement
              </Button>
            </Box>
          </Box>
          <Box
            height="sm"
            bg="gray.300"
            boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
            position="relative"
            overflow="hidden"
            transition="box-shadow 0.3s"
            _hover={{
              boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.4)',
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            onMouseEnter={e =>
              (e.currentTarget.querySelector('.button').style.opacity = 1)
            }
            onMouseLeave={e =>
              (e.currentTarget.querySelector('.button').style.opacity = 0)
            }
          >
            <Heading size="xl">+10 000</Heading>
            <Text fontSize="md">Studios</Text>
            <Box className="button" opacity={0} transition="opacity 0.3s">
              <Button
                bg="black"
                color="white"
                variant="outline"
                size="sm"
                mt="1rem"
              >
                Ajouter votre établissement
              </Button>
            </Box>
          </Box>
          <Box
            height="sm"
            bg="gray.300"
            boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
            position="relative"
            overflow="hidden"
            transition="box-shadow 0.3s"
            _hover={{
              boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.4)',
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            onMouseEnter={e =>
              (e.currentTarget.querySelector('.button').style.opacity = 1)
            }
            onMouseLeave={e =>
              (e.currentTarget.querySelector('.button').style.opacity = 0)
            }
          >
            <Heading size="xl">{`> 500 000 €`}</Heading>
            <Text fontSize="md">De rendez-vous vendus</Text>
            <Box className="button" opacity={0} transition="opacity 0.3s">
              <Button
                bg="black"
                color="white"
                variant="outline"
                size="sm"
                mt="1rem"
              >
                Ajouter votre établissement
              </Button>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default HomePage;
