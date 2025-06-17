import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSurvey } from '../hooks/useSurvey';

export default function RenderQuestion() {

    const {
        current,
        satisfaction,
        setSatisfaction,
        branch,
        setBranch,
        comment,
        setComment
    } = useSurvey()

    switch (current.type) {
        case 'yesno':
            return (
                <View className="flex-1 justify-center px-8">
                    <Text className="text-3xl font-bold text-center mb-12">{current.question}</Text>
                    <View className="flex-row gap-6">
                        <TouchableOpacity
                            className={`flex-1 py-8 px-6 rounded-2xl border-2 ${satisfaction === 'yes' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-200'
                                }`}
                            onPress={() => setSatisfaction('yes')}
                        >
                            <Text className={`text-center font-bold text-2xl ${satisfaction === 'yes' ? 'text-white' : 'text-gray-700'
                                }`}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-8 px-6 rounded-2xl border-2 ${satisfaction === 'no' ? 'bg-red-500 border-red-500' : 'bg-white border-gray-200'
                                }`}
                            onPress={() => setSatisfaction('no')}
                        >
                            <Text className={`text-center font-bold text-2xl ${satisfaction === 'no' ? 'text-white' : 'text-gray-700'
                                }`}>
                                No
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );

        case 'choice':
            return (
                <View className="flex-1 justify-center px-8">
                    <Text className="text-3xl font-bold text-center mb-12">{current.question}</Text>
                    <View className="gap-4">
                        {['Main Branch', 'North Branch'].map((branchName) => (
                            <TouchableOpacity
                                key={branchName}
                                className={`py-6 px-8 rounded-2xl border-2 ${branch === branchName ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-200'
                                    }`}
                                onPress={() => setBranch(branchName)}
                            >
                                <Text className={`font-bold text-xl ${branch === branchName ? 'text-white' : 'text-gray-700'
                                    }`}>
                                    {branchName}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );

        case 'text':
            return (
                <View className="flex-1 justify-center px-8">
                    <Text className="text-3xl font-bold text-center mb-12">{current.question}</Text>
                    <TextInput
                        className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-40 text-lg"
                        placeholder="Your comments..."
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        textAlignVertical="top"
                    />
                </View>
            );

        default:
            return null;
    }
}