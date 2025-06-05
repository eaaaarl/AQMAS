import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TellerInterface() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      <StatusBar style="dark" />

      <View className="bg-blue-800 rounded-lg p-4 mb-4 shadow-md">
        <Text className="text-white text-2xl font-bold text-center">Teller Dashboard</Text>
      </View>

      <View className="flex-row items-center bg-white p-3 rounded-lg shadow-sm mb-4">
        <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
          <Text className="text-white font-bold text-lg">TJ</Text>
        </View>
        <View>
          <Text className="text-lg font-semibold">Teller John</Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-1"></View>
            <Text className="text-gray-600">Counter 3 - Active</Text>
          </View>
        </View>
      </View>

      <View className="bg-red-500 rounded-lg p-5 mb-4 shadow-lg">
        <Text className="text-white text-center text-lg">Now Serving</Text>
        <Text className="text-white text-center text-5xl font-bold my-2">B205</Text>
        <Text className="text-white text-center">Regular Service</Text>
      </View>

      <View className="flex-row flex-wrap justify-between mb-4">
        <TouchableOpacity className="bg-blue-500 px-4 py-3 rounded-lg w-[48%] mb-2 items-center">
          <Text className="text-white font-bold">Call Next</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-red-500 px-4 py-3 rounded-lg w-[48%] mb-2 items-center">
          <Text className="text-white font-bold">Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-green-500 px-4 py-3 rounded-lg w-[48%] items-center">
          <Text className="text-white font-bold">Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-500 px-4 py-3 rounded-lg w-[48%] items-center">
          <Text className="text-white font-bold">Recall</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-2">Search by Ticket Number</Text>
        <View className="flex-row items-center bg-white p-3 rounded-lg shadow-sm">
          <TextInput
            className="flex-1 text-gray-700"
          />
          <TouchableOpacity className="ml-3 bg-blue-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-bold">Search</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View className="bg-white rounded-lg p-3 shadow-sm flex-1">
        <View className="flex-row justify-between items-center mb-3 pb-2 border-b border-gray-200">
          <Text className="font-bold text-lg">Queue List</Text>
          <Text className="text-gray-500">5 waiting</Text>
        </View>

        <ScrollView>
          {['B206', 'B207', 'P101', 'B208', 'P102'].map((number, index) => (
            <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></View>
                <Text className="font-medium">{number}</Text>
              </View>
              <View className={`px-2 py-1 rounded-full ${number.startsWith('P') ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <Text className={`text-xs font-bold ${number.startsWith('P') ? 'text-green-800' : 'text-yellow-800'}`}>
                  {number.startsWith('P') ? 'Priority' : 'Regular'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}