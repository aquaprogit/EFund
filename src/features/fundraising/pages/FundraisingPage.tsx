import { Navigate, useParams } from 'react-router-dom';
import { FundraisingDetails } from '../components/details/FundraisingDetails';

const FundraisingPage = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) {
        return <Navigate to="/404" />;
    }
    return <FundraisingDetails fundraisingId={id} />;
};

export default FundraisingPage; 