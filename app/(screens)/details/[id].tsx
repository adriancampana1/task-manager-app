import { useEffect, useState, useCallback } from 'react';
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    Platform,
    ScrollView,
    Alert,
    TextInput,
} from 'react-native';
import { SplashScreen } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import LoadFonts from '@/assets/fonts/fonts';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/styles/theme';
import CheckboxList from '@/components/checkboxList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const statusBarHeight = StatusBar.currentHeight;

interface ToDo {
    task: string;
    status: boolean;
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
    createdAt: Date;
}

const DetailsPage = () => {
    const [data, setData] = useState<Task[]>([]);
    const [taskData, setTaskData] = useState<Task | undefined>(undefined);

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

    const formatDate = (date: string) => {
        const newDate = new Date(date);
        const formattedDate = newDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        return formattedDate;
    };

    const handleToDoStatusChange = async (taskId: string, status: boolean) => {
        const toDoData = taskData?.toDo;
        const updatedToDo = toDoData?.map((todo) => {
            if (todo.id === taskId) {
                return { ...todo, status };
            }
            return todo;
        });

        const updatedTaskData: Task = {
            id: taskData?.id || '',
            title: taskData?.title || '',
            taskGroup: taskData?.taskGroup || '',
            description: taskData?.description || '',
            completed: taskData?.completed || false,
            toDo: updatedToDo || [],
            startDate: taskData?.startDate || '',
            endDate: taskData?.endDate || '',
            createdAt: taskData?.createdAt || new Date(),
        };
        setTaskData(updatedTaskData);

        const updatedData = data.map((task) => {
            if (task.id === taskData?.id) {
                return updatedTaskData;
            }
            return task;
        });
        setData(updatedData);
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedData));
        } catch (err) {
            console.error('Houve um erro ao atualizar o item da tarefa. ', err);
        }
    };

    const removeTask = async (taskId: string | undefined) => {
        try {
            const tasks = await AsyncStorage.getItem('tasks');

            if (tasks !== null) {
                const tasksArray: Task[] = JSON.parse(tasks);

                const updatedTasks = tasksArray.filter(
                    (task) => task.id !== taskId
                );
                await AsyncStorage.setItem(
                    'tasks',
                    JSON.stringify(updatedTasks)
                );

                Alert.alert('Tarefa removida com sucesso!');
                router.push('/(tabs)/home');
            }
        } catch (err) {
            Alert.alert('Erro ao remover o item');
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const tasks = await AsyncStorage.getItem('tasks');
                if (tasks !== null) {
                    setData(JSON.parse(tasks));
                }
            } catch (err) {
                Alert.alert('Erro ao buscar as tarefas.');
            }
        };
        getData();
    }, []);

    useEffect(() => {
        const findTask = () => {
            const currentTask = data.find((task) => task.id === id);
            setTaskData(currentTask);
        };
        findTask();
    }, [data, id]);

    return (
        <ScrollView style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.header}>
                <Feather
                    name="arrow-left"
                    size={24}
                    onPress={() => router.back()}
                />
                <View style={styles.headerBtn}>
                    <Feather
                        name="trash"
                        size={24}
                        onPress={() => removeTask(id)}
                    />
                </View>
            </View>
            <View style={styles.mainContent}>
                <Feather name="briefcase" size={48} />
                <Text style={styles.mainContentTitle}>{taskData?.title}</Text>
                <Text style={styles.mainContentDescription}>
                    Categoria: {taskData?.taskGroup}
                </Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.body}>
                <View>
                    <Text style={styles.bodyTitle}>Descrição:</Text>
                    <Text style={styles.bodyText}>
                        {taskData?.description
                            ? taskData?.description
                            : 'Nenhuma descrição adicionada.'}
                    </Text>
                </View>
                <View style={styles.checkboxSession}>
                    <Text style={styles.bodyTitle}>Tarefas</Text>
                    {taskData?.toDo.length ? (
                        taskData?.toDo.map((task) => (
                            <CheckboxList
                                key={task.id}
                                taskData={task}
                                onStatusChange={handleToDoStatusChange}
                            />
                        ))
                    ) : (
                        <Text>Nenhuma tarefa adicionada</Text>
                    )}
                </View>
                <View>
                    <Text style={styles.bodyTitle}>
                        Data de início da atividade
                    </Text>
                    <TextInput
                        placeholder="Selecione uma data"
                        style={[styles.input, { color: '#00131F' }]}
                        value={taskData ? formatDate(taskData?.startDate) : ''}
                        editable={false}
                    />
                </View>
                <View>
                    <Text style={styles.bodyTitle}>
                        Data de finalização da atividade
                    </Text>
                    <TextInput
                        placeholder="Selecione uma data"
                        style={[styles.input, { color: '#00131F' }]}
                        value={taskData ? formatDate(taskData?.endDate) : ''}
                        editable={false}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default DetailsPage;

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
    mainContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 54,
    },
    mainContentTitle: {
        marginTop: 10,
        marginBottom: 5,
        fontFamily: 'LexendDeca-Medium',
        fontSize: 24,
        textAlign: 'center',
    },
    mainContentDescription: {
        fontFamily: 'LexendDeca-Light',
        fontSize: 16,
    },
    divider: {
        marginTop: 32,
        marginBottom: 32,
        borderBottomColor: COLORS.BLACK,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        opacity: 0.1,
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        marginBottom: 32,
    },
    bodyTitle: {
        fontFamily: 'LexendDeca-Regular',
        fontSize: 16,
        marginBottom: 6,
    },
    bodyText: {
        fontFamily: 'LexendDeca-Light',
        fontSize: 16,
    },
    checkboxSession: {
        marginRight: 30,
    },
    input: {
        borderWidth: 0.3,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
});
