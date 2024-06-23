import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Weekday from 'dayjs/plugin/weekday';
import UTC from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import 'dayjs/locale/fr';

const useCustomDate = () => {
  const { i18n } = useTranslation();

  dayjs.locale(i18n.language);
  dayjs.extend(Weekday);
  dayjs.extend(UTC);
  dayjs.extend(weekOfYear);

  return dayjs;
};

export default useCustomDate;
