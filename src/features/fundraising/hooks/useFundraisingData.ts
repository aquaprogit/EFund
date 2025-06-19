import { useEffect, useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import Report from '../../reports/models/Report';
import { FundraisingStatus } from '../models/FundraisingStatus';
import { fundraisingsRepository } from '../repository/fundraisingsRepository';

export const useFundraisingData = (fundraisingId: string) => {
    const [data, setData] = useState({
        imageUrl: '',
        title: '',
        description: '',
        monobankJar: '',
        monobankJarId: '',
        defaultTags: [] as string[],
        reports: [] as Report[],
        createdByUserId: '',
        status: FundraisingStatus.Open
    });
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    const fetchFundraisingData = async () => {
        try {
            setLoading(true);
            const response = await fundraisingsRepository.getFundraising(fundraisingId);

            if (!response?.data) {
                showError(response?.error?.message || 'Failed to fetch fundraising data');
                return;
            }

            const { avatarUrl, title, description, monobankJarId, monobankJar, tags, reports, userId, status } = response.data;

            setData({
                imageUrl: avatarUrl,
                title,
                description,
                monobankJar: monobankJar.title,
                monobankJarId,
                defaultTags: tags,
                reports,
                createdByUserId: userId,
                status
            });
        } catch (error) {
            showError('Unexpected error while fetching fundraising');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFundraisingData();
    }, [fundraisingId]);

    return { data, loading, refetch: fetchFundraisingData };
}; 