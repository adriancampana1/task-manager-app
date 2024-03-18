import { useEffect, useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Platform,
    ScrollView,
    Alert,
    FlatList,
    Pressable,
} from 'react-native';
import { SplashScreen } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import LoadFonts from '@/assets/fonts/fonts';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskHomeCard from '@/components/home/inProgressSection/taskHomeCard';
import EmptyCard from '@/components/home/emptyCard';

const statusBarHeight = StatusBar.currentHeight;

interface ToDo {
    task: string;
    status: string;
    id: string;
}

interface Task {
    id: string;
    title: string;
    taskGroup: string;
    description: string;
    completed: boolean;
    toDo: ToDo[];
    startDate: string;
    endDate: string;
}

interface Category {
    id: string;
    title: string;
    tasksQuantity: string;
}

const AllTasks = () => {
    const [data, setData] = useState<Task[]>([]);
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

    useEffect(() => {
        const getData = async () => {
            try {
                const tasks = await AsyncStorage.getItem('tasks');
                if (tasks !== null) {
                    setData(JSON.parse(tasks));
                }
            } catch (err) {
                Alert.alert('Houve um erro ao carregar as tarefas.');
            }
        };
        getData();
    }, []);

    return (
        <ScrollView style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.header}>
                <Feather
                    name="arrow-left"
                    size={24}
                    onPress={() => router.back()}
                />
            </View>
            <View style={styles.body}>
                {data.length ? (
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() =>
                                    router.push(`/details/${item.id}`)
                                }
                            >
                                <TaskHomeCard
                                    id={item.id}
                                    title={item.title}
                                    taskGroup={item.taskGroup}
                                    description={item.description}
                                    startDate={item.startDate}
                                    endDate={item.endDate}
                                />
                            </Pressable>
                        )}
                        contentContainerStyle={{ display: 'flex', gap: 12 }}
                    />
                ) : (
                    <EmptyCard />
                )}
            </View>
        </ScrollView>
    );
};

export default AllTasks;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        marginBottom: 32,
    },
    header: {
        paddingTop: Platform.OS === 'android' ? statusBarHeight : 54,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerBtn: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        marginVertical: 48,
    },
    list: {
        display: 'flex',
        gap: 12,
    },
});
