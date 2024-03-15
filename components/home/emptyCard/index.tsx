import React, { useCallback, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { SplashScreen } from 'expo-router';
import LoadFonts from '../../../assets/fonts/fonts';

import { COLORS } from '@/styles/theme';

const EmptyCard: React.FC = () => {
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
            <View style={styles.emptyCard}>
                <Text style={styles.groupTitle}>
                    Nenhuma informação adicionada.
                </Text>
                <Text style={styles.groupQuantity}>
                    Insira novo registro na aba "Adicionar"
                </Text>
            </View>
        </View>
    );
};

export default EmptyCard;

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

    groupTitle: {
        fontFamily: 'LexendDeca-Regular',
        fontSize: 16,
    },
    groupQuantity: {
        fontFamily: 'LexendDeca-Light',
    },
});
