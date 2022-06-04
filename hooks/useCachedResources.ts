import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Ionicons } from '../components/VectorIcons';

export default function useCachedResources() {
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    // Load any resources or data that we need prior to rendering the app
    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();

                // Load fonts
                await Font.loadAsync({
                    ...Ionicons.font,
                    'Roboto-Bold': require('../assets/fonts/Roboto/Roboto-Bold.ttf'),
                    'Roboto-Medium': require('../assets/fonts/Roboto/Roboto-Medium.ttf'),
                    'Roboto-Regular': require('../assets/fonts/Roboto/Roboto-Regular.ttf'),
                    'cookie-handwriting': require('../assets/fonts/Cookie/Cookie-Regular.ttf'),
                    'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
                });
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
                SplashScreen.hideAsync();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    return isLoadingComplete;
}
