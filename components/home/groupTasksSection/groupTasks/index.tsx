import { useCallback, useEffect, useState } from 'react';
import {
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    Pressable,
    Alert,
} from 'react-native';

import LoadFonts from '../../../../assets/fonts/fonts';
import { SplashScreen } from 'expo-router';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTaskContext } from '@/app/tasksContext';

import GroupTaskCard from '../groupTasksCard';
import EmptyCard from '../../emptyCard';

interface GroupItem {
    id: string;
    title: string;
    tasksQuantity: string;
}

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

const GroupTasks = () => {
    const [categoryData, setCategoryData] = useState<GroupItem[]>([]);
    const [taskData, setTaskData] = useState<Task[]>([]);
    const { addTask } = useTaskContext();

    const router = useRouter();

    const allTitlesAreEmpty = categoryData.every(
        (item: GroupItem) => item.title === ''
    );

    const getQuantityOfTasks = (item: GroupItem): number => {
        const filteredTasks = taskData.filter(
            (task) => task.taskGroup === item?.title
        );
        return filteredTasks.length;
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

    useEffect(() => {
        const getData = async () => {
            try {
                const categories = await AsyncStorage.getItem('categories');
                if (categories !== null) {
                    setCategoryData(JSON.parse(categories));
                }

                const tasks = await AsyncStorage.getItem('tasks');
                if (tasks !== null) {
                    setTaskData(JSON.parse(tasks));
                }
            } catch (e) {
                console.error(`Erro ao buscar dados do localstorage: ${e}`);
            }
        };
        getData();
    }, [addTask]);

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <Text style={styles.headerTitle}>Categorias</Text>
            {allTitlesAreEmpty ? (
                <EmptyCard />
            ) : (
                <FlatList
                    data={categoryData as GroupItem[]}
                    style={styles.list}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() =>
                                router.push(`/categories/${item.id}`)
                            }
                        >
                            <GroupTaskCard
                                title={item.title}
                                tasksQuantity={getQuantityOfTasks(
                                    item
                                ).toString()}
                                id={item.id}
                            />
                        </Pressable>
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ display: 'flex', gap: 8 }}
                    nestedScrollEnabled={true}
                    horizontal
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
    },
    list: {
        display: 'flex',
        gap: 12,
    },
    header: {
        padding: 6,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'LexendDeca-Bold',
        marginBottom: 5,
        fontSize: 20,
    },
    headerQuantity: {
        fontFamily: 'LexendDeca-Regular',
    },
    headerLink: {
        fontFamily: 'LexendDeca-Light',
    },
});

export default GroupTasks;
