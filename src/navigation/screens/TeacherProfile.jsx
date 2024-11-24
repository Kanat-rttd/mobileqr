// src/screens/TeacherProfile.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function TeacherProfile() {
  const route = useRoute();
  const { user, role } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.info}>Email: {user.email}</Text>
      <Text style={styles.info}>Роль: {role === 'Teacher' ? 'Тренер' : 'Ученик'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  info: { fontSize: 18, marginBottom: 10 },
});
