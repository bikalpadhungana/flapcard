import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useAuthContext } from '../hooks/use.auth.context';
import { useNavigate } from 'react-router-dom';
import { GoogleOutlined } from '@ant-design/icons'

export default function OAuth() {

    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        const result = await signInWithPopup(auth, provider);

        const response = await fetch('https://backend.flaap.me/api/auth/google', {
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
        localStorage.setItem('user', JSON.stringify(resData.restUserInfo));
        localStorage.setItem('access_token', JSON.stringify(resData.token));
        localStorage.setItem('refresh_token', JSON.stringify(resData.refreshToken));

        navigate('/profile');
    }

    return (
        <button onClick={handleGoogleClick} type="button" className="bg-gray-700 text-white rounded-lg hover:opacity-95 py-2 md:py-3 px-3 flex justify-center items-center gap-2"><GoogleOutlined className="text-lg"/><span>Sign in with Google</span></button>
    )
}
