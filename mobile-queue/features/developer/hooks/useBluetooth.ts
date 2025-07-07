import EscPosEncoder from "@manhnd/esc-pos-encoder";
import { useEffect, useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import RNBluetoothClassic, {
    BluetoothDevice,
} from "react-native-bluetooth-classic";

export function useBluetooth() {
  // Bluetooth states
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [bluetoothPermissions, setBluetoothPermissions] = useState(false);
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>(
    []
  );
  const [connectedDevice, setConnectedDevice] =
    useState<BluetoothDevice | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    requestBluetoothPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo((prev) => `[${timestamp}] ${info}\n${prev}`);
  };

  const requestBluetoothPermissions = async () => {
    addDebugInfo("Requesting Bluetooth permissions...");
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        const allPermissionsGranted = Object.values(granted).every(
          (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
        );
        if (allPermissionsGranted) {
          setBluetoothPermissions(true);
          addDebugInfo("All Bluetooth permissions granted");
          await checkBluetoothStatus();
          await loadPairedDevices();
          await checkConnectedDevices();
        } else {
          setBluetoothPermissions(false);
          addDebugInfo("Some Bluetooth permissions denied");
          Alert.alert(
            "Permissions Required",
            "Bluetooth permissions are required for device discovery and connection. Please grant permissions in Settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Retry", onPress: requestBluetoothPermissions },
            ]
          );
        }
      } else {
        setBluetoothPermissions(true);
        addDebugInfo("iOS - Bluetooth permissions assumed");
        await checkBluetoothStatus();
        await loadPairedDevices();
        await checkConnectedDevices();
      }
    } catch (error: any) {
      addDebugInfo(`Permission request error: ${error.message}`);
      setBluetoothPermissions(false);
      Alert.alert(
        "Permission Error",
        `Error requesting Bluetooth permissions: ${error.message}`
      );
    }
  };

  const checkBluetoothStatus = async () => {
    try {
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      setBluetoothEnabled(enabled);
      addDebugInfo(`Bluetooth enabled: ${enabled}`);
    } catch (error: any) {
      addDebugInfo(`Error checking Bluetooth status: ${error.message}`);
    }
  };

  const loadPairedDevices = async () => {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      setPairedDevices(devices);
      addDebugInfo(`Found ${devices.length} paired devices`);
    } catch (error: any) {
      addDebugInfo(`Error loading paired devices: ${error.message}`);
    }
  };

  const checkConnectedDevices = async () => {
    try {
      const devices = await RNBluetoothClassic.getConnectedDevices();
      if (devices.length > 0) {
        setConnectedDevice(devices[0]);
        addDebugInfo(`Already connected to: ${devices[0].name}`);
      } else {
        setConnectedDevice(null);
        addDebugInfo("No devices currently connected");
      }
    } catch (error: any) {
      addDebugInfo(`Error checking connected devices: ${error.message}`);
    }
  };

  const startDiscovery = async () => {
    if (!bluetoothEnabled) {
      Alert.alert("Bluetooth Disabled", "Please enable Bluetooth first");
      return;
    }
    if (!bluetoothPermissions) {
      Alert.alert(
        "Permissions Required",
        "Bluetooth permissions are required for device discovery",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Grant Permissions", onPress: requestBluetoothPermissions },
        ]
      );
      return;
    }
    setIsDiscovering(true);
    setAvailableDevices([]);
    addDebugInfo("Starting device discovery...");
    try {
      const devices = await RNBluetoothClassic.startDiscovery();
      setAvailableDevices(devices);
      addDebugInfo(`Discovery completed. Found ${devices.length} devices`);
    } catch (error: any) {
      addDebugInfo(`Discovery error: ${error.message}`);
      Alert.alert("Discovery Error", error.message);
    } finally {
      setIsDiscovering(false);
    }
  };

  const pairDevice = async (device: BluetoothDevice) => {
    addDebugInfo(`Attempting to pair with: ${device.name}`);
    try {
      const paired = await RNBluetoothClassic.pairDevice(device.address);
      if (paired) {
        addDebugInfo(`Successfully paired with: ${device.name}`);
        loadPairedDevices();
        Alert.alert("Success", `Paired with ${device.name}`);
      } else {
        addDebugInfo(`Failed to pair with: ${device.name}`);
        Alert.alert("Pairing Failed", `Could not pair with ${device.name}`);
      }
    } catch (error: any) {
      addDebugInfo(`Pairing error: ${error.message}`);
      Alert.alert("Pairing Error", error.message);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    if (connectedDevice) {
      Alert.alert(
        "Already Connected",
        `Disconnect from ${connectedDevice.name} first`
      );
      return;
    }
    setIsConnecting(true);
    addDebugInfo(`Connecting to: ${device.name}`);
    try {
      const connected = await RNBluetoothClassic.connectToDevice(
        device.address
      );
      if (connected) {
        setConnectedDevice(device);
        addDebugInfo(`Successfully connected to: ${device.name}`);
        Alert.alert("Connected", `Connected to ${device.name}`);
      } else {
        addDebugInfo(`Failed to connect to: ${device.name}`);
        Alert.alert("Connection Failed", `Could not connect to ${device.name}`);
      }
    } catch (error: any) {
      addDebugInfo(`Connection error: ${error.message}`);
      Alert.alert("Connection Error", error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    if (!connectedDevice) return;
    addDebugInfo(`Disconnecting from: ${connectedDevice.name}`);
    try {
      await RNBluetoothClassic.disconnectFromDevice(connectedDevice.address);
      setConnectedDevice(null);
      addDebugInfo("Successfully disconnected");
      Alert.alert("Disconnected", "Device disconnected");
    } catch (error: any) {
      addDebugInfo(`Disconnect error: ${error.message}`);
      Alert.alert("Disconnect Error", error.message);
    }
  };

  const clearDebugInfo = () => {
    setDebugInfo("");
  };

  const testThermalPrinter = async () => {
    if (!connectedDevice) {
      Alert.alert(
        "No Device Connected",
        "Please connect to a Bluetooth thermal printer first"
      );
      return;
    }
    setIsTesting(true);
    addDebugInfo("Starting thermal printer test...");
    try {
      const encoder = new EscPosEncoder();
      const testData = encoder
        .initialize()
        .align("center")
        .bold(true)
        .size(1)
        .text("THERMAL PRINTER TEST")
        .newline()
        .text("===================")
        .newline()
        .bold(false)
        .align("left")
        .text("Device: " + connectedDevice.name)
        .newline()
        .text("Address: " + connectedDevice.address)
        .newline()
        .text("Test Time: " + new Date().toLocaleString())
        .newline()
        .align("center")
        .text("--- TEST PATTERNS ---")
        .newline()
        .align("left")
        .text("Normal Text: Hello World!")
        .newline()
        .bold(true)
        .text("Bold Text: This is bold")
        .newline()
        .bold(false)
        .size(0)
        .text("Small Text: Compact printing")
        .newline()
        .size(1)
        .underline(true)
        .text("Underlined Text")
        .newline()
        .underline(false)
        .newline()
        .align("center")
        .text("--- ALIGNMENT TEST ---")
        .newline()
        .align("left")
        .text("Left aligned text")
        .newline()
        .align("center")
        .text("Center aligned text")
        .newline()
        .align("right")
        .text("Right aligned text")
        .newline()
        .align("left")
        .newline()
        .text("--- SPECIAL CHARACTERS ---")
        .newline()
        .text("Currency: $ € £ ¥")
        .newline()
        .text("Symbols: © ® ™ § °")
        .newline()
        .text("Numbers: 0123456789")
        .newline()
        .align("center")
        .text("--- QR CODE TEST ---")
        .newline()
        .qrcode("https://example.com/test", 1, 8, "h")
        .newline()
        .text("QR Code: https://example.com/test")
        .newline()
        .text("--- BARCODE TEST ---")
        .newline()
        .barcode("1234567890", "code128", 60)
        .newline()
        .text("Barcode: 1234567890")
        .newline()
        .align("center")
        .bold(true)
        .text("TEST COMPLETED")
        .newline()
        .bold(false)
        .text("If you can see this clearly,")
        .newline()
        .text("your thermal printer is working!")
        .newline()
        .cut()
        .encode();
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(testData)));
      addDebugInfo(
        `Sending test data (${testData.length} bytes) to printer...`
      );
      const result = await RNBluetoothClassic.writeToDevice(
        connectedDevice.address,
        base64Data,
        "base64"
      );
      if (result) {
        addDebugInfo("Test print sent successfully!");
        Alert.alert(
          "Test Sent!",
          "Test receipt has been sent to the thermal printer. Check if it prints correctly.",
          [{ text: "OK", style: "default" }]
        );
      } else {
        addDebugInfo("Failed to send test data");
        Alert.alert("Test Failed", "Could not send test data to printer");
      }
    } catch (error: any) {
      addDebugInfo(`Thermal printer test error: ${error.message}`);
      Alert.alert(
        "Test Error",
        `Error testing thermal printer: ${error.message}`
      );
    } finally {
      setIsTesting(false);
    }
  };

  const testSimplePrint = async () => {
    if (!connectedDevice) {
      Alert.alert(
        "No Device Connected",
        "Please connect to a Bluetooth thermal printer first"
      );
      return;
    }
    setIsTesting(true);
    addDebugInfo("Starting simple print test...");
    try {
      const encoder = new EscPosEncoder();
      const simpleData = encoder
        .initialize()
        .align("center")
        .bold(true)
        .text("SIMPLE TEST")
        .newline()
        .bold(false)
        .text("Hello from React Native!")
        .newline()
        .text(new Date().toLocaleString())
        .newline()
        .cut()
        .encode();
      const base64Data = btoa(
        String.fromCharCode(...new Uint8Array(simpleData))
      );
      addDebugInfo(`Sending simple test (${simpleData.length} bytes)...`);
      const result = await RNBluetoothClassic.writeToDevice(
        connectedDevice.address,
        base64Data,
        "base64"
      );
      if (result) {
        addDebugInfo("Simple test sent successfully!");
        Alert.alert(
          "Simple Test Sent!",
          "Check your thermal printer for output."
        );
      } else {
        addDebugInfo("Failed to send simple test");
        Alert.alert("Test Failed", "Could not send simple test to printer");
      }
    } catch (error: any) {
      addDebugInfo(`Simple print test error: ${error.message}`);
      Alert.alert("Test Error", `Error in simple print test: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return {
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
    checkBluetoothStatus,
    loadPairedDevices,
    checkConnectedDevices,
    startDiscovery,
    pairDevice,
    connectToDevice,
    disconnectDevice,
    clearDebugInfo,
    testThermalPrinter,
    testSimplePrint,
    addDebugInfo,
  };
}
