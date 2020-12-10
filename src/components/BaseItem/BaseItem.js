import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class BaseItem extends React.Component {
    static propTypes = {
        projectModel: PropTypes.object,
        onSelect: PropTypes.func,
        onFavorite: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            isFavorite: props.projectModel.isFavorite,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const isFavorite = nextProps.projectModel.isFavorite;
        if (prevState.isFavorite !== isFavorite) {
            return {
                isFavorite: isFavorite,
            };
        }
        return null;
    }

    setFavoriteState = (isFavorite) => {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
        });
    };

    onItemClick = () => {
        this.props.onSelect((isFavorite) => {
            this.setFavoriteState(isFavorite);
        });
    };

    onPressFavorite = () => {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
    };

    _favoriteIcon() {
        const { theme } = this.props;
        return (
            <TouchableOpacity style={{ padding: 6 }} activeOpacity={1} onPress={() => this.onPressFavorite()}>
                <FontAwesome name={this.state.isFavorite ? 'star' : 'star-o'} color={theme.themeColor} size={26} />
                <Text>{this.state.isFavorite}</Text>
            </TouchableOpacity>
        );
    }
}
