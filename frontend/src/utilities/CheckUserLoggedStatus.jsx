import { useEffect } from "react";
import { useAuthContext } from "../hooks/use.auth.context";
import { useNavigate } from "react-router-dom";

export default function CheckUserLoggedStatus() {

    const { dispatch } = useAuthContext();
    const refreshToken = JSON.parse(localStorage.getItem('refresh_token'));
    const navigate = useNavigate();

    useEffect(() => {

        const fetchRefreshToken = async () => {
            const response = await fetch(`https://backend.flaap.me/api/token/${refreshToken}`);

            const resData = await response.json();

            // refresh token no longer available. User session ended
            if (resData.success === false) {
                if (resData.message === "Token unavailable") {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("user");

                    // update react auth state
                    dispatch({ type: 'SIGN_OUT_SUCCESS' });

                    navigate('/');
                }
                return;
            }

            if (resData.message === "Token available") {
                navigate('/profile');
            }
        }

        if (refreshToken === null) {
            return;
        }

        fetchRefreshToken();
        
    }, [refreshToken, dispatch, navigate]);
}
