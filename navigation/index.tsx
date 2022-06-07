/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Ionicons } from '../components/VectorIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import FeedScreen from '../screens/FeedScreen';
import ExploreScreen from '../screens/ExploreScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Header from '../components/Header';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Group>
        </Stack.Navigator>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="Feed"
            screenOptions={{
                header: () => <Header />,
                tabBarActiveBackgroundColor: Colors[colorScheme].background,
                tabBarInactiveBackgroundColor: Colors[colorScheme].background,
                tabBarActiveTintColor: Colors[colorScheme].tabIconSelected,
                tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
                tabBarShowLabel: false,
            }}>
            <BottomTab.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home-sharp" : "home-outline"} color={color} />
                }}
            />
            <BottomTab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    //tabBarButton: Home,
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "compass-sharp" : "compass-outline"} color={color} />
                }}
            />
        </BottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
}) {
    return <Ionicons size={26} style={{ marginBottom: -3 }} {...props} />;
}
