import LanguageDao from './../../public/js/expand/LanguageDao';
import { LANGUAGE_LOAD_SUCCESS } from './action-types';

export function onLoadLanguage(flagKey) {
    return async (dispatch) => {
        try {
            const data = await new LanguageDao(flagKey).fetch();
            dispatch({
                type: LANGUAGE_LOAD_SUCCESS,
                languages: data,
                flag: flagKey,
            });
        } catch (e) {
            console.log(e);
        }
    };
}
