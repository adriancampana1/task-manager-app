import { useCallback, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';
import { COLORS } from '@/styles/theme';
import LoadFonts from '@/assets/fonts/fonts';
import { SplashScreen } from 'expo-router';

interface ToDo {
    task: string;
    status: string;
}

interface CheckboxListProps {
    taskData?: ToDo;
}

const CheckboxList: React.FC<CheckboxListProps> = ({ taskData }) => {
    const [isChecked, setIsChecked] = useState(false);

    const [fontsLoaded, fontError] = LoadFonts();

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }
    return (
        <View>
            {taskData ? (
                <Pressable
                    style={styles.container}
                    onPress={() => setIsChecked(!isChecked)}
                >
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setIsChecked}
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
