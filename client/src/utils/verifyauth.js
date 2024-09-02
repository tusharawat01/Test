import axios from "axios"
import { reqUrl } from "./constants"
import { toast } from "react-toastify";

export const verifyPilotAuth = async ({ ...props }) => {
    try {
        // props.setPageLoader(true);
        const res = await axios.get(`${reqUrl}/pilot/detail`,{
            headers:{
                'Authorization':`Bearer ${props.token}`
            }
        })
        props.setCurrentUser(res.data.user);
        // props.setPageLoader(false);

        return res.data;
    }
    catch (err) {
        console.log(err)
        // props.setPageLoader(false);
        return 'error';

    }
}