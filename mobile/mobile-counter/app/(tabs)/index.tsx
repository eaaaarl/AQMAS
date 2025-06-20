import { useGetEmployeeInfoQuery, useGetEmployeeRoleQuery } from '@/features/auth/api/authApi';
import { useGetConfigQuery } from '@/features/config/api/configApi';
import { useAppSelector } from '@/libs/redux/hooks';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function CounterScreen() {
  // GET CONFIG
  const { data: config } = useGetConfigQuery()

  // GET STATE EMPLOYEE INFORMATION
  const emp = useAppSelector((state) => state.employee)

  // GET EMPLOYEE INFORMATION 
  const { data: empInfo } = useGetEmployeeInfoQuery({ empId: emp.employee_id as number })
  const empInformation = empInfo?.results || [];

  // GET EMPLOYE ROLE BY EMPLOYEE ID
  const { data: empRole } = useGetEmployeeRoleQuery({ emp_id: empInformation?.[0]?.employee_id })

  // GET ROLE NAME
  const roleName = empRole?.[0]?.role_name;

  // GET COUNTER NO
  const counterNo = empRole?.[0]?.counter_no;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTicket, setCurrentTicket] = useState({
    number: 'CR1RE',
    customerName: 'EARL1',
    service: 'CREDIT',
    customerType: 'REGULAR CUSTOMER II',
    finished: 0,
    skipped: 0,
    bestTime: '',
    worstTime: '',
    remaining: 16
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    Alert.alert('Next', 'Moving to next customer');
  };

  const handleRecall = () => {
    Alert.alert('Recall', 'Recalling current customer');
  };

  const handleFinished = () => {
    Alert.alert('Finished', 'Marking customer as finished');
    setCurrentTicket(prev => ({
      ...prev,
      finished: prev.finished + 1,
      remaining: prev.remaining - 1
    }));
  };

  const handleSkip = () => {
    Alert.alert('Skip', 'Skipping current customer');
    setCurrentTicket(prev => ({
      ...prev,
      skipped: prev.skipped + 1,
      remaining: prev.remaining - 1
    }));
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#1c3f83" />
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <View style={{ backgroundColor: '#1c3f83' }} className="px-6 py-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white text-lg font-semibold">{config?.[0]?.Value} {counterNo}</Text>
              <TouchableOpacity>
                <Text className="text-white/80 text-xl">☰</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text className="text-white/80 text-sm">{counterNo} {roleName}</Text>
              <Text className="text-white text-xl font-bold">
                {currentTime.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </Text>
              <Text className="text-white/80 text-sm">
                Today, {currentTime.toLocaleDateString('en-PH', { day: '2-digit', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>

          <View className="px-6 py-8 items-center">
            <Text className="text-gray-500 text-sm mb-2">Ticket Number</Text>
            <Text className="text-orange-500 text-5xl font-bold tracking-widest mb-4">
              {currentTicket.number}
            </Text>
            <Text className="text-gray-500 text-sm mb-1">Customer Name</Text>
            <Text style={{ color: '#1c3f83' }} className="text-xl font-semibold">
              {currentTicket.customerName}
            </Text>
          </View>

          <View className="px-6 pb-6">
            <View className="flex-row gap-3 mb-3">
              <TouchableOpacity
                onPress={handleNext}
                style={{ backgroundColor: '#1c3f83' }}
                className="flex-1 active:opacity-80 py-3 rounded-xl"
              >
                <Text className="text-white font-medium text-center">→ Next</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRecall}
                style={{ backgroundColor: '#1c3f83' }}
                className="flex-1 active:opacity-80 py-3 rounded-xl"
              >
                <Text className="text-white font-medium text-center">↻ Recall</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                onPress={handleFinished}
                style={{ backgroundColor: '#1c3f83' }}
                className="flex-1 active:opacity-80 py-3 rounded-xl"
              >
                <Text className="text-white font-medium text-center">✓ Finished</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSkip}
                style={{ backgroundColor: '#1c3f83' }}
                className="flex-1 active:opacity-80 py-3 rounded-xl"
              >
                <Text className="text-white font-medium text-center">⏭ Skip</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-6 pb-6">
            <View className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-300">
              <View className="items-center mb-4">
                <Text className="text-gray-500 text-sm mb-1">Service</Text>
                <Text style={{ color: '#1c3f83' }} className="text-lg font-semibold">
                  {currentTicket.service}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-500 text-sm mb-1">Customer Type</Text>
                <Text style={{ color: '#1c3f83' }} className="font-medium text-center">
                  {currentTicket.customerType}
                </Text>
              </View>
            </View>
          </View>

          <View className="px-6 pb-6">
            <Text className="text-gray-500 text-sm font-medium mb-4 text-center">Summary</Text>
            <View className="space-y-3 gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Finished</Text>
                <Text style={{ color: '#1c3f83' }} className="font-semibold">
                  {currentTicket.finished}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Skipped</Text>
                <Text style={{ color: '#1c3f83' }} className="font-semibold">
                  {currentTicket.skipped}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Best Time</Text>
                <Text className="text-gray-400">
                  {currentTicket.bestTime || '-'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Worst Time</Text>
                <Text className="text-gray-400">
                  {currentTicket.worstTime || '-'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center border-t border-gray-200 pt-3">
                <Text className="text-gray-600 font-medium">Remaining</Text>
                <Text style={{ color: '#1c3f83' }} className="font-bold text-lg">
                  {currentTicket.remaining}
                </Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}