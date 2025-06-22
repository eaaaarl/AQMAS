import { CounterScreen } from '@/features/counter';
import { SettingsScreen } from '@/features/settings';
import { useAppSelector } from '@/libs/redux/hooks';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Redirect } from 'expo-router';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TopTabs = createMaterialTopTabNavigator();

export default function TabLayout() {
  const emp = useAppSelector(state => state.employee);
  if (!emp.employee_id) {
    return <Redirect href={'/auth/login'} />;
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <TopTabs.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#64748b',
          tabBarIndicatorStyle: {
            backgroundColor: '#3b82f6',
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
            textTransform: 'none',
          },
          tabBarStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
          },
          tabBarLabel: ({ focused, color, children }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Ionicons
                name={children === 'Home' ? 'home' : 'cog-outline'}
                size={16}
                color={color}
              />
              <Text
                style={{
                  color,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}
              >
                {children}
              </Text>
            </View>
          ),
        }}
      >
        <TopTabs.Screen
          name="index"
          component={CounterScreen}
          options={{
            title: 'Home',
          }}
        />
        <TopTabs.Screen
          name="Setting"
          component={SettingsScreen}
          options={{
            title: 'Setting',
          }}
        />
      </TopTabs.Navigator>
    </SafeAreaView>
  );
}
