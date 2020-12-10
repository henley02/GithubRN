import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import actions from '../../redux/actions';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MORE_MENU } from '../../config/More_menu';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Underline from '../../components/Underline/Underline';
import GlobalStyles from '../../public/js/GlobalStyles';
import ViewUtil from '../../public/js/ViewUtil';
import NavigationUtil from '../../public/js/NavigationUtil';
import { FLAG_LANGUAGE } from '../../public/js/expand/LanguageDao';

class MyPage extends React.Component {
    getRightButton() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {}}>
                    <View style={{ padding: 5, marginRight: 8 }}>
                        <Feather name={'search'} size={24} style={{ color: 'white' }} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    onClick = (menu) => {
        let RouteName,
            params = {};
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebviewPage';
                params = {
                    title: '教程',
                    url: 'https://coding.m.imooc.com/classindex.html?cid=89',
                };
                break;
            case MORE_MENU.About:
                RouteName = 'AboutPage';
                break;
            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage';
                break;
            case MORE_MENU.Custom_Language:
            case MORE_MENU.Custom_Key:
            case MORE_MENU.Remove_Key:
                RouteName = 'CustomKeyPage';
                params = {
                    flag: menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language,
                    isRemoveKey: menu === MORE_MENU.Remove_Key,
                };
                break;
            case MORE_MENU.Sort_Key:
            case MORE_MENU.Sort_Language:
                RouteName = 'SortKeyPage';
                params = {
                    flag: menu !== MORE_MENU.Sort_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language,
                };
                break;
            case MORE_MENU.Custom_Theme:
                const { onShowCustomThemeView } = this.props;
                onShowCustomThemeView(true);
                break;
        }

        if (RouteName) {
            NavigationUtil.goPage(RouteName, params);
        }
    };

    getItem = (menu) => {
        const { theme } = this.props;
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
    };

    render() {
        const { theme } = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar title={'我的'} statusBar={statusBar} style={theme.style.navBar} rightButton={this.getRightButton()} />;

        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <ScrollView>
                    <TouchableOpacity onPress={() => this.onClick(MORE_MENU.About)} style={styles.item}>
                        <View style={styles.about_left}>
                            <Ionicons name={MORE_MENU.About.icon} size={40} color={theme.themeColor} style={{ marginRight: 10 }} />
                            <Text>GitHub Popular</Text>
                        </View>
                        <MaterialIcons name={'arrow-forward-ios'} size={16} style={{ marginRight: 10, alignSelf: 'center' }} color={theme.themeColor} />
                    </TouchableOpacity>
                    <Underline />
                    {this.getItem(MORE_MENU.Tutorial)}
                    <Text style={styles.groupTitle}>趋势管理</Text>
                    {this.getItem(MORE_MENU.Custom_Language)}
                    <Underline />
                    {this.getItem(MORE_MENU.Sort_Language)}

                    <Text style={styles.groupTitle}>最热模块</Text>
                    {this.getItem(MORE_MENU.Custom_Key)}
                    <Underline />
                    {this.getItem(MORE_MENU.Sort_Key)}
                    <Underline />
                    {this.getItem(MORE_MENU.Remove_Key)}
                    <Text style={styles.groupTitle}>设置 </Text>
                    {this.getItem(MORE_MENU.Custom_Theme)}
                    <Underline />
                    {this.getItem(MORE_MENU.About_Author)}
                    <Underline />
                    {this.getItem(MORE_MENU.Feedback)}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    about_left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    groupTitle: {
        fontSize: 12,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        color: 'gray',
    },
});

const mapStateToProps = (state) => ({
    theme: state.theme.theme,
});

const mapDispatchToProps = (dispatch) => ({
    onChangeTheme: (theme) => dispatch(actions.onChangeTheme(theme)),
    onShowCustomThemeView: (value) => dispatch(actions.onShowCustomThemeView(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
