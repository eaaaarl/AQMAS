import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useBluetooth } from '../hooks/useBluetooth';

export default function BluetoothSettings() {
    const {
        bluetoothEnabled,
        bluetoothPermissions,
        pairedDevices,
        availableDevices,
        connectedDevice,
        isDiscovering,
        isConnecting,
        isTesting,
        debugInfo,
        requestBluetoothPermissions,
        startDiscovery,
        pairDevice,
        connectToDevice,
        disconnectDevice,
        clearDebugInfo,
        testThermalPrinter,
        testSimplePrint,
    } = useBluetooth();

    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height;
    const renderDevice = ({ item, isPaired = false }: { item: any, isPaired: boolean }) => (
        <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
            <View className="flex-1 ml-4">
                <Text className="font-medium text-gray-900">{item.name || 'Unknown Device'}</Text>
                <Text className="text-sm text-gray-500">{item.address}</Text>
            </View>
            <View style={{ marginRight: 10 }}>
                {isPaired ? (
                    <TouchableOpacity
                        onPress={() => connectToDevice(item)}
                        disabled={isConnecting || connectedDevice?.address === item.address}
                        className={`rounded-lg px-4 py-2 ${connectedDevice?.address === item.address
                            ? 'bg-green-100'
                            : isConnecting
                                ? 'bg-gray-100'
                                : 'bg-blue-100'
                            }`}
                    >
                        <Text className={`text-sm font-medium ${connectedDevice?.address === item.address
                            ? 'text-green-700'
                            : isConnecting
                                ? 'text-gray-500'
                                : 'text-blue-700'
                            }`}>
                            {connectedDevice?.address === item.address
                                ? 'Connected'
                                : isConnecting
                                    ? 'Connecting...'
                                    : 'Connect'
                            }
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => pairDevice(item)}
                        className="rounded-lg bg-orange-100 px-4 py-2"
                    >
                        <Text className="text-sm font-medium text-orange-700">Pair</Text>
                    </TouchableOpacity>
                )
                }
            </View >
        </View >
    );

    return (
        <View className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-4">
            <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                    Bluetooth Configuration
                </Text>
                <Text className="text-sm text-gray-600">
                    Manage Bluetooth connections and pairing
                </Text>
            </View>

            {/* Bluetooth Status */}
            <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm font-medium text-gray-700">Bluetooth Status</Text>
                    <View className={`rounded-full px-3 py-1 ${bluetoothEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Text className={`text-sm font-medium ${bluetoothEnabled ? 'text-green-700' : 'text-red-700'}`}>
                            {bluetoothEnabled ? 'Enabled' : 'Disabled'}
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-gray-700">Permissions</Text>
                    <View className="flex-row space-x-2">
                        <View className={`rounded-full px-3 py-1 ${bluetoothPermissions ? 'bg-green-100' : 'bg-red-100'}`}>
                            <Text className={`text-sm font-medium ${bluetoothPermissions ? 'text-green-700' : 'text-red-700'}`}>
                                {bluetoothPermissions ? 'Granted' : 'Denied'}
                            </Text>
                        </View>
                        {!bluetoothPermissions && (
                            <TouchableOpacity
                                onPress={requestBluetoothPermissions}
                                className="rounded-full bg-blue-100 px-3 py-1"
                            >
                                <Text className="text-sm font-medium text-blue-700">Grant</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {/* Connected Device Status */}
            {connectedDevice && (
                <View className="mb-4 rounded-lg bg-green-50 p-3">
                    <Text className="text-sm font-medium text-green-800 mb-1">Connected Device</Text>
                    <Text className="text-sm text-green-700">{connectedDevice.name}</Text>
                    <Text className="text-xs text-green-600">{connectedDevice.address}</Text>
                    <View className="flex-row space-x-2 mt-2">
                        <TouchableOpacity
                            onPress={disconnectDevice}
                            className="rounded-lg bg-red-100 py-2 px-3"
                        >
                            <Text className="text-sm font-medium text-red-700">Disconnect</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={testSimplePrint}
                            disabled={isTesting}
                            className={`rounded-lg py-2 px-3 ${isTesting ? 'bg-gray-100' : 'bg-orange-100'}`}
                        >
                            <Text className={`text-sm font-medium ${isTesting ? 'text-gray-500' : 'text-orange-700'}`}>
                                {isTesting ? 'Testing...' : 'Quick Test'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={testThermalPrinter}
                            disabled={isTesting}
                            className={`rounded-lg py-2 px-3 ${isTesting ? 'bg-gray-100' : 'bg-purple-100'}`}
                        >
                            <Text className={`text-sm font-medium ${isTesting ? 'text-gray-500' : 'text-purple-700'}`}>
                                {isTesting ? 'Testing...' : 'Full Test'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Discovery Button */}
            <View className={`${isLandscape ? 'items-center' : 'flex-1'}`}>
                <TouchableOpacity
                    onPress={startDiscovery}
                    disabled={isDiscovering || !bluetoothEnabled || !bluetoothPermissions}
                    className={`rounded-lg py-3 px-4 mb-4 ${isDiscovering || !bluetoothEnabled || !bluetoothPermissions
                        ? 'bg-gray-100'
                        : 'bg-purple-600 active:bg-purple-700'
                        }`}
                    activeOpacity={0.8}
                >
                    <View className="flex-row items-center justify-center gap-2">
                        <AntDesign name="search1" size={24} color="white" />
                        <Text className={`text-center text-base font-semibold ${isDiscovering || !bluetoothEnabled || !bluetoothPermissions
                            ? 'text-gray-500'
                            : 'text-white'
                            }`}>
                            {isDiscovering ? 'Discovering...' : 'Start Discovery'}
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>

            {/* Paired Devices */}
            {pairedDevices.length > 0 && (
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Paired Devices</Text>
                    <View className="rounded-lg border border-gray-200 bg-gray-50">
                        <FlatList
                            data={pairedDevices}
                            renderItem={({ item }) => renderDevice({ item, isPaired: true })}
                            keyExtractor={(item) => item.address}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
            )}

            {/* Available Devices */}
            {availableDevices.length > 0 && (
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Available Devices</Text>
                    <View className="rounded-lg border border-gray-200 bg-gray-50">
                        <FlatList
                            data={availableDevices}
                            renderItem={({ item }) => renderDevice({ item, isPaired: false })}
                            keyExtractor={(item) => item.address}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
            )}

            {/* Debug Information */}
            <View className="mt-4">
                <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-gray-900">
                        Debug Information
                    </Text>
                    <TouchableOpacity
                        onPress={clearDebugInfo}
                        className="rounded-lg bg-red-100 px-3 py-1"
                    >
                        <Text className="text-sm font-medium text-red-700">Clear</Text>
                    </TouchableOpacity>
                </View>
                <View className="rounded-lg bg-gray-900 p-4 max-h-40">
                    <ScrollView showsVerticalScrollIndicator={true}>
                        <Text className="text-xs text-green-400 font-mono">
                            {debugInfo || 'No debug information yet...'}
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
} 