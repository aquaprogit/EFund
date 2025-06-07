import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PageWrapper from "../../../shared/components/PageWrapper";
import EditFundraising from "../components/EditFundraising";

const EditFundraisingPage = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) {
        return <Navigate to="/404" />;
    }

    return (
        <EditFundraising fundraisingId={id} />
    )
}

export default EditFundraisingPage;
