// src/screens/TeacherScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function TeacherScreen() {
  const [qrValue, setQrValue] = useState('');
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef(null);

  const generateQRCode = () => {
    // Генерируем случайное значение для QR-кода
    const newQrValue = Math.random().toString(36).substring(2);
    setQrValue(newQrValue);
    setTimer(30);

    // Очищаем существующие интервалы
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Запускаем таймер обратного отсчета
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          // Регенерируем QR-код, когда таймер достигает 0
          generateQRCode();
          return 30;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Очистка при размонтировании компонента
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const closeQRCode = () => {
    setQrValue('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Экран учителя</Text>
      {qrValue ? (
        <>
          <QRCode value={qrValue} size={200} />
          <Text style={styles.timer}>Новый QR через: {timer} сек</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={closeQRCode}
          >
            <Text style={styles.buttonText}>Закрыть QR</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={generateQRCode}
        >
          <Text style={styles.buttonText}>Создать QR</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  timer: { marginTop: 20, fontSize: 18 },
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
