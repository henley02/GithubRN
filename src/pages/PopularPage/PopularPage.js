import React, { createRef } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { connect } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import actions from '../../redux/actions';
import PopularItem from '../../components/popularItem/popularItem';
import NavigationUtil from '../../public/js/NavigationUtil';
import FavoriteDao from '../../public/js/expand/FavoriteDao';
import { FLAG_STORAGE } from '../../public/fetch';
import FavoriteUtil from '../../public/js/favoriteUtil';
import EventBus from 'react-native-event-bus';

import { bottom_tab_select, favorite_changed_popular } from '../../config/EventTypes';
import GlobalStyles from '../../public/js/GlobalStyles';
import { FLAG_LANGUAGE } from '../../public/js/expand/LanguageDao';
import Feather from 'react-native-vector-icons/Feather';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const pageSize = 10;
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
import AnalyticsUtil from './../../public/js/AnalyticsUtil';

class PopularPage extends React.Component {
    constructor(props) {
        super(props);
        const { onLoadLanguage } = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_key);
    }

    _genTabs() {
        const tabs = {};
        const { keys, theme } = this.props;
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: (props) => <PopularTabPage {...props} tabLabel={item.name} theme={theme} />,
                    navigationOptions: {
                        title: item.name,
                    },
                };
            }
        });
        return tabs;
    }

    getRightButton() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {
                        console.log(AnalyticsUtil);
                        AnalyticsUtil.onEvent('SearchButtonClick');
                        NavigationUtil.goPage('SearchPage'), { ...this.props.navigation };
                    }}
                >
                    <View style={{ padding: 5, marginRight: 8 }}>
                        <Feather name={'search'} size={24} style={{ color: 'white' }} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { keys, theme } = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar statusBar={statusBar} title={'最热'} style={theme.style.navBar} rightButton={this.getRightButton()} />;
        const Tabs =
            keys.length > 0
                ? createAppContainer(
                      createMaterialTopTabNavigator(this._genTabs(), {
                          tabBarOptions: {
                              tabStyle: styles.tabStyle,
                              upperCaseLabel: false,
                              scrollEnabled: true,
                              style: {
                                  backgroundColor: theme.themeColor,
                              },
                              indicatorStyle: styles.indicatorStyle,
                              labelStyle: styles.labelStyle,
                          },
                          lazy: true,
                      })
                  )
                : null;
        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                {Tabs && <Tabs />}
            </View>
        );
    }
}

const mapPopularStateToProps = (state) => ({
    keys: state.language.keys,
    theme: state.theme.theme,
});

const mapPopularDispatchToProps = (dispatch) => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);

class PopularTab extends React.Component {
    constructor(props) {
        super(props);
        const { tabLabel } = props;
        this.storeName = tabLabel;
        this.toastRef = createRef();
        this.isFavoriteChanged = false;
    }

    componentDidMount() {
        this.loadData();
        EventBus.getInstance().addListener(
            favorite_changed_popular,
            (this.favoriteChangeListener = () => {
                this.isFavoriteChanged = true;
            })
        );
        EventBus.getInstance().addListener(
            bottom_tab_select,
            (this.bottomTabSelectListener = (data) => {
                if (data.to === 0 && this.isFavoriteChanged) {
                    this.loadData(null, true);
                }
            })
        );
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabSelectListener);
    }

    _store() {
        const { popular } = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
                hideLoadingMore: true,
            };
        }
        return store;
    }

    loadData(loadMore, refreshFavorite) {
        const { onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite } = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (callback) => {
                this.toastRef.current.show('没有更多了');
            });
        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
        } else {
            onLoadPopularData(this.storeName, url, pageSize, favoriteDao);
        }
    }

    genFetchUrl(storeName) {
        return `${URL}${storeName}${QUERY_STR}`;
    }

    onSelect = (item, callback) => {
        NavigationUtil.goPage('DetailPage', {
            projectModel: item,
            flag: FLAG_STORAGE.flag_popular,
            callback,
        });
    };

    genIndicator() {
        return this._store().hideLoadingMore ? null : (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator style={styles.indicator} />
                <Text>正在加载更多</Text>
            </View>
        );
    }

    render() {
        let store = this._store();
        const { theme } = this.props;
        return (
            <View>
                <FlatList
                    data={store.projectModels}
                    keyExtractor={(item) => '' + item.id}
                    renderItem={(data) => (
                        <PopularItem
                            theme={theme}
                            projectModel={data.item}
                            onSelect={(callback) => this.onSelect(data.item, callback)}
                            onFavorite={(item, isFavorite) => {
                                FavoriteUtil.onFavorite(favoriteDao, data.item, isFavorite, FLAG_STORAGE.flag_popular);
                            }}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={store.isLoading}
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            onRefresh={() => this.loadData()}
                            tintColor={theme.themeColor}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                this.loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100);
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true;
                    }}
                />
                <Toast ref={this.toastRef} position={'center'} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    popular: state.popular,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadPopularData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onLoadPopularData(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
    tabStyle: {
        minWidth: 30,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white',
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6,
    },
    indicatorContainer: {
        alignItems: 'center',
    },
    indicator: {
        color: 'red',
        margin: 10,
    },
});
