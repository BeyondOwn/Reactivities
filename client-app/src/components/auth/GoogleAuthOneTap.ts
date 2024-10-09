import { User } from "@/app/models/user";
import { useCommonStore } from "@/app/stores/commonStore";
import { useUserStore } from "@/app/stores/userStore";
import { baseURL } from "@/utils/agent";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleAuthOneTap = () => {
     useGoogleOneTapLogin({
      onSuccess: async credentialResponse => {
        console.log(credentialResponse);
        const result = await axios.post(`${baseURL}/OAuth/signin-google/onetap`,credentialResponse );
          console.log('Success:', result.data);
          const userInfo = result.data as User;

          const setToken = useCommonStore.getState().setToken;
          const setUser = useUserStore.getState().setUser;
            setUser(userInfo);
          setToken(userInfo.token)
          const LoggingIn = useUserStore.getState().LoggingIn;
          LoggingIn(userInfo);
          window.location.href="/"
      },
      onError: () => {
        console.log('Login Failed');
      },
    });
  }

  export default GoogleAuthOneTap