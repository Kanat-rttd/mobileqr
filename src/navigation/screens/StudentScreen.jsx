// src/screens/StudentScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeFormat } from 'expo-camera';
import { auth, firestore } from '../../firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function StudentScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!permission || permission.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = (result) => {
    if (scanned) return;
    setScanned(true);
  
    // Сохраняем данные в Firestore
    const userEmail = auth.currentUser.email;
  
    const timestamp = Timestamp.now();
  
    addDoc(collection(firestore, 'registrations'), {
      email: userEmail,
      date: timestamp, // Сохраняем Timestamp вместо строки
      qrValue: result.data,
    })
      .then(() => {
        console.log('Регистрация сохранена');
      })
      .catch((error) => {
        console.error('Ошибка при сохранении регистрации: ', error);
      });
  
    // Показываем оповещение и закрываем камеру после нажатия "OK"
    Alert.alert(
      'Вы записаны',
      '',
      [
        {
          text: 'OK',
          onPress: () => {
            setScanning(false);
            setScanned(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!permission) {
    // Ожидание разрешения
    return <View />;
  }

  if (!permission.granted) {
    // Разрешение не предоставлено
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Необходимо разрешение на использование камеры</Text>
        <Button onPress={requestPermission} title="Разрешить доступ к камере" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {scanning ? (
        <CameraView
          style={styles.camera}
          facing={'back'}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeFormats: ['qr'],
          }}
        >
          {/* Здесь можно добавить элементы интерфейса поверх камеры */}
        </CameraView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Экран ученика</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScanning(true)}
          >
            <Text style={styles.buttonText}>Сканировать</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: {
    textAlign: 'center',
    padding: 16,
  },
  camera: {
    flex: 1,
  },
  title: { fontSize: 24, marginBottom: 20 },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
    // width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
