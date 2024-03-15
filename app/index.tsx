import { useCallback } from 'react';
import LoadFonts from '../assets/fonts/fonts';
import * as SplashScreen from 'expo-splash-screen';

import {
    Image,
    Text,
    View,
    StatusBar,
    Pressable,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';

const InitialPageImage = require('../assets/images/initialPageImage.webp');

import { useRouter } from 'expo-router';

const InitialPage = () => {
    const router = useRouter();

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
            <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="#F1F1F1"
            />
            <Image
                source={InitialPageImage}
                style={styles.initialImage}
                resizeMode="center"
            />
            <View style={styles.content}>
                <Text style={styles.titleContent}>
                    Gerenciador de Atividades
                </Text>
                <Text style={styles.textContent}>
                    Esta ferramenta foi desenvolvida para auxiliar no controle
                    de suas atividades e melhorar sua produtividade.
                </Text>
                <Pressable
                    style={styles.button}
                    onPress={() => router.navigate('/home')}
                >
                    <Text style={styles.textButton}>Iniciar</Text>
                    <MaterialIcons
                        name="arrow-right-alt"
                        size={32}
                        style={styles.iconButton}
                    />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        marginTop: 54,
    },
    content: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    initialImage: {
        flex: 1,
    },
    titleContent: {
        color: COLORS.BLUE_500,
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'LexendDeca-Bold',
    },
    textContent: {
        color: COLORS.BLUE_500,
        fontSize: 16,
        textAlign: 'center',
        paddingTop: 6,
        fontFamily: 'LexendDeca-Light',
    },
    button: {
        backgroundColor: COLORS.BLUE_400,
        padding: 8,
        paddingBottom: 10,
        paddingTop: 10,
        marginTop: 32,
        borderRadius: 16,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    textButton: {
        color: '#F1F1F1',
        fontSize: 22,
        fontFamily: 'LexendDeca-Bold',
    },
    iconButton: {
        color: '#F1F1F1',
        marginTop: 8,
    },
});

export default InitialPage;
