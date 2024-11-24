// src/navigation/MainNavContainer.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';
import TeacherScreen from './screens/TeacherScreen';
import StudentScreen from './screens/StudentScreen';
import Profile from './screens/Profile';
import StudentsList from './screens/StudentsList';
import TeacherProfile from './screens/TeacherProfile';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

export default function MainNavContainer({ role, user }) {
    if (!role) {
        // Если роль не определена, можно показать загрузку или экран по умолчанию
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Загрузка...</Text>
          </View>
        );
      }
  // Определяем, какой экран отображать на главной вкладке
  const MainScreen = role === 'Teacher' ? TeacherScreen : StudentScreen;

  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Main') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: { height: 50, padding: 10 },
      })}
    >
      <Tab.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Profile"
        // component={Profile}
        options={{ headerShown: false }}
      >
        {() => <ProfileStackScreen role={role} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

function ProfileStackScreen({ role, user }) {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        // component={Profile}
        options={{ headerShown: false }}
      >
        {() => <Profile user={user} />}
      </ProfileStack.Screen>
      
      {role === 'Teacher' && (
        <>
          <ProfileStack.Screen
            name="TeacherProfile"
            component={TeacherProfile}
            options={{ title: 'Информация пользователя' }}
          />
          <ProfileStack.Screen
            name="StudentsList"
            component={StudentsList}
            options={{ title: 'Список учеников' }}
          />
        </>
      )}
    </ProfileStack.Navigator>
  );
}