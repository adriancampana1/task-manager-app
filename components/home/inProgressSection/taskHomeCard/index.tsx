import React, { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SplashScreen } from 'expo-router';
import LoadFonts from '../../../../assets/fonts/fonts';

import { COLORS } from '@/styles/theme';

interface TaskHomeCardProps {
    id: string | number;
    title: string;
    taskGroup: string;
    description: string;
    startDate: string;
    endDate: string;
}

const TaskHomeCard: React.FC<TaskHomeCardProps> = ({
    title,
    taskGroup,
    description,
    startDate,
    endDate,
}) => {
    const formatDate = (date: string) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        return formattedDate;
    };

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
                <Text style={styles.title}>{title}</Text>
                {description ? (
                    <Text style={styles.taskDescription}>{description}</Text>
                ) : (
                    <></>
                )}
                <View style={styles.divider}></View>
                <View style={styles.footer}>
                    <View style={styles.taskGroup}>
                        <Text style={styles.taskGroupText}>
                            Categoria: {taskGroup}
                        </Text>
                    </View>
                    <Text style={styles.date}>{`${formatDate(
                        startDate
                    )} -- ${formatDate(endDate)}`}</Text>
                </View>
            </View>
        </View>
    );
};

export default TaskHomeCard;

const styles = StyleSheet.create({
    container: {},
    card: {
        minHeight: 110,
        display: 'flex',
        justifyContent: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.3,
        borderColor: COLORS.BLACK,
    },
    title: {
        fontFamily: 'LexendDeca-Regular',
        fontSize: 18,
    },
    date: {
        fontFamily: 'LexendDeca-Light',
        fontSize: 16,
        opacity: 0.6,
    },
    taskDescription: {
        fontFamily: 'LexendDeca-Light',
        fontSize: 14,
    },
    taskGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    taskGroupText: {
        fontFamily: 'LexendDeca-Light',
        fontSize: 14,
    },
    divider: {
        borderTopWidth: 0.2,
        borderColor: COLORS.BLUE_400,
        borderStyle: 'dotted',
    },
    footer: {
        gap: 6,
    },
});
