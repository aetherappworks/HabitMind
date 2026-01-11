import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../hooks/useNotifications';
import { useNotificationNavigation } from '../hooks/useNotificationNavigation';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/habits/DashboardScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import CreditsScreen from '../screens/user/CreditsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function HabitsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Meus Hábitos' }}
      />
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Meu Perfil' }}
      />
      <Stack.Screen
        name="Credits"
        component={CreditsScreen}
        options={{ title: 'Créditos' }}
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HabitsTab') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'UserTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen
        name="HabitsTab"
        component={HabitsStack}
        options={{ title: 'Hábitos' }}
      />
      <Tab.Screen
        name="UserTab"
        component={UserStack}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

function NavigatorContent() {
  const { isAuthenticated } = useAuthStore();
  const { handleNotificationTapped } = useNotificationNavigation();

  // Inicializar notificações push (dentro do NavigationContainer)
  useNotifications({
    onNotificationTapped: handleNotificationTapped,
  });

  return isAuthenticated ? <AppTabs /> : <AuthStack />;
}

export default function RootNavigator() {
  const { isLoading, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return null; // Show splash screen
  }

  return (
    <NavigationContainer>
      <NavigatorContent />
    </NavigationContainer>
  );
}
