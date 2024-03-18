import { useCallback, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';
import { COLORS } from '@/styles/theme';
import LoadFonts from '@/assets/fonts/fonts';
import { SplashScreen } from 'expo-router';

interface ToDo {
    id: string;
    task: string;
    status: boolean;
}

interface CheckboxListProps {
    taskData?: ToDo;
    onStatusChange?: (id: string, status: boolean) => void;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
    taskData,
    onStatusChange,
}) => {
    const [isChecked, setIsChecked] = useState(taskData?.status);

    const [fontsLoaded, fontError] = LoadFonts();

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const handleCheckboxChange = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        if (taskData) {
            onStatusChange && onStatusChange(taskData.id, newValue);
        }
    };
    return (
        <View onLayout={onLayoutRootView}>
            {taskData ? (
                <Pressable
                    style={styles.container}
                    onPress={() => handleCheckboxChange()}
                >
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={handleCheckboxChange}
                        color={isChecked ? COLORS.ORANGE_200 : undefined}
                    />
                    <Text
                        style={[
                            styles.text,
                            {
                                color: isChecked
                                    ? COLORS.ORANGE_200
                                    : COLORS.BLACK,
                                textDecorationLine: isChecked
                                    ? 'line-through'
                                    : 'none',
                            },
                        ]}
                    >
                        {taskData.task}
                    </Text>
                </Pressable>
            ) : (
                <View></View>
            )}
        </View>
    );
};

export default CheckboxList;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    text: {
        fontSize: 16,
        fontFamily: 'LexendDeca-Light',
    },
    checkbox: {
        margin: 8,
        borderRadius: 5,
    },
});
