import React from 'react';
import { createAppContainer } from 'react-navigation';
import { BottomTabBar, createBottomTabNavigator } from 'react-navigation-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import TrendingPage from '../pages/TrendingPage/TrendingPage';
import FavoritePage from '../pages/FavoritePage/FavoritePage';
import MyPage from '../pages/MyPage/MyPage';
import PopularPage from '../pages/PopularPage/PopularPage';

import { connect } from 'react-redux';
import EventBus from 'react-native-event-bus';
import { bottom_tab_select } from './../config/EventTypes';

const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: '最热',
            tabBarIcon: ({ tintColor, focused }) => <MaterialIcons name={'whatshot'} color={tintColor} size={26} />,
        },
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: '趋势',
            tabBarIcon: ({ tintColor, focused }) => <Ionicons name={'md-trending-up'} color={tintColor} size={26} />,
        },
    },

    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: '收藏',
            tabBarIcon: ({ tintColor, focused }) => <MaterialIcons name={'favorite'} color={tintColor} size={26} />,
        },
    },

    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({ tintColor, focused }) => <Entypo name={'user'} color={tintColor} size={26} />,
        },
    },
};

class TabBarComponent extends React.Component {
    render() {
        return <BottomTabBar {...this.props} activeTintColor={this.props.theme.themeColor} />;
    }
}

class DynamicTabNavigator extends React.Component {
    constructor(props) {
        super(props);
    }

    _tabNavigator() {
        if (this.Tabs) {
            return this.Tabs;
        }

        const { PopularPage, TrendingPage, MyPage, FavoritePage } = TABS;
        const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
        // PopularPage.navigationOptions.tabBarLabel = '动态3'; // 动态修改tab属性
        return (this.Tabs = createAppContainer(
            createBottomTabNavigator(tabs, {
                tabBarComponent: (props) => <TabBarComponent theme={this.props.theme} {...props} />,
            })
        ));
    }

    render() {
        const TabNavigator = this._tabNavigator();
        return (
            <TabNavigator
                onNavigationStateChange={(prevState, newState, action) => {
                    EventBus.getInstance().fireEvent(bottom_tab_select, {
                        from: prevState.index,
                        to: newState.index,
                    });
                }}
            />
        );
    }
}

const mapStateToProps = (state) => ({ theme: state.theme.theme });

export default connect(mapStateToProps)(DynamicTabNavigator);
