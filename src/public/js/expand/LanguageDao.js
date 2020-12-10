import AsyncStorage from '@react-native-async-storage/async-storage';
import langs from './../../../config/langs.json';
import keys from './../../../config/keys.json';

export const FLAG_LANGUAGE = {
    flag_language: 'language_dao_language',
    flag_key: 'language_doa_key',
};

export default class LanguageDao {
    constructor(flag) {
        this.flag = flag;
    }

    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if (!result) {
                        let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys;
                        this.save(data);
                        resolve(data);
                    } else {
                        try {
                            resolve(JSON.parse(result));
                        } catch (e) {
                            reject(e);
                        }
                    }
                }
            });
        });
    }

    save(objectData) {
        let stringData = JSON.stringify(objectData);
        AsyncStorage.setItem(this.flag, stringData, (error, result) => {});
    }
}
