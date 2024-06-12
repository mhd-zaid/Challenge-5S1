import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/fr';

const useCustomDate = () => {
  const { i18n } = useTranslation();

  dayjs.locale(i18n.language);
  dayjs.extend(Weekday);

  return dayjs;
};

export default useCustomDate;
