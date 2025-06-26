import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TextProps } from 'react-native';

interface CurrentDateProps extends TextProps {
  style?: TextProps['style'];
}

const CurrentDate = memo(({ style, ...props }: CurrentDateProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateFormatOptions = useMemo(
    () => ({
      weekday: 'long' as const,
      year: 'numeric' as const,
      month: 'long' as const,
      day: 'numeric' as const,
      timeZone: 'Asia/Manila' as const,
    }),
    []
  );

  const updateDate = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    // Update date every minute
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, [updateDate]);

  const formattedDate = useMemo(
    () => currentDate.toLocaleDateString('en-PH', dateFormatOptions),
    [currentDate, dateFormatOptions]
  );

  return (
    <Text style={style} {...props}>
      {formattedDate}
    </Text>
  );
});

CurrentDate.displayName = 'CurrentDate';

export default CurrentDate; 