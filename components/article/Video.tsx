import { VideoVersion } from "../../models/InstaFeedResponse"
import { Video as DefaultVideo, AVPlaybackStatus, ResizeMode } from 'expo-av'
import { Animated, PixelRatio, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useEffect, useRef, useState } from "react";
import { View } from "../ThemedDefaultComponents";
import { AnimatedFontAwesome5, FontAwesome5 } from "../VectorIcons";
import { Sleep, UserAgent } from "../../utils";

interface IProps {
    videos: VideoVersion[],
    isViewing: boolean,
}

export default function Video({ videos, isViewing }: IProps) {
    const windowSize = useWindowDimensions();
    const realWidth = PixelRatio.getPixelSizeForLayoutSize(windowSize.width);
    const videoRef = useRef<DefaultVideo>(null);
    const [video, setVideo] = useState<VideoVersion>(videos[0]);
    const [videoSize, setVideoSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [status, setStatus] = useState<AVPlaybackStatus & { isPlaying?: boolean } | null>(null);
    const [isMuted, setMuted] = useState(false);
    const playButtonOpacity = useRef(new Animated.Value(0)).current;
    let isloading = false;

    useEffect(() => {
        setVideo(getVideo());

        if (status?.isPlaying) {
            playButtonOpacity.setValue(0);
        }
        else {
            playButtonOpacity.setValue(1);
        }
    }, [videos]);

    useEffect(() => {
        setVideoSize(getFitVideoSize(video));

        if (isViewing)
            loadVideo(video);
    }, [video]);

    const loadVideo = async (video: VideoVersion) => {
        // For some shitty reason, ExoPlayer keeps throwing "Decoder init failed".
        // So we will keep trying to play the video until it works.
        if (!isloading) {
            isloading = true;
            let newStatus = null;

            do {
                try {
                    newStatus = await videoRef.current?.loadAsync?.({
                        uri: video.url,
                        headers: { "User-Agent": UserAgent },
                        overrideFileExtensionAndroid: "mp4",
                    }, {
                        isLooping: true,
                        shouldPlay: false
                    })
                }
                catch { }
                if (!newStatus || !newStatus.isLoaded) {
                    console.log("Failed to load video. Retrying...");
                    await Sleep(5000);
                }
            } while (isViewing && (!newStatus || !newStatus.isLoaded));

            isloading = false;
        }
    }

    useEffect(() => {
        if (!isViewing && status?.isLoaded) {
            videoRef.current?.pauseAsync?.();
        }
        else if (isViewing && !status?.isLoaded) {
            loadVideo(video);
        }
    }, [isViewing]);

    useEffect(() => {
        if (status) {
            if (status.isPlaying) {
                playButtonOpacity.stopAnimation(() => {
                    Animated.timing(playButtonOpacity, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    }).start();
                });
            }
            else {
                playButtonOpacity.stopAnimation(() => {
                    Animated.timing(playButtonOpacity, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                    }).start();
                });
            }
        }
    }, [status?.isPlaying]);

    /**
     * Get correct sized video to best fit the screen
     */
    const getVideo = () => {
        let optimalVids = videos.filter(vid => vid.width > realWidth).sort((a, b) => a.width - b.width);

        if (optimalVids.length === 0) {
            optimalVids = videos;
            optimalVids.sort((a, b) => b.width - a.width);
        }

        return optimalVids[0];
    }

    const getFitVideoSize = (video: VideoVersion) => {
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
        if (status?.isLoaded && status?.isPlaying) {
            videoRef.current?.pauseAsync?.();
        } else if (status?.isLoaded) {
            videoRef.current?.playAsync?.();
        }
    }

    const toggleMute = async () => {
        await videoRef.current?.setIsMutedAsync(!isMuted);
        setMuted(!isMuted);
    }

    return (
        <View>
            <DefaultVideo
                style={[styles.videoPlayer, videoSize]}
                onPlaybackStatusUpdate={(status) => setStatus(status)}
                resizeMode={ResizeMode.COVER}
                ref={videoRef}
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