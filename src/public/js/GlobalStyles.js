import { Dimensions, Platform } from 'react-native';

const BACKGROUND_COLOR = '#f3f3f4';

const X_WIDTH = 375;
const X_HEIGHT = 812;

// screen
const { width, height } = Dimensions.get('window');
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export function isIphoneX() {
    return Platform.OS === 'ios' && SCREEN_HEIGHT >= X_HEIGHT;
}

export default {
    root_container: {
        backgroundColor: BACKGROUND_COLOR,
        flex: 1,
        marginTop: isIphoneX() ? 30 : 0,
    },
    backgroundColor: BACKGROUND_COLOR,
    nav_bar_height_ios: 44,
    nav_bar_height_android: 50,
};
