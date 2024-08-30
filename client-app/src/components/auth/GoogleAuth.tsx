
import { User } from '@/app/models/user';
import { useCommonStore } from '@/app/stores/commonStore';
import { useUserStore } from '@/app/stores/userStore';
import { hasGrantedAllScopesGoogle, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '../ui/button';

interface GoogleAuthProps {
  
}

const handleLoginSuccess = async (response: any) => {
    try {
      const result = await axios.post('http://localhost:5039/api/OAuth/signin-google', response);
      const userInfo = result.data as User;
      console.log('Success:', userInfo);
      
        const setToken = useCommonStore.getState().setToken;
        useUserStore.setState({user:userInfo})
        setToken(userInfo.token)
        const LoggingIn = useUserStore.getState().LoggingIn;
        LoggingIn(userInfo);
        window.location.href="/"
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  
  const handleLoginFailure = (error: any) => {
    console.error('Login Failed:', error);
  };
  
    const GoogleAuth = () => {
      const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
          // Check if all required scopes are granted
          const hasAccess = hasGrantedAllScopesGoogle(
            tokenResponse,
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
          );
  
          if (!hasAccess) {
            console.error('Required scopes not granted.');
            return;
          }
  
          // Proceed with your logic, for example, sending the token to your backend
          try {
            console.log(tokenResponse)
            const data = {
              AccessToken: tokenResponse.access_token
            };
            const result = await axios.post('http://localhost:5039/api/OAuth/signin-google/custom',data );
            console.log('Success:', result.data);
            const userInfo = result.data as User;
  
            const setToken = useCommonStore.getState().setToken;
            const setUser = useUserStore.getState().setUser;
            setUser(userInfo);
            setToken(userInfo.token)
            const LoggingIn = useUserStore.getState().LoggingIn;
            LoggingIn(userInfo);
            window.location.href="/"
          } catch (error) {
            console.error('Error:', error);
          }
        },
        onError: (error) => {
          console.error('Login Failed:', error);
        },
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile', // This might work here if not in the other component
      });
  
    return (
      <div>
      <Button className='w-fit p-4 rounded-full bg-card hover:bg-neutral shadow-background shadow-lg ' onClick={()=>login()}>
        <div className='flex justify-center items-center p-2 gap-2'>
          <Image alt='google logo' width={32} height={32} src={"/images/google.png"} />
        <span className='text-foreground font-semibold' style={{fontSize:"1.1rem"}}>Google</span>
        </div>
        
      </Button>
      </div>
    );
  };

  export default GoogleAuth;

