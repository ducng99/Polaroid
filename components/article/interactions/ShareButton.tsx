import useColorScheme from "../../../hooks/useColorScheme";
import { View } from '../../ThemedDefaultComponents';
import { Ionicons } from "../../VectorIcons";

interface IProps {
    onPress: () => void;
}

export default function ShareButton(props: IProps) {
    const colorScheme = useColorScheme();

    return (
        <View>
            <Ionicons
                name="paper-plane-outline"
                size={24}
                color={iconColors[colorScheme].color}
                onPress={props.onPress}
            />
        </View>
    )
}

const iconColors = {
    light: {
        color: '#000'
    },
    dark: {
        color: '#fff',
    }
};