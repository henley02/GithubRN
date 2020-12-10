import { SHOW_THEME_VIEW, THEME_CHANGE } from './action-types';
import ThemeDao from '../../public/js/expand/ThemeDao';

export function onChangeTheme(theme) {
    return { type: THEME_CHANGE, theme };
}

/**
 * 初始化主题
 */
export function onThemeInit() {
    return (dispatch) => {
        new ThemeDao().getTheme().then((data) => {
            dispatch(onChangeTheme(data));
        });
    };
}

/**
 * 显示自定义主题浮层
 * @param show
 * @returns {{customThemeViewVisible: *, type: string}}
 */
export function onShowCustomThemeView(show) {
    return { type: SHOW_THEME_VIEW, customThemeViewVisible: show };
}
