import { useCallback, useEffect, useState } from 'react';
import { useTaskContext } from '../tasksContext';
import {
    Pressable,
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    Platform,
    StatusBar,
    TextInput,
    Keyboard,
    ScrollView,
    Alert,
} from 'react-native';
import { SplashScreen } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import RNDateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar';
import LoadFonts from '@/assets/fonts/fonts';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import CheckboxList from '@/components/checkboxList';
import { calendarManager } from '@/components/calendarManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const statusBarHeight = StatusBar.currentHeight;

interface Category {
    title: string;
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
    createdAt: Date;
}

interface Alarm {
    relativeOffset: number;
}

interface CalendarEvent {
    title: string;
    status: string;
    timeZone: string;
    startDate: Date;
    endDate: Date;
    notes: string;
    location: string;
    alarms?: Alarm[];
}

const AddTask = () => {
    const { addTask } = useTaskContext();
    const { handleCalendarPermissionStatus } = calendarManager();

    const [initialTaskData, setInitialTaskData] = useState<Task[]>([]);
    const [initialCategoryData, setInitialCategoryData] = useState<Category[]>(
        []
    );

    const [categoryTitle, setCategoryTitle] = useState('');

    const [itemList, setItemList] = useState<Task[] | Category>([]);

    const [type, setType] = useState(null);
    const [toDoItem, setToDoItem] = useState('');
    const [toDoList, setToDoList] = useState<ToDo[]>([]);

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    const [taskGroup, setTaskGroup] = useState('');

    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const [taskInitialDate, setTaskInitialDate] = useState('');

    const [endDate, setEndDate] = useState<Date>(new Date());
    const [taskEndDate, setTaskEndDate] = useState('');

    const [initialTime, setInitialTime] = useState<Date>(new Date());
    const [taskInitialTime, setTaskInitialTime] = useState('');

    const [endTime, setEndTime] = useState<Date>(new Date());
    const [taskEndTime, setTaskEndTime] = useState('');

    const [showInitialDatePicker, setShowInitialDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [showInitialTimePicker, setShowInitialTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const toggleInitialDatePicker = () => {
        setShowInitialDatePicker(!showInitialDatePicker);
    };

    const toggleEndDatePicker = () => {
        setShowEndDatePicker(!showEndDatePicker);
    };

    const toggleInitialTimePicker = () => {
        setShowInitialTimePicker(!showInitialTimePicker);
    };

    const toggleEndTimePicker = () => {
        setShowEndTimePicker(!showEndTimePicker);
    };

    const onChangeInitialDate = (event: DateTimePickerEvent, date?: Date) => {
        const {
            type,
            nativeEvent: { timestamp, utcOffset },
        } = event;
        if (type === 'set') {
            if (date) {
                const currentDate = date;
                setInitialDate(currentDate);

                toggleInitialDatePicker();
                const formattedDate = currentDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                setTaskInitialDate(formattedDate);
            }
        } else {
            toggleInitialDatePicker();
        }
    };

    const onChangeEndDate = (event: DateTimePickerEvent, date?: Date) => {
        const {
            type,
            nativeEvent: { timestamp, utcOffset },
        } = event;
        if (type === 'set') {
            if (date) {
                const currentDate = date;
                setEndDate(currentDate);

                toggleEndDatePicker();
                const formattedDate = currentDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                setTaskEndDate(formattedDate);
            }
        } else {
            toggleEndDatePicker();
        }
    };

    const onChangeInitialTime = (event: DateTimePickerEvent, date?: Date) => {
        const {
            type,
            nativeEvent: { timestamp, utcOffset },
        } = event;

        if (type === 'set') {
            if (date) {
                setInitialTime(date);
                toggleInitialTimePicker();
                const formattedTime = date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                });
                setTaskInitialTime(formattedTime);
            }
        } else {
            toggleInitialTimePicker();
        }
    };

    const onChangeEndTime = (event: DateTimePickerEvent, date?: Date) => {
        const {
            type,
            nativeEvent: { timestamp, utcOffset },
        } = event;

        if (type === 'set') {
            if (date) {
                setEndTime(date);
                toggleEndTimePicker();
                const formattedTime = date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                });
                setTaskEndTime(formattedTime);
            }
        } else {
            toggleEndTimePicker();
        }
    };

    // task functions
    const handleAddItem = async () => {
        const newItem =
            type === 'task' ? createNewTaskItem() : createNewCategoryItem();

        if (type === 'task') {
            if (!taskTitle || !taskGroup || !taskInitialDate || !taskEndDate) {
                showEmptyFieldsAlert();
            } else {
                setTaskListAndUpdatePage(newItem);

                const eventDetails = createEventDetails(newItem as Task);
                const { status } =
                    await Calendar.requestCalendarPermissionsAsync();
                handleCalendarPermissionStatus(status, eventDetails);
                addTask(newItem as Task);
            }
        } else {
            if (!categoryTitle) {
                showEmptyFieldsAlert();
            } else {
                setCategoryListAndUpdatePage(newItem);
                Alert.alert(
                    'Categoria adicionada com sucesso! ✅',
                    'Agora você pode adicionar tarefas nessa categoria.'
                );
            }
        }
    };

    const showEmptyFieldsAlert = () => {
        Alert.alert(
            'Parece que você deixou alguns campos vazios.',
            'Preencha todos os campos obrigatórios.'
        );
    };

    const createNewTaskItem = () => {
        return {
            title: taskTitle,
            completed: false,
            description: taskDescription,
            taskGroup: taskGroup,
            id: uuidv4(),
            toDo: toDoList || [],
            startDate: initialDate,
            endDate: endDate,
            createdAt: new Date(),
        };
    };

    const createNewCategoryItem = () => {
        return {
            title: categoryTitle,
            id: uuidv4(),
        };
    };

    const resetPage = () => {
        setType(null);
        setTaskTitle('');
        setTaskGroup('');
        setTaskDescription('');
        setToDoList([]);
        setTaskInitialDate('');
        setTaskInitialTime('');
        setTaskEndDate('');
        setTaskEndTime('');
    };

    const setTaskListAndUpdatePage = async (newItem: Task | Category) => {
        try {
            const existingData = await getTaskData();

            const updatedList = existingData
                ? [...existingData, newItem]
                : [newItem];

            setItemList(updatedList);
            storeTaskData(updatedList);
            resetPage();
        } catch (error) {
            Alert.alert(`Houve um erro ao salvar a sua tarefa.`, `${error}`);
        }
    };

    const setCategoryListAndUpdatePage = async (newItem: Category) => {
        try {
            const existingData = await getCategoryData();

            const updatedList = existingData
                ? [...existingData, newItem]
                : [newItem];

            setItemList(updatedList);
            storeCategoryData(updatedList);
            setInitialCategoryData(updatedList);
            resetPage();
        } catch (error) {
            Alert.alert(`Houve um erro ao salvar a sua tarefa.`, `${error}`);
        }
    };

    const createEventDetails = (newTaskItem: Task): CalendarEvent => {
        const { startDate, endDate } = newTaskItem;

        const updateDate = (date: Date, time?: Date) => {
            if (time) {
                date.setHours(time.getHours());
                date.setMinutes(time.getMinutes());
            }
        };

        const updatedStartDate = new Date(startDate);
        updateDate(updatedStartDate, initialTime);

        const updatedEndDate = new Date(endDate);
        updateDate(updatedEndDate, endTime);

        return {
            title: `${newTaskItem.title} | ${newTaskItem.taskGroup}`,
            status: Calendar.EventStatus.CONFIRMED,
            timeZone: 'America/Sao_Paulo',
            startDate: updatedStartDate,
            endDate: updatedEndDate,
            notes: newTaskItem.description,
            location: '',
            alarms: [{ relativeOffset: -1 }, { relativeOffset: -60 }],
        };
    };

    const handleAddToDoItem = () => {
        if (toDoItem.trim() === '') {
            return;
        }

        const newToDoItem: ToDo = {
            task: toDoItem,
            status: 'not started',
            id: Math.floor(Math.random() * 100).toString(),
        };

        setToDoList((prevToDoList) => [...prevToDoList, newToDoItem]);
        setToDoItem('');
        Keyboard.dismiss();
    };

    // async storage functions
    const storeTaskData = async (itemList: Task[]) => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(itemList));
        } catch (err) {
            Alert.alert('Erro ao salvar os dados localmente.');
        }
    };

    const storeCategoryData = async (itemList: Category[]) => {
        try {
            await AsyncStorage.setItem('categories', JSON.stringify(itemList));
        } catch (err) {
            Alert.alert('Erro ao salvar os dados localmente.');
        }
    };

    const getTaskData = async () => {
        try {
            const tasks = await AsyncStorage.getItem('tasks');
            if (tasks !== null) {
                setInitialTaskData(JSON.parse(tasks));
                return JSON.parse(tasks);
            }
        } catch (e) {
            Alert.alert('Erro ao buscar dados do localstorage');
        }
    };

    const getCategoryData = async () => {
        try {
            const categories = await AsyncStorage.getItem('categories');
            if (categories !== null) {
                setInitialCategoryData(JSON.parse(categories));
                return JSON.parse(categories);
            }
        } catch (e) {
            console.error(`Erro ao buscar dados do localstorage: ${e}`);
        }
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
        getCategoryData();
    }, []);

    return (
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.header}>
                <Pressable style={styles.addTaskBtn} onPress={resetPage}>
                    <Feather name="trash" size={24} />
                    <Text style={{ fontFamily: 'LexendDeca-Regular' }}>
                        Cancelar
                    </Text>
                </Pressable>
                <Pressable style={styles.addTaskBtn} onPress={handleAddItem}>
                    <Text style={{ fontFamily: 'LexendDeca-Regular' }}>
                        Adicionar
                    </Text>
                    <Feather name="check-square" size={24} />
                </Pressable>
            </View>
            <View style={styles.body}>
                {type === null && (
                    <View>
                        <Text style={styles.labelText}>
                            O que você quer adicionar?
                        </Text>
                        <RNPickerSelect
                            onValueChange={(value) => setType(value)}
                            items={[
                                {
                                    label: 'Tarefa',
                                    value: 'task',
                                },
                                {
                                    label: 'Categoria',
                                    value: 'category',
                                },
                            ]}
                        />
                    </View>
                )}
                {type === null ? (
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 16,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'LexendDeca-Light',
                                textAlign: 'center',
                            }}
                        >
                            Selecione alguma das opções acima para continuar...
                        </Text>
                    </View>
                ) : type === 'task' ? (
                    <ScrollView
                        contentContainerStyle={styles.taskContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View>
                            <Text style={styles.labelText}>
                                * Insira o título da nova tarefa
                            </Text>
                            <TextInput
                                placeholder="Título"
                                textContentType="jobTitle"
                                style={styles.input}
                                value={taskTitle}
                                onChangeText={(text) => setTaskTitle(text)}
                            />
                        </View>
                        <View>
                            <Text style={styles.labelText}>
                                * Categoria da tarefa
                            </Text>
                            <RNPickerSelect
                                onValueChange={(value) => setTaskGroup(value)}
                                items={initialCategoryData.map((category) => ({
                                    label: category.title,
                                    value: category.title,
                                }))}
                                style={pickerStyle}
                            />
                        </View>
                        <View>
                            <Text style={styles.labelText}>
                                Descrição: (opcional)
                            </Text>
                            <TextInput
                                placeholder="Descrição"
                                style={styles.input}
                                value={taskDescription}
                                onChangeText={(text) =>
                                    setTaskDescription(text)
                                }
                            />
                        </View>
                        <View>
                            <Text style={styles.labelText}>
                                Adicione um checklist (opcional)
                            </Text>
                            <View>
                                <View style={styles.toDo}>
                                    <TextInput
                                        placeholder="Titulo da tarefa"
                                        style={[styles.input, { width: '90%' }]}
                                        value={toDoItem}
                                        onChangeText={(text) =>
                                            setToDoItem(text)
                                        }
                                    />
                                    <Pressable onPress={handleAddToDoItem}>
                                        <Feather name="plus-circle" size={24} />
                                    </Pressable>
                                </View>
                                <View style={{ marginTop: 16 }}>
                                    {toDoList.map((toDo) => (
                                        <CheckboxList
                                            key={toDo.id}
                                            taskData={toDo}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.labelText}>
                                * Informe a data de início da sua tarefa
                            </Text>

                            {showInitialDatePicker && (
                                <RNDateTimePicker
                                    mode="date"
                                    display="spinner"
                                    value={initialDate}
                                    onChange={onChangeInitialDate}
                                    themeVariant="light"
                                />
                            )}
                            {!showInitialDatePicker && (
                                <Pressable onPress={toggleInitialDatePicker}>
                                    <TextInput
                                        placeholder="Selecione uma data"
                                        style={[
                                            styles.input,
                                            { color: '#00131F' },
                                        ]}
                                        value={taskInitialDate}
                                        onChangeText={setTaskInitialDate}
                                        editable={false}
                                    />
                                </Pressable>
                            )}
                        </View>
                        <View>
                            <Text style={styles.labelText}>
                                Informe o horário de início da tarefa (opcional)
                            </Text>

                            {showInitialTimePicker && (
                                <RNDateTimePicker
                                    mode="time"
                                    display="spinner"
                                    value={initialTime}
                                    onChange={onChangeInitialTime}
                                    themeVariant="light"
                                />
                            )}
                            {!showInitialTimePicker && (
                                <Pressable onPress={toggleInitialTimePicker}>
                                    <TextInput
                                        placeholder="Selecione um horário"
                                        style={[
                                            styles.input,
                                            { color: '#00131F' },
                                        ]}
                                        value={taskInitialTime}
                                        onChangeText={setTaskInitialTime}
                                        editable={false}
                                    />
                                </Pressable>
                            )}
                        </View>
                        <View>
                            <Text style={styles.labelText}>
                                * Informe a data de finalização da sua tarefa
                            </Text>

                            {showEndDatePicker && (
                                <RNDateTimePicker
                                    mode="date"
                                    display="spinner"
                                    value={endDate}
                                    onChange={onChangeEndDate}
                                    themeVariant="light"
                                />
                            )}
                            {!showEndDatePicker && (
                                <Pressable onPress={toggleEndDatePicker}>
                                    <TextInput
                                        placeholder="Selecione uma data"
                                        style={[
                                            styles.input,
                                            { color: '#00131F' },
                                        ]}
                                        value={taskEndDate}
                                        onChangeText={setTaskEndDate}
                                        editable={false}
                                    />
                                </Pressable>
                            )}
                        </View>
                        <View>
                            <Text style={styles.labelText}>
                                Informe o horário final da sua tarefa (opcional)
                            </Text>

                            {showEndTimePicker && (
                                <RNDateTimePicker
                                    mode="time"
                                    display="spinner"
                                    value={endTime}
                                    onChange={onChangeEndTime}
                                    themeVariant="light"
                                />
                            )}
                            {!showEndTimePicker && (
                                <Pressable onPress={toggleEndTimePicker}>
                                    <TextInput
                                        placeholder="Selecione um horário"
                                        style={[
                                            styles.input,
                                            { color: '#00131F' },
                                        ]}
                                        value={taskEndTime}
                                        onChangeText={setTaskEndTime}
                                        editable={false}
                                    />
                                </Pressable>
                            )}
                        </View>
                    </ScrollView>
                ) : (
                    <View>
                        <Text style={styles.labelText}>
                            Insira o título da categoria
                        </Text>
                        <TextInput
                            placeholder="Título"
                            style={styles.input}
                            onChangeText={(text) => setCategoryTitle(text)}
                        />
                        <Text
                            style={{
                                fontFamily: 'LexendDeca-Light',
                                textAlign: 'center',
                                marginTop: 24,
                            }}
                        >
                            Pressione o botão "Adicionar" após preencher os
                            campos
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

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
    addTaskBtn: {
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        fontFamily: 'LexendDeca-Regular',
    },
    body: {
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        height: '100%',
        width: '100%',
        paddingBottom: 16,
    },
    labelText: {
        fontFamily: 'LexendDeca-Regular',
        fontSize: 16,
        marginBottom: 6,
        marginLeft: 2,
    },
    input: {
        borderWidth: 0.3,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    dropdown: {
        borderWidth: 1,
    },
    taskContent: {
        marginTop: 32,
        display: 'flex',
        paddingBottom: 40,
        gap: 32,
    },
    toDo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
});

const pickerStyle = {
    inputIOS: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
};

export default AddTask;
