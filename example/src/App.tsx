import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { multiply } from 'react-native-session-manager';
import { useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import SessionManager from 'react-native-session-manager';

global.Buffer = global.Buffer || Buffer;

const scheme = "session_manager_sample";
const SESSION_TIMEOUT = 86400;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();
  const [errorMsg, setErrorMsg] = useState("");
  const [createSessionResult, setCreateSessionResult] = useState<boolean>(false);

  var sessionManager = useRef<SessionManager>();

  React.useEffect(() => {
    sessionManager.current = new SessionManager("", SecureStore, SESSION_TIMEOUT);         
    multiply(3, 7).then(setResult);
  }, []);

  const createSession = async () => {
    try {
      sessionManager.current?.createSession("").then(setCreateSessionResult);
    } catch (error) {
      console.error(error);
      setErrorMsg(String(error));
    }

  }

  return (
    <View style={styles.container}>
      {createSessionResult != null ? <Text>CreateSessionResult: {createSessionResult}</Text> : null}
      <Button title="Login with Web3Auth" onPress={createSession} />
    </View>
  );
}
