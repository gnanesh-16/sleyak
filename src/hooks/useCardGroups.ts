"use client";

import { useState, useEffect } from 'react';
import { LinkItem } from '@/types/kanban';

export interface CardGroup {
    id: string;
    name: string;
    cardIds: string[];
    dateString: string; // Tab/date the group belongs to
    createdAt: string;
}

export function useCardGroups() {
    const [groups, setGroups] = useState<CardGroup[]>([]);

    // Load groups from local storage on component mount
    useEffect(() => {
        const savedGroups = localStorage.getItem('todlex-card-groups');
        if (savedGroups) {
            try {
                setGroups(JSON.parse(savedGroups));
            } catch (e) {
                console.error('Failed to parse saved groups:', e);
            }
        }
    }, []);

    // Save groups to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('todlex-card-groups', JSON.stringify(groups));
    }, [groups]);

    const createGroup = (name: string, cardIds: string[], dateString: string) => {
        const newGroup: CardGroup = {
            id: `group-${Date.now()}`,
            name,
            cardIds,
            dateString,
            createdAt: new Date().toISOString()
        };

        setGroups(prev => [...prev, newGroup]);
        return newGroup;
    };

    const deleteGroup = (groupId: string) => {
        setGroups(prev => prev.filter(group => group.id !== groupId));
    };

    const getGroupsForTab = (dateString: string) => {
        return groups.filter(group => group.dateString === dateString);
    };

    return {
        groups,
        createGroup,
        deleteGroup,
        getGroupsForTab
    };
}

export default useCardGroups;
