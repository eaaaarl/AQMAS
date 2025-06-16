import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function TellerInterface() {
  return (
    <View className="flex-1 p-4">
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
        <View className="flex-row items-center bg-white p-3 rounded-lg shadow-sm">
          <TextInput
            className="flex-1 text-gray-700"
            placeholder="Enter ticket number"
          />
          <TouchableOpacity className="ml-3 bg-blue-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-bold">Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-white rounded-lg p-3 shadow-sm flex-1" >
        <View className="flex-row justify-between items-center mb-3 pb-2 border-b border-gray-200">
          <Text className="font-bold text-lg">Queue List</Text>
          <Text className="font-bold">5 Waiting</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={true}>
          {['B206', 'B207', 'P101', 'B208', 'P102', 'B209', 'P103', 'B210', 'P104', 'B211'].map((number, index) => (
            <TouchableOpacity key={index} onPress={() => Alert.alert(number)}>
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
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View >
  );
}