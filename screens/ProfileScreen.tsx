
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
import { useUser, useUserSignOut } from '../hooks/userHook';
import { useNavigation } from '@react-navigation/native';
import { useErrorMessage } from '../hooks/errorHook';
import { NavigationOnTabProp } from './TabScreen';
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

  const user = useUser() as User;

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
  
  return (
    <View style={styles.container}>
      
      <Text style={styles.name}>{ user.displayName }</Text>

      <View style={styles.emailContainer}>
        <Ionicons name='mail' size={DIMENSION_XXXL} color={COLOR_PRIMARY} />
        <Text style={styles.email}>{ user.email }</Text>
      </View>

      <AppButton loading={signOutLoading} text="Sign out" onPress={onSignOut} />

    </View>
  );
}

export default ProfileScreen;
