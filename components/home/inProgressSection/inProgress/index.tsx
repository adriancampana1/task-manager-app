import { useCallback, useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    SafeAreaView,
    Pressable,
    useWindowDimensions,
} from 'react-native';
import { useTaskContext } from '@/app/tasksContext';

import LoadFonts from '../../../../assets/fonts/fonts';
import { SplashScreen, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TaskHomeCard from '../taskHomeCard';
import EmptyCard from '../../emptyCard';

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
    startTime: string;
    endDate: string;
    endTime: string;
    createdAt: Date;
}

const InProgress = () => {
    const [data, setData] = useState<Task[]>([]);
    const { tasks, addTask } = useTaskContext();

    const { height: windowHeight } = useWindowDimensions();
    const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

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
        if (windowHeight) {
            setMaxHeight(windowHeight * 0.45);
        }
        const getData = async () => {
            try {
                const tasks = await AsyncStorage.getItem('tasks');
                if (tasks !== null) {
                    const parsedTasks = JSON.parse(tasks);

                    // sorting data based on creation date
                    parsedTasks.sort(
                        (a: Task, b: Task) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    );
                    setData(parsedTasks);
                }
            } catch (e) {
                console.error('Não foi possível realizar a busca dos dados');
            }
        };
        getData();
    }, [windowHeight, addTask]);

    const allTitlesAreEmpty = data.every((item) => item.title === '');

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Tarefas à fazer -
                    <Text style={styles.headerQuantity}> {data.length} </Text>{' '}
                </Text>
                <Text
                    style={styles.headerLink}
                    onPress={() => router.push('/(screens)/allTasks')}
                >
                    Ver todas
                </Text>
            </View>
            <View style={{ maxHeight: maxHeight }}>
                {allTitlesAreEmpty ? (
                    <EmptyCard />
                ) : (
                    <FlatList
                        data={data}
                        style={styles.list}
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
                                    startTime={item.startTime}
                                    endDate={item.endDate}
                                    endTime={item.endTime}
                                />
                            </Pressable>
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ display: 'flex', gap: 12 }}
                        nestedScrollEnabled={true}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        marginBottom: 48,
    },
    list: {
        display: 'flex',
        gap: 12,
    },
    header: {
        padding: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'LexendDeca-Bold',
        fontSize: 20,
    },
    headerQuantity: {
        fontFamily: 'LexendDeca-Regular',
    },
    headerLink: {
        fontFamily: 'LexendDeca-Light',
    },
});

export default InProgress;
