import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../App";

const Dashboard = () => {
    const history = useHistory();

    const { user } = useContext(AppContext);

    useEffect(() => {
        if (!user.avatar || !user.details)
            history.push("/");
    }, []);

    return <div>
        Dashboard
    </div>
}

export default Dashboard;