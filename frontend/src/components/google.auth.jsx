import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useAuthContext } from '../hooks/use.auth.context';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        const result = await signInWithPopup(auth, provider);

        const response = await fetch('https://backend-flap.esainnovation.com/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: result.user.displayName, email: result.user.email, userPhoto: result.user.photoURL })
        });

        const resData = await response.json();

        if (resData.success === false) {
            dispatch({ type: 'SIGN_IN_FAILURE', payload: resData.message });
            return;
        }

        dispatch({ type: 'SIGN_IN_SUCCESS', payload: resData.restUserInfo });
        sessionStorage.setItem('user', JSON.stringify(resData.restUserInfo));
        sessionStorage.setItem('access_token', JSON.stringify(resData.token));
        sessionStorage.setItem('refresh_token', JSON.stringify(resData.refreshToken));

        navigate('/profile');
    }

    return (
        <button onClick={handleGoogleClick} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Continue with google</button>
    )
}
