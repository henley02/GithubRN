import { THEME_CHANGE, THEME_INIT, SHOW_THEME_VIEW } from '../actions/action-types';
import ThemeFactory, { ThemeFlags } from '../../public/js/ThemeFactory';

const defaultState = {
    theme: ThemeFactory.createTheme(ThemeFlags.Default),
    customThemeViewVisible: false,
};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case THEME_CHANGE:
            return { ...state, theme: action.theme };
        case SHOW_THEME_VIEW:
            return { ...state, customThemeViewVisible: action.customThemeViewVisible };
        default:
            return state;
    }
}
