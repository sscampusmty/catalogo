"use client";
import { useEffect, useState } from 'react';

import styles from './Tabs.module.css';

// TYPES
import { Tab, TabsProps } from '@/types/Tabs';

export default function Tabs({ options, selected, completedTabs = [], lockSteps = false, availableTabs = [], onSelect, className }: TabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>(selected);

    const handleTabClick = (option: Tab, isLocked: boolean) => {
        if (lockSteps && isLocked) {
            return;
        }

        setActiveTab(option);
        onSelect(option);
    };

    useEffect(() => {
        setActiveTab(selected);
    }, [selected]);

    return (
        <div className={`${styles.tabs} ${className || ''}`}>
            <h3 className={styles.title}>Secciones: </h3>
            
            {options.map(option => {
                if (option.hidden) return null;

                const isActive = activeTab?.nombre === option.nombre;
                const isCompleted = completedTabs.includes(option.nombre);
                const isAvailable = availableTabs.includes(option.nombre) || isCompleted;
                const isLocked = lockSteps && !isActive && !isAvailable;

                const classNames = [
                    styles.tab,
                    isActive ? styles.selected : '',
                    lockSteps && isCompleted && !isActive ? styles.completed : '',
                    isLocked ? styles.locked : ''
                ].filter(Boolean).join(' ');

                return (
                    <button
                        key={option.nombre}
                        className={classNames}
                        onClick={() => handleTabClick(option, isLocked)}
                        type="button"
                        disabled={lockSteps && isLocked}
                        aria-disabled={lockSteps && isLocked}
                    >
                        {option.nombre}
                    </button>
                );
            })}
        </div>
    );
}
