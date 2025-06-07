import { useParams } from "react-router-dom";
import { UserDetails } from "../components/UserDetails";

// get from url
export const UserDetailsPage = () => {
    const { userId } = useParams();

    if (!userId) {
        return <div>User ID is required</div>;
    }

    return (
        <UserDetails userId={userId} />
    );
};