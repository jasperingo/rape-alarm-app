
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { 
  COLOR_PRIMARY, 
  DIMENSION_LG, 
  DIMENSION_MD, 
  DIMENSION_SM, 
  DIMENSION_XS, 
  DIMENSION_XXL, 
  DIMENSION_XXXL, 
  FONT_BOLD 
} from '../assets/styles/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../components/AppButton';
import { useUser, useUserFetch, useUserSignOut } from '../hooks/userHook';
import { useNavigation } from '@react-navigation/native';
import { useErrorMessage } from '../hooks/errorHook';
import { NavigationOnTabProp } from './TabScreen';
import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';
import { NO_INTERNET_CONNECTION } from '../constants/errorCodes';
import { User } from 'firebase/auth';

const styles = StyleSheet.create({

  container: {
    height: '100%',
    padding: DIMENSION_SM,
    justifyContent: 'center'
  },

  name: {
    fontSize: 40,
    fontWeight: FONT_BOLD,
    marginVertical: DIMENSION_LG
  },

  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSION_XXL
  },

  email: {
    fontSize: DIMENSION_MD,
    marginStart: DIMENSION_XS
  },

  icon: {
    textAlign: 'center'
  }

});

const ProfileScreen = () => {

  const navigation = useNavigation<NavigationOnTabProp>();

  const errorMessage = useErrorMessage();

  const [
    onSignOut, 
    signOutSuccess, 
    signOutLoading, 
    signOutError, 
    resetStatus
  ] = useUserSignOut();

  const userAuth = useUser() as User;

  const [user, loading, error, canLoad, onError] = useUserFetch(userAuth?.uid);

  useEffect(
    ()=> {
      
      if (signOutSuccess)
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }]
        });

      if (signOutError !== null) {
        alert(errorMessage(signOutError));
        resetStatus();
      }
    },
    [signOutSuccess, signOutError, navigation, resetStatus, errorMessage]
  );
  
  useEffect(
    ()=> {
      if (userAuth !== null) {
        NetInfo.fetch().then(state => {
          if (!state.isConnected) {
            onError(NO_INTERNET_CONNECTION);
          } else {
            canLoad();
          }
        });
      }
    },
    [userAuth, canLoad, onError]
  );
  
  return (
    <View style={styles.container}>

      {
        user !== null && 
        <>
          <Ionicons name='person-outline' size={100} color={COLOR_PRIMARY} style={styles.icon} />
          
          <Text style={styles.name}>Welcome, { user.fullName }</Text>

          <View style={styles.emailContainer}>
            <Ionicons name='mail' size={DIMENSION_XXXL} color={COLOR_PRIMARY} />
            <Text style={styles.email}>{ user.email }</Text>
          </View>

          <AppButton loading={signOutLoading} text="Sign out" onPress={onSignOut} />
        </>
      }

      {
        loading && <Loading />
      }

      {
        error !== null && 
        <LoadingError 
          error={errorMessage(error)}
          onReloadPress={canLoad}
          />
      }

    </View>
  );
}

export default ProfileScreen;
