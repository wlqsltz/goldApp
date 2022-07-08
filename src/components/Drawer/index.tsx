import React from 'react';
import {DrawerLayout, DrawerLayoutProps} from 'react-native-gesture-handler';
import {DrawerProps} from './PropsType';
import {SCREEN_WIDTH} from '@/utils/index';

export interface DrawerNativeProps
  extends Partial<DrawerLayoutProps>,
    DrawerProps {
  drawerRef?: (el: DrawerLayout | null) => void;
  drawerWidth?: number;
  drawerBackgroundColor?: string;
  children?: React.ReactNode;
}

export default class Drawer extends React.Component<DrawerNativeProps, any> {
  static defaultProps = {
    position: 'right',
    open: false,
    drawerWidth: SCREEN_WIDTH - 70,
    drawerBackgroundColor: '#ddd',
  };

  drawer: DrawerLayout | null = null;

  componentDidMount() {
    if (this.props.open && this.drawer) {
      this.drawer.openDrawer();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: DrawerNativeProps) {
    if (nextProps.open !== this.props.open && this.drawer) {
      this.drawer[nextProps.open ? 'openDrawer' : 'closeDrawer']();
    }
  }

  onOpenChange(isOpen: boolean) {
    if (this.props.onOpenChange) {
      this.props.onOpenChange(isOpen);
    }
  }

  render() {
    const {
      sidebar,
      position,
      drawerRef,
      drawerWidth,
      drawerBackgroundColor,
      ...restProps
    } = this.props;
    [
      'onOpenChange',
      'onDrawerOpen',
      'onDrawerClose',
      'drawerPosition',
      'renderNavigationView',
    ].forEach(prop => {
      if (restProps.hasOwnProperty(prop)) {
        delete (restProps as any)[prop];
      }
    });

    return (
      <DrawerLayout
        ref={el => {
          if (typeof drawerRef === 'function') {
            drawerRef(el);
          }
          this.drawer = el;
        }}
        drawerType="slide"
        renderNavigationView={() => sidebar}
        drawerPosition={position}
        onDrawerOpen={() => this.onOpenChange(true)}
        onDrawerClose={() => this.onOpenChange(false)}
        keyboardDismissMode="on-drag"
        drawerWidth={drawerWidth}
        drawerBackgroundColor={drawerBackgroundColor}
        {...restProps}
      />
    );
  }
}
