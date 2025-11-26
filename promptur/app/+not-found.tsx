import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function NotFoundScreen() {
  const local = useLocalSearchParams<{'not-found':string[]}>();
  const routeName = local['not-found'].join("/")
  return (
    <>
      <Stack.Screen options={{ title: `Oops! ${routeName} Not Found` }} />
      <View style={styles.container}>
        <Link href="/(tabs)/index" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
