import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TextProps } from 'react-native';

interface CurrentTimeProps extends TextProps {
  style?: TextProps['style'];
}

const CurrentTime = memo(({ style, ...props }: CurrentTimeProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const timeFormatOptions = useMemo(
    () => ({
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      second: '2-digit' as const,
      hour12: true,
    }),
    []
  );

  const updateTime = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [updateTime]);

  const formattedTime = useMemo(
    () => currentTime.toLocaleTimeString('en-PH', timeFormatOptions),
    [currentTime, timeFormatOptions]
  );

  return (
    <Text style={style} {...props}>
      {formattedTime}
    </Text>
  );
});

CurrentTime.displayName = 'CurrentTime';

export default CurrentTime;