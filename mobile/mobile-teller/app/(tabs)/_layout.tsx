import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TellerInterface from '.';
import Profile from './profile';

const TopTabs = createMaterialTopTabNavigator();

export default function TabLayout() {

    useEffect(() => {
        NavigationBar.setButtonStyleAsync("dark");
    }, [])

    return (
        <SafeAreaView className='flex-1 bg-white'>
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Ionicons
                                name={children === 'Home' ? 'home' : 'person'}
                                size={16}
                                color={color}
                            />
                            <Text style={{ color, fontWeight: 'bold', fontSize: 14 }}>
                                {children}
                            </Text>
                        </View>
                    ),
                }}
            >
                <TopTabs.Screen
                    name="index"
                    component={TellerInterface}
                    options={{
                        title: 'Home',
                    }}
                />
                <TopTabs.Screen
                    name="profile"
                    component={Profile}
                    options={{
                        title: 'Profile',
                    }}
                />
            </TopTabs.Navigator>
        </SafeAreaView>
    );
}