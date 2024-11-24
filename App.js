// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from './src/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

import MainNavContainer from './src/navigation/MainNavContainer';
import Login from './src/Login';
import Registration from './src/Registration';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Добавлено состояние загрузки

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
        // Получаем роль пользователя из Firestore
        try {
          const userRef = doc(firestore, 'users', authenticatedUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setRole(userSnap.data().role);
          } else {
            console.log('Роль пользователя не найдена.');
            setRole(null);
          }
        } catch (error) {
          console.error('Ошибка при получении роли пользователя:', error);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false); // Устанавливаем loading в false после завершения
    });

    return unsubscribe;
  }, []);

  if (loading) {
    // Показываем индикатор загрузки, пока не получим роль
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Если пользователь авторизован, показываем основной контейнер
          <Stack.Screen
            name="MainNavContainer"
            options={{ headerShown: false }}
          >
            {() => <MainNavContainer role={role} user={user}/>}
          </Stack.Screen>
        ) : (
          // Иначе показываем экраны аутентификации
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Registration"
              component={Registration}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
