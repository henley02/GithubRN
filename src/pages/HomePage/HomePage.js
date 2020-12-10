import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import DynamicTabNavigator from '../../navigator/DynamicTabNavigator';
import NavigationUtil from '../../public/js/NavigationUtil';
import CustomTheme from '../CustomTheme/CustomTheme';
import actions from './../../redux/actions';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    renderCustomThemeView() {
        const { customThemeViewVisible, onShowCustomThemeView } = this.props;
        return <CustomTheme visible={customThemeViewVisible} {...this.props} onClose={() => onShowCustomThemeView(false)} />;
    }

    render() {
        NavigationUtil.navigation = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <DynamicTabNavigator />
                {this.renderCustomThemeView()}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    customThemeViewVisible: state.theme.customThemeViewVisible,
});

const mapDispatchToProps = (dispatch) => ({
    onShowCustomThemeView: (value) => dispatch(actions.onShowCustomThemeView(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
