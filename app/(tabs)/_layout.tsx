import React, { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import { TaskProvider } from '../tasksContext';

import { COLORS } from '../../styles/theme';
import { Keyboard } from 'react-native';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof Feather>['name'];
    color: string;
}) {
    return <Feather size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const [isKeyboardActive, setKeyboardActive] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardActive(true);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardActive(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <TaskProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: COLORS.ORANGE_200,
                    headerShown: false,
                    tabBarStyle: [
                        {
                            height: 80,
                            backgroundColor: '#f9f9f9',
                        },
                        {
                            display: isKeyboardActive ? 'none' : 'flex',
                        },
                    ],
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Início',
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon name="home" color={color} />
                        ),
                        tabBarIconStyle: { marginTop: 15 },
                        tabBarLabelStyle: {
                            fontSize: 12,
                            marginBottom: 15,
                        },
                    }}
                />
                <Tabs.Screen
                    name="add"
                    options={{
                        title: 'Adicionar',
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon name="plus" color={color} />
                        ),
                        tabBarIconStyle: { marginTop: 15 },
                        tabBarLabelStyle: {
                            fontSize: 12,
                            marginBottom: 15,
                        },
                    }}
                />
            </Tabs>
        </TaskProvider>
    );
}
