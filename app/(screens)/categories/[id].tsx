import { useEffect, useState, useCallback } from 'react';
import {
    Text,
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/styles/theme';
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
    startTime: string;
    endDate: string;
    endTime: string;
    createdAt: Date;
}

interface Category {
    id: string;
    title: string;
    tasksQuantity: string;
}

const Categories = () => {
    const [data, setData] = useState<Task[]>([]);
    const [categoryData, setCategoryData] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category>();
    const [taskData, setTaskData] = useState<Task[] | undefined>([]);

    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const [fontsLoaded, fontError] = LoadFonts();

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const removeCategory = (categoryId: string | undefined) => {
        Alert.alert(
            'Você deseja remover a categoria?',
            'Ao remover uma categoria, todas as tarefas da mesma categoria serão removidas juntas.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {},
                },
                {
                    text: 'Remover categoria',
                    onPress: async () => {
                        try {
                            const categories = await AsyncStorage.getItem(
                                'categories'
                            );

                            if (categories !== null) {
                                const categoriesArray: Category[] =
                                    JSON.parse(categories);

                                const updatedCategories =
                                    categoriesArray.filter(
                                        (category) => category.id !== categoryId
                                    );

                                await AsyncStorage.setItem(
                                    'categories',
                                    JSON.stringify(updatedCategories)
                                );
                            }

                            const tasks = await AsyncStorage.getItem('tasks');
                            if (tasks !== null) {
                                const tasksArray: Task[] = JSON.parse(tasks);

                                const updatedTasks = tasksArray.filter(
                                    (task) => task.taskGroup !== category?.title
                                );

                                await AsyncStorage.setItem(
                                    'tasks',
                                    JSON.stringify(updatedTasks)
                                );
                            }

                            router.push('/(tabs)/home');
                            Alert.alert('Categoria removida com sucesso!');
                        } catch (err) {
                            Alert.alert('Erro ao remover o item');
                        }
                    },
                },
            ]
        );
    };

    useEffect(() => {
        const getTasksData = async () => {
            try {
                const tasks = await AsyncStorage.getItem('tasks');
                if (tasks !== null) {
                    setData(JSON.parse(tasks));
                }
            } catch (err) {
                Alert.alert('Erro ao buscar as tarefas.');
            }
        };

        const getCategoriesData = async () => {
            try {
                const categories = await AsyncStorage.getItem('categories');
                if (categories !== null) {
                    setCategoryData(JSON.parse(categories));
                }
            } catch (err) {
                Alert.alert('Erro ao buscar as tarefas.');
            }
        };

        getTasksData();
        getCategoriesData();
    }, []);

    useEffect(() => {
        const findCategory = categoryData.find(
            (category) => category.id === id?.toString()
        );
        setCategory(findCategory);

        const filterTasksByCategory = () => {
            const filteredTasks = data.filter(
                (task) => task.taskGroup === findCategory?.title
            );

            setTaskData(filteredTasks);
        };
        filterTasksByCategory();
    }, [data, categoryData, id]);

    return (
        <ScrollView style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.header}>
                <Feather
                    name="arrow-left"
                    size={24}
                    onPress={() => router.back()}
                />
                <Feather
                    name="trash"
                    size={24}
                    onPress={() => removeCategory(id)}
                />
            </View>
            <View style={styles.body}>
                {taskData?.length ? (
                    <FlatList
                        data={taskData}
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
                        contentContainerStyle={{ display: 'flex', gap: 12 }}
                    />
                ) : (
                    <EmptyCard />
                )}
            </View>
        </ScrollView>
    );
};

export default Categories;

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
});
