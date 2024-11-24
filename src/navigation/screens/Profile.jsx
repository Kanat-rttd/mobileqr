// src/screens/Profile.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Profile({ user }) {
  const [role, setRole] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Получаем роль пользователя из Firestore
    const fetchUserRole = async () => {
      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setRole(userSnap.data().role);
      }
    };

    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        Alert.alert('Ошибка', 'Logout failed: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      {user && role === 'Teacher' && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TeacherProfile', { user, role })}
          >
            <Text style={styles.buttonText}>Информация пользователя</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('StudentsList')}
          >
            <Text style={styles.buttonText}>Список</Text>
          </TouchableOpacity>
        </>
      )}

      {user && role === "Student" && (
        <View style={styles.studentInfoContainer}>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Text style={styles.info}>Роль: {role === 'Teacher' ? 'Тренер' : 'Ученик'}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  studentInfoContainer: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  info: { fontSize: 18, marginBottom: 10, fontWeight: 600 },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
