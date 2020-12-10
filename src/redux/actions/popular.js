import { POPULAR_LOAD_MORE_FAIL, POPULAR_LOAD_MORE_SUCCESS, POPULAR_PUSH_FAVORITE, POPULAR_REFRESH, POPULAR_REFRESH_FAIL, POPULAR_REFRESH_SUCCESS } from './action-types';
import DataStorage from '../../public/js/expand/DataStorage';
import { FLAG_STORAGE } from '../../public/fetch';
import { _projectModels, handleData } from './actionUtil';

export function onLoadPopularData(storeName, url, pageSize, favoriteDao) {
    return async (dispatch) => {
        dispatch({ type: POPULAR_REFRESH, storeName: storeName });
        let dataStore = new DataStorage();
        try {
            const res = await dataStore.fetchData(url, FLAG_STORAGE.flag_popular);
            handleData(POPULAR_REFRESH_SUCCESS, dispatch, storeName, res, pageSize, favoriteDao);
        } catch (error) {
            dispatch({
                type: POPULAR_REFRESH_FAIL,
                storeName,
                error,
            });
        }
    };
}

/**
 *
 * @param storeName
 * @param PageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callback
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
    return (dispatch) => {
        setTimeout(() => {
            if (pageSize * (pageIndex - 1) >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more');
                }
                dispatch({
                    type: POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName,
                    pageIndex: --pageIndex,
                });
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                _projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
                    dispatch({
                        type: POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels: data,
                    });
                });
            }
        }, 500);
    };
}

export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    return (dispatch) => {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
            dispatch({
                type: POPULAR_PUSH_FAVORITE,
                storeName,
                pageIndex,
                projectModels: data,
            });
        });
    };
}
