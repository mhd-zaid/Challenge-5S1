import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import useCustomDate from '../hooks/useCustomDate';

const WeeksPlanning = ({
  availableHours,
  selectedDayHour,
  setSelectedDayHour,
}) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const d = useCustomDate();

  const generateFourWeeksAhead = () => {
    const weeks = [[], [], [], []]; // Initialize 4 arrays for 4 weeks
    let currentDate = d(); // Start from today

    for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
      // For the first week, start from today. For subsequent weeks, start from the day after the last day of the previous week.
      const weekStart = currentDate;
      const weekEnd = weekStart.add(1, 'week');

      // Generate days for the current week
      let currentDay = weekStart;
      while (
        currentDay.isBefore(weekEnd) ||
        currentDay.isSame(weekEnd, 'day')
      ) {
        weeks[weekIndex].push(currentDay.format('YYYY-MM-DD'));
        currentDay = currentDay.add(1, 'day');
      }

      // Prepare for the next week by setting currentDate to the day after the last day of the current week
      currentDate = weekEnd.add(1, 'day');
    }

    return weeks;
  };

  const getAvailableHoursForDay = day => {
    const daySlots = availableHours[day];
    if (!daySlots) return [];
    // Sort the slots by start time
    daySlots.sort((a, b) => {
      return a.start.localeCompare(b.start);
    });
    return daySlots;
  };

  return (
    <>
      <Flex alignItems="center" p={2}>
        <Button
          variant="unstyled"
          isDisabled={selectedWeek <= 0}
          onClick={() => setSelectedWeek(selectedWeek => selectedWeek - 1)}
        >
          &lt;
        </Button>
        <Text fontWeight="medium" mx={4}>
          {d(generateFourWeeksAhead()[selectedWeek][0]).format('DD/MM')}
          &nbsp;-&nbsp;
          {d(generateFourWeeksAhead()[selectedWeek][7]).format('DD/MM')}
        </Text>
        <Button
          variant="unstyled"
          isDisabled={3 < selectedWeek + 1}
          onClick={() => setSelectedWeek(selectedWeek => selectedWeek + 1)}
        >
          &gt;
        </Button>
      </Flex>
      <Flex bgColor={'white'} p={6} minH={'50vh'}>
        {generateFourWeeksAhead()[selectedWeek].map((day, j) => {
          const availableHoursForDay = getAvailableHoursForDay(day);
          return (
            <Box key={j} flex={1} px={1}>
              <Box>
                <Text
                  textAlign={'center'}
                  fontWeight={'semibold'}
                  textTransform={'uppercase'}
                  fontSize={'xs'}
                >
                  {d(day).format('dddd')}
                </Text>
                <Text textAlign={'center'} fontSize={'sm'}>
                  {d(day).format('DD MMMM')}
                </Text>
              </Box>

              <Box mt={4}>
                {availableHoursForDay.map((hour, i) => {
                  return (
                    <Button
                      key={i}
                      display={'flex'}
                      variant={'unstyled'}
                      bgColor={
                        selectedDayHour?.date ===
                        d(day)
                          .hour(hour.start.split(':')[0])
                          .format('YYYY-MM-DD HH:mm:ss')
                          ? 'black'
                          : 'gray.100'
                      }
                      color={
                        selectedDayHour?.date ===
                        d(day)
                          .hour(hour.start.split(':')[0])
                          .format('YYYY-MM-DD HH:mm:ss')
                          ? 'white'
                          : 'black'
                      }
                      _hover={{ bgColor: 'gray.200' }}
                      w={'full'}
                      h={10}
                      my={2}
                      onClick={() => {
                        setSelectedDayHour({
                          ...hour,
                          date: d(day)
                            .hour(hour.start.split(':')[0])
                            .format('YYYY-MM-DD HH:mm:ss'),
                        });
                      }}
                    >
                      <Text
                        textAlign={'center'}
                      >{`${hour.start.split(':')[0]}:00`}</Text>
                    </Button>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Flex>
    </>
  );
};

export default WeeksPlanning;
