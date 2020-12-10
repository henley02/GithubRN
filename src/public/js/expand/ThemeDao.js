import AsyncStorage from '@react-native-async-storage/async-storage';
import langs from './../../../config/langs.json';
import keys from './../../../config/keys.json';
import ThemeFactory, { ThemeFlags } from '../ThemeFactory';
const THEME_KEY = 'theme_key';

export default class ThemeDao {
    /**
     * 获取当前主题
     * @returns {Promise<unknown>}
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if (!result) {
                        this.save(ThemeFlags.Default);
                        result = ThemeFlags.Default;
                    }
                    resolve(ThemeFactory.createTheme(result));
                }
            });
        });
    }

    save(themeFlags) {
        AsyncStorage.setItem(THEME_KEY, themeFlags);
    }
}
