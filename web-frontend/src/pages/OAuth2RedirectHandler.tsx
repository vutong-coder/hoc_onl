import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserAfterOAuth } from '../store/slices/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const OAuth2RedirectHandler = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        console.log('OAuth2RedirectHandler: Component mounted.');
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        console.log('OAuth2RedirectHandler: Token from URL:', token);

        if (token) {
            localStorage.setItem('accessToken', token);
            console.log('OAuth2RedirectHandler: Token saved to localStorage. Dispatching fetchUserAfterOAuth...');
            dispatch(fetchUserAfterOAuth(token))
                .then(unwrapResult)
                .then((user) => {
                    console.log('OAuth2RedirectHandler: fetchUserAfterOAuth successful. User:', user);
                    console.log('OAuth2RedirectHandler: Navigating to /user/home');
                    navigate('/user/home');
                })
                .catch((err) => {
                    console.error('OAuth2RedirectHandler: fetchUserAfterOAuth failed. Error:', err);
                    console.log('OAuth2RedirectHandler: Navigating to /login?error=Authentication-failed');
                    navigate('/login?error=Authentication-failed');
                });
        } else {
            console.log('OAuth2RedirectHandler: No token found in URL. Navigating to /login.');
            navigate('/login?error=No-token-provided');
        }
    }, [dispatch, location, navigate]);

    if (loading) {
        return <div><p>Đang xử lý xác thực, vui lòng chờ...</p></div>;
    }

    if (error) {
        return <div><p>Lỗi xác thực: {error}</p></div>;
    }

    return <div><p>Đang chuyển hướng...</p></div>;
};

export default OAuth2RedirectHandler;
