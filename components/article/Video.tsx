import { VideoVersion } from "../../models/InstaFeedResponse"
import { Video as DefaultVideo, AVPlaybackStatus, ResizeMode } from 'expo-av'
import { Animated, Pressable, StyleProp, StyleSheet, useWindowDimensions, ViewStyle } from "react-native";
import { useEffect, useRef, useState } from "react";
import { View } from "../ThemedDefaultComponents";
import { AnimatedFontAwesome5, FontAwesome5 } from "../VectorIcons";

interface IProps {
    videos: VideoVersion[]
}

export default function Video(props: IProps) {
    const windowSize = useWindowDimensions();
    const videoRef = useRef<DefaultVideo>(null);
    const [status, setStatus] = useState<AVPlaybackStatus & { isPlaying?: boolean } | null>(null);
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
                <AnimatedFontAwesome5 name="play" size={70} color='#ffffffcc' style={{ opacity: playButtonOpacity }}></AnimatedFontAwesome5>
            </Pressable>
            <Pressable style={styles.muteButton} onPress={toggleMute}>
                <View style={styles.muteButtonContainer}>
                    <FontAwesome5 name={isMuted ? "volume-mute" : "volume-up"} size={14} color='rgba(255,255,255,0.95)'></FontAwesome5>
                </View>
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
        position: 'absolute',
        width: 42,
        height: 42,
        bottom: 0,
        right: 0,
    },
    muteButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        width: 28,
        height: 28,
        backgroundColor: 'rgba(38, 38, 38, 0.95)',
    },
    videoPlayer: {
        alignSelf: 'center'
    }
})