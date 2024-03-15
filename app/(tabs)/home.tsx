import { useCallback, useEffect } from 'react';
import {
    Pressable,
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Platform,
    ScrollView,
    LogBox,
} from 'react-native';
import LoadFonts from '../../assets/fonts/fonts';
import { SplashScreen, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
const statusBarHeight = StatusBar.currentHeight;

import GroupTasks from '../../components/home/groupTasksSection/groupTasks/index';
import InProgress from '../../components/home/inProgressSection/inProgress/index';

const Home = () => {
    const [fontsLoaded, fontError] = LoadFonts();

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);

    return (
        <ScrollView style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSubtitle}>Olá! Este é o seu</Text>
                    <Text style={styles.headerTitle}>Task Manager</Text>
                </View>
                <Feather
                    name="log-out"
                    size={24}
                    color="red"
                    onPress={() => router.push('/')}
                />
            </View>
            <GroupTasks />
            <InProgress />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
    header: {
        width: '100%',
        paddingTop: Platform.OS === 'android' ? statusBarHeight : 54,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#12688218',
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'LexendDeca-Bold',
    },
    headerSubtitle: {
        fontSize: 18,
        fontFamily: 'LexendDeca-Light',
    },
    headerIcon: {
        borderWidth: 1,
        borderRadius: 50,
        padding: 8,
    },
});

export default Home;
