import {TextField} from '@mftechio/react-native-mftech-material-textfield';
import React, {useRef, useState} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const marginTop =
  Platform.select({
    ios: 8,
    android: 32,
  }) ?? 8;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'transparent',
    flexGrow: 1,
  },

  container: {
    margin: 8,
    marginTop,
    flex: 1,
  },

  contentContainer: {
    padding: 8,
  },

  buttonContainer: {
    paddingTop: 8,
    margin: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },

  safeContainer: {
    flex: 1,
    backgroundColor: '#E8EAF6',
  },
});

let defaults = {
  firstname: 'Edward',
  lastname: 'Stark',
  about:
    'Stoic, dutiful, and honorable man, considered to embody the values of the North',
};

export default function App() {
  const firstname = useRef<TextField>();
  const lastname = useRef<TextField>();
  const about = useRef<TextField>();
  const email = useRef<TextField>();
  const password = useRef<TextField>();
  const house = useRef<TextField>();
  const refs = {
    firstname: firstname.current,
    lastname: lastname.current,
    about: about.current,
    email: email.current,
    password: password.current,
    house: house.current,
  };

  const [state, setState] = useState({
    secureTextEntry: true,
    errors: {},
    ...defaults,
  });

  function onFocus() {
    let {errors = {}} = state;

    for (let name in errors) {
      if (refs[name] && refs[name].isFocused()) {
        delete errors[name];
      }
    }

    setState(preState => ({
      ...preState,
      errors,
    }));
  }

  function onChangeText(text: string) {
    ['firstname', 'lastname', 'about', 'email', 'password']
      .map(name => ({name, ref: refs[name]}))
      .forEach(({name, ref}) => {
        if ([ref.isFocused()]) {
          setState(preState => ({
            ...preState,
            [name]: text,
          }));
        }
      });
  }

  function onAccessoryPress() {
    setState(preState => ({
      ...preState,
      secureTextEntry: !preState.secureTextEntry,
    }));
  }

  const onSubmitFirstName = () => lastname.current?.focus();

  const onSubmitLastName = () => about.current?.focus();

  const onSubmitAbout = () => email.current?.focus();

  const onSubmitEmail = () => password.current?.focus();

  const onSubmitPassword = () => house.current?.blur();

  function onSubmit() {
    let errors = {};

    [('firstname', 'lastname', 'email', 'password')].forEach(name => {
      let value = refs[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
      } else {
        if (name === 'password' && value.length < 6) {
          errors[name] = 'Too short';
        }
      }
    });

    setState(preState => ({
      ...preState,
      errors,
    }));
  }

  function renderPasswordAccessory() {
    let {secureTextEntry} = state;

    let name = secureTextEntry ? 'visibility' : 'visibility-off';

    return (
      <MaterialIcon
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={onAccessoryPress}
        suppressHighlighting={true}
      />
    );
  }

  const {errors, secureTextEntry, ...data} = state;

  let defaultEmail = `${data.firstname || 'name'}@${
    data.lastname || 'house'
  }.com`
    .replace(/\s+/g, '_')
    .toLowerCase();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <TextField
            ref={firstname}
            value={defaults.firstname}
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitFirstName}
            onFocus={onFocus}
            returnKeyType="next"
            label="First Name"
            error={errors?.firstname}
          />

          <TextField
            ref={lastname}
            value={defaults.lastname}
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitLastName}
            returnKeyType="next"
            label="Last Name"
            error={errors?.lastname}
          />

          <TextField
            ref={about}
            value={defaults.about}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitAbout}
            returnKeyType="next"
            multiline={true}
            blurOnSubmit={true}
            label="About (optional)"
            characterRestriction={140}
          />

          <TextField
            ref={email}
            defaultValue={defaultEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEmail}
            returnKeyType="next"
            label="Email Address"
            error={errors?.email}
          />

          <TextField
            ref={password}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            clearTextOnFocus={true}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitPassword}
            returnKeyType="done"
            label="Password"
            error={errors?.password}
            title="Choose wisely"
            maxLength={30}
            characterRestriction={20}
            renderRightAccessory={renderPasswordAccessory}
          />

          <TextField
            ref={house}
            defaultValue={data.lastname}
            label="House"
            title="Derived from last name"
            disabled={true}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={onSubmit}
            title="submit"
            color={TextField.defaultProps.tintColor}
            style={{height: 48}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
