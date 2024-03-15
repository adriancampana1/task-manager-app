import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Calendar from 'expo-calendar';

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

export const calendarManager = () => {
    async function getDefaultCalendarSource() {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    }

    const createCalendar = async (): Promise<string | undefined> => {
        try {
            const newCalendarID = await Calendar.createCalendarAsync({
                title: 'Task Manager',
                color: 'orange',
                entityType: Calendar.EntityTypes.EVENT,
                name: 'internalCalendarName',
                ownerAccount: 'personal',
                accessLevel: Calendar.CalendarAccessLevel.OWNER,
            });
            return newCalendarID;
        } catch (error) {
            console.error('Erro ao criar o calendário: ', error);
            throw error;
        }
    };

    async function getTaskManagerCalendar() {
        const calendars = await Calendar.getCalendarsAsync(
            Calendar.EntityTypes.EVENT
        );
        const expoCalendar = calendars.find(
            (calendar) => calendar.title === 'Expo Calendar'
        );
        return expoCalendar;
    }

    const createNewEvent = async (
        calendar: string | null,
        eventDetails: CalendarEvent
    ): Promise<string | undefined> => {
        try {
            if (calendar) {
                const newEventID = await Calendar.createEventAsync(
                    calendar,
                    eventDetails
                );
                return newEventID;
            }
        } catch (error) {
            console.error('Erro ao criar o novo evento: ', error);
            throw error;
        }
        return undefined;
    };

    async function handleCalendarPermissionStatus(
        status: Calendar.PermissionStatus,
        eventDetails: CalendarEvent
    ): Promise<void> {
        if (status === 'granted') {
            const taskManagerCalendar = await getTaskManagerCalendar();

            if (taskManagerCalendar) {
                await handleEventCreation(taskManagerCalendar.id, eventDetails);
            } else {
                const newTaskManagerCalendar = await createCalendar();

                if (newTaskManagerCalendar) {
                    await handleEventCreation(
                        newTaskManagerCalendar,
                        eventDetails
                    );
                }
            }
        } else {
            showPermissionDeniedAlert();
            return undefined;
        }
    }

    const handleEventCreation = async (
        calendarId: string,
        eventDetails: CalendarEvent
    ): Promise<string | undefined> => {
        const newEvent = await createNewEvent(calendarId, eventDetails);
        if (newEvent) {
            showSuccessAlert();
            return newEvent;
        } else {
            return undefined;
        }
    };

    const showSuccessAlert = (): void => {
        Alert.alert(
            'Tarefa adicionada com sucesso! ✅',
            'Essa atividade também foi adicionada à sua agenda local.'
        );
    };

    const showPermissionDeniedAlert = (): void => {
        Alert.alert(
            'Sem acesso à sua agenda local :(',
            'Não podemos criar o evento na sua agenda local sem a sua permissão.'
        );
    };

    return {
        getDefaultCalendarSource,
        createCalendar,
        getTaskManagerCalendar,
        createNewEvent,
        handleCalendarPermissionStatus,
    };
};
