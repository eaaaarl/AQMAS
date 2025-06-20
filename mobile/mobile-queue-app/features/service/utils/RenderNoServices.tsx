import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';


interface RenderNoServiceProps {
    onRefresh?: () => void;
    title?: string;
    description?: string;
    buttonText?: string;
    showIcon?: boolean;
    iconName?: string;
    iconFamily?: 'Ionicons' | 'MaterialIcons';
    type?: 'empty' | 'search' | 'offline' | 'maintenance';
}

export function RenderNoServices(props: RenderNoServiceProps) {
    const {
        onRefresh,
        title = 'No Services Available',
        description = 'There are currently no services to display. Try refreshing to check for updates.',
        buttonText = 'Refresh',
        showIcon = true,
        iconName,
        iconFamily = 'Ionicons',
        type = 'empty'
    } = props;

    const getDefaultIcon = () => {
        switch (type) {
            case 'search':
                return { name: 'search-outline', family: 'Ionicons' };
            case 'offline':
                return { name: 'cloud-offline-outline', family: 'Ionicons' };
            case 'maintenance':
                return { name: 'construct-outline', family: 'Ionicons' };
            default:
                return { name: 'document-text-outline', family: 'Ionicons' };
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'search': return '#8b5cf6';
            case 'offline': return '#f59e0b';
            case 'maintenance': return '#06b6d4';
            default: return '#6b7280';
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'search': return 'bg-purple-500';
            case 'offline': return 'bg-amber-500';
            case 'maintenance': return 'bg-cyan-500';
            default: return 'bg-blue-500';
        }
    };

    const getButtonActiveColor = () => {
        switch (type) {
            case 'search': return 'active:bg-purple-600';
            case 'offline': return 'active:bg-amber-600';
            case 'maintenance': return 'active:bg-cyan-600';
            default: return 'active:bg-blue-600';
        }
    };

    const iconConfig = iconName ?
        { name: iconName, family: iconFamily } :
        getDefaultIcon();

    const IconComponent = iconConfig.family === 'MaterialIcons' ? MaterialIcons : Ionicons;

    return (
        <View className="flex-1 items-center justify-center">
            {showIcon && (
                <View className="mb-6">
                    <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-lg mb-4">
                        <IconComponent
                            name={iconConfig.name as any}
                            size={40}
                            color={getIconColor()}
                        />
                    </View>
                </View>
            )}

            <View className="items-center mb-8">
                <Text className="text-2xl font-bold text-gray-800 text-center mb-3">
                    {title}
                </Text>
                <Text className="text-base text-gray-600 text-center leading-relaxed">
                    {description}
                </Text>
            </View>

            {onRefresh && (
                <View className="max-w-sm">
                    <TouchableOpacity
                        onPress={onRefresh}
                        className={`${getButtonColor()} ${getButtonActiveColor()} px-8 py-4 rounded-xl flex-row items-center justify-center shadow-sm`}
                    >
                        <MaterialIcons name="refresh" size={20} color="white" />
                        <Text className="text-white font-semibold text-lg ml-2">
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}


/**
 * Examples showcasing different ways to use the RenderNoServices component.
 * 
 * @example Basic Usage
 * ```tsx
 * <RenderNoServices onRefresh={() => {}} />
 * ```
 * 
 * @example Custom Empty State
 * ```tsx
 * <RenderNoServices
 *   title="Custom Title"
 *   description="Custom description"
 *   buttonText="Custom Button"
 *   onRefresh={() => {}}
 * />
 * ```
 * 
 * @property {object} basic - Basic implementation with just refresh callback
 * @property {object} custom - Custom empty state with title, description and button text
 * @property {object} search - Search results empty state variation
 * @property {object} offline - Offline state variation
 * @property {object} maintenance - Maintenance mode variation
 * @property {object} noButton - Example without refresh button
 * @property {object} customIcon - Custom icon implementation
 * 
 * @remarks
 * The component supports various predefined types:
 * - default (basic)
 * - search
 * - offline  
 * - maintenance
 * 
 * Each type comes with its own default styling and icon, but can be customized
 * through props.
 * 
 * @see RenderNoServices for full component documentation
 */

