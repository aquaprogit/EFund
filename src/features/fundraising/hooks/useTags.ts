import { useEffect, useState } from 'react';
import { Tag } from '../../tags/models/Tag';
import { tagsRepository } from '../../tags/repository/tagsRepository';

export const useTags = () => {
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const { data: tags } = await tagsRepository.getTags();
            if (tags) {
                setAllTags(tags);
            }
        } catch (error) {
            console.error('Failed to fetch tags:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return {
        allTags,
        loading,
        refreshTags: fetchTags
    };
}; 