import React from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import GlobalStyles, { isIphoneX } from '../../public/js/GlobalStyles';
import ThemeDao from '../../public/js/expand/ThemeDao';
import ThemeFactory, { ThemeFlags } from '../../public/js/ThemeFactory';
import actions from '../../redux/actions/index';

class CustomTheme extends React.Component {
    constructor(props) {
        super(props);
        this.themeDao = new ThemeDao();
    }

    onSelectTheme(themeKey) {
        this.props.onClose();
        this.themeDao.save(ThemeFlags[themeKey]);
        const { onChangeTheme } = this.props;
        onChangeTheme(ThemeFactory.createTheme(ThemeFlags[themeKey]));
    }

    getThemeItem(themeKey) {
        console.log(themeKey);
        return (
            <TouchableHighlight style={{ flex: 1 }} underlayColor={'white'} onPress={() => this.onSelectTheme(themeKey)}>
                <View style={[{ backgroundColor: ThemeFlags[themeKey] }, styles.themItem]}>
                    <Text style={styles.themeText}>{themeKey}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderThemeItems() {
        const views = [];
        for (let i = 0, keys = Object.keys(ThemeFlags); i < keys.length; i += 3) {
            const key1 = keys[i],
                key2 = keys[i + 1],
                key3 = keys[i + 2];
            views.push(
                <View key={i} style={{ flexDirection: 'row' }}>
                    {this.getThemeItem(key1)}
                    {this.getThemeItem(key2)}
                    {this.getThemeItem(key3)}
                </View>
            );
        }
        return views;
    }

    _renderContentView() {
        return (
            <Modal animationType={'slide'} transparent={true} visible={this.props.visible} onRequestClose={() => this.props.onClose()}>
                <View style={styles.modalContainer}>
                    <ScrollView>{this.renderThemeItems()}</ScrollView>
                </View>
            </Modal>
        );
    }

    render() {
        let view = this.props.visible ? <View style={GlobalStyles.root_container}>{this._renderContentView()}</View> : null;
        return view;
    }
}

const mapStateToProps = (state) => ({
    visible: state.theme.customThemeViewVisible,
});

const mapDispatchToProps = (dispatch) => ({
    onChangeTheme: (theme) => dispatch(actions.onChangeTheme(theme)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomTheme);

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        margin: 10,
        marginTop: Platform.OS === 'ios' ? 20 : 10,
        backgroundColor: 'white',
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        padding: 3,
    },
    themItem: {
        flex: 1,
        height: 120,
        margin: 3,
        padding: 3,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
});
