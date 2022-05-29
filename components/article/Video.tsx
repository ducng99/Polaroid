import { VideoVersion } from "../../models/InstaFeedResponse"
import { Video as DefaultVideo, AVPlaybackStatus, ResizeMode } from 'expo-av'
import { Animated, Pressable, StyleProp, StyleSheet, useWindowDimensions, ViewStyle } from "react-native";
import { useEffect, useRef, useState } from "react";
import { View } from "../ThemedDefaultComponents";
import { FontAwesome } from "@expo/vector-icons";

interface IProps {
    videos: VideoVersion[]
}

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome);

export default function Video(props: IProps) {
    const windowSize = useWindowDimensions();
    const videoRef = useRef<DefaultVideo>(null);
    const [status, setStatus] = useState<AVPlaybackStatus & { isPlaying: boolean } | null>(null);
    const [isMuted, setMuted] = useState(false);
    const playButtonOpacity = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        if (status?.isPlaying) {
            playButtonOpacity.setValue(0);
        }
        else {
            playButtonOpacity.setValue(1);
        }
    }, []);

    const getFitVideoSize = (video: VideoVersion): StyleProp<ViewStyle> => {
        const ratio = video.width / video.height;
        let width = windowSize.width;
        let height = windowSize.width / ratio;
        
        if (height > windowSize.height * 0.7) {
            height = windowSize.height * 0.7;
            width = height * ratio;
        }
        
        return { width, height };
    }

    const togglePlay = () => {
        if (status?.isPlaying) {
            videoRef.current?.pauseAsync();

            playButtonOpacity.stopAnimation();
            Animated.timing(playButtonOpacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }).start();
        } else {
            videoRef.current?.playAsync();

            playButtonOpacity.stopAnimation();
            Animated.timing(playButtonOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }).start();
        }
    }

    const toggleMute = async () => {
        await videoRef.current?.setIsMutedAsync(!isMuted);
        setMuted(!isMuted);
    }

    return (
        <View>
            <DefaultVideo
                source={{ uri: props.videos[0].url }}
                style={[styles.videoPlayer, getFitVideoSize(props.videos[0])]}
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(status)}
                ref={videoRef}
                resizeMode={ResizeMode.COVER}
            />
            <Pressable style={styles.overlay} onPress={togglePlay}>
                <AnimatedIcon name="play" size={70} color='#ffffffcc' style={{ opacity: playButtonOpacity }}></AnimatedIcon>
            </Pressable>
            <Pressable style={styles.muteButton} onPress={toggleMute}>
                <FontAwesome name={isMuted ? "volume-off" : "volume-up"} size={16} color='#ffffffaa'></FontAwesome>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    muteButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 25,
        width: 30,
        height: 30,
        marginRight: 5,
        marginBottom: 5,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    videoPlayer: {
        alignSelf: 'center'
    }
})