import { TRENDING_LOAD_MORE_FAIL, TRENDING_LOAD_MORE_SUCCESS, TRENDING_PUSH_FAVORITE, TRENDING_REFRESH, TRENDING_REFRESH_FAIL, TRENDING_REFRESH_SUCCESS } from './action-types';
import DataStorage from '../../public/js/expand/DataStorage';
import { FLAG_STORAGE } from '../../public/fetch';
import { _projectModels, handleData } from './actionUtil';

export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
    return async (dispatch) => {
        dispatch({ type: TRENDING_REFRESH, storeName: storeName });
        let dataStore = new DataStorage();
        try {
            const res = await dataStore.fetchData(url, FLAG_STORAGE.flag_trending);
            handleData(TRENDING_REFRESH_SUCCESS, dispatch, storeName, res, pageSize, favoriteDao);
        } catch (error) {
            dispatch({
                type: TRENDING_REFRESH_FAIL,
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
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
    return (dispatch) => {
        setTimeout(() => {
            if (pageSize * (pageIndex - 1) >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more');
                }
                dispatch({
                    type: TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName,
                    pageIndex: --pageIndex,
                });
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;

                _projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
                    dispatch({
                        type: TRENDING_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels: data,
                    });
                });
            }
        }, 500);
    };
}

export function onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    return (dispatch) => {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
            dispatch({
                type: TRENDING_PUSH_FAVORITE,
                storeName,
                pageIndex,
                projectModels: data,
            });
        });
    };
}
