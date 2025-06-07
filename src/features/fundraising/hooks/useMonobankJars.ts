import { useEffect, useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import Jar from '../../monobank/models/Jar';
import { monobankRepository } from '../../monobank/repository/monobankRepository';

export const useMonobankJars = () => {
    const [jars, setJars] = useState<Jar[]>([]);
    const { showError } = useToast();

    const fetchJars = async () => {
        try {
            const response = await monobankRepository.getJars();
            if (response?.data) {
                setJars(response.data);
            } else {
                showError(response?.error?.message || 'Failed to fetch Monobank jars');
            }
        } catch (error) {
            showError('Unexpected error while fetching jars');
        }
    };

    useEffect(() => {
        fetchJars();
    }, []);

    return jars;
}; 