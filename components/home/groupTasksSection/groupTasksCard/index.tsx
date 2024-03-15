import React, { useCallback, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { SplashScreen } from 'expo-router';
import LoadFonts from '../../../../assets/fonts/fonts';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/styles/theme';

interface GroupTaskCardProps {
    title?: string;
    tasksQuantity?: string;
    id?: string;
}

const GroupTaskCard: React.FC<GroupTaskCardProps> = ({
    title,
    tasksQuantity,
    id,
}) => {
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
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.card}>
                <Feather
                    name={title === 'Trabalho' ? 'briefcase' : 'book-open'}
                    size={20}
                    style={styles.groupIcon}
                />
                <View>
                    <Text style={styles.groupTitle}>{title}</Text>
                    <Text style={styles.groupQuantity}>
                        {tasksQuantity} tarefas
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default GroupTaskCard;

const styles = StyleSheet.create({
    container: {},
    emptyCard: {
        backgroundColor: 'transparent',
        borderWidth: 0.7,
        borderColor: COLORS.BLUE_400,
        borderStyle: 'dashed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingLeft: 24,
        paddingRight: 24,
        borderRadius: 24,
    },
    card: {
        padding: 20,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#afdaed39',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 14,
        borderWidth: 0.3,
        borderColor: COLORS.BLUE_300,
    },
    groupIcon: {
        padding: 16,
        backgroundColor: '#FD9E02',
        borderRadius: 50,
    },
    groupTitle: {
        fontFamily: 'LexendDeca-Regular',
        fontSize: 16,
    },
    groupQuantity: {
        fontFamily: 'LexendDeca-Light',
    },
});
