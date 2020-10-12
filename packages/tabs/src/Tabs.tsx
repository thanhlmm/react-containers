/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useState, useRef, useContext, HTMLAttributes } from 'react';
import { ThemeContext } from 'styled-components';
import { useTabs } from './index';
import { useCombinedRefs, getControlledValue } from '@zendeskgarden/container-utilities';

const TabsContext = React.createContext<any>(undefined);

const useTabsContext = () => {
  return useContext(TabsContext);
};

export const Tab = React.forwardRef<HTMLDivElement, any>(({ item, ...otherProps }, ref) => {
  const tabsPropGetters = useTabsContext();
  const focusRef = useCombinedRefs(ref);

  if (!tabsPropGetters) return null;

  const tabProps = tabsPropGetters.getTabProps({
    item,
    focusRef,
    index: tabsPropGetters.tabIndexRef.current++,
    isSelected: item === tabsPropGetters.selectedItem,
    ...otherProps
  });

  const { isSelected, ...restTabProps } = tabProps;

  return (
    <div
      {...restTabProps}
      style={{
        backgroundColor: isSelected ? 'aliceblue' : '',
        textDecoration: isSelected ? 'underline' : ''
      }}
    />
  );
});

export const TabList = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const tabsPropGetters = useTabsContext();

    if (!tabsPropGetters) {
      return <div ref={ref} {...props} />;
    }

    return <div {...(tabsPropGetters.getTabListProps({ ref, ...props }) as any)} />;
  }
);

export const TabPanel = React.forwardRef<HTMLDivElement, any>(({ item, ...otherProps }, ref) => {
  const tabsPropGetters = useTabsContext();

  if (!tabsPropGetters) {
    return <div ref={ref} {...otherProps} />;
  }

  return (
    <div
      {...tabsPropGetters.getTabPanelProps({
        item,
        ref,
        index: tabsPropGetters.tabPanelIndexRef.current++,
        'aria-hidden': tabsPropGetters.selectedItem !== item,
        ...otherProps
      })}
    />
  );
});

export const Tabs: React.FC<any> = ({
  isVertical,
  children,
  onChange,
  selectedItem: controlledSelectedItem
}) => {
  const theme = useContext(ThemeContext);
  const [internalSelectedItem, setSelectedItem] = useState();
  const tabIndexRef = useRef<number>(0);
  const tabPanelIndexRef = useRef<number>(0);
  const selectedItem = getControlledValue(controlledSelectedItem, internalSelectedItem);

  const tabPropGetters = useTabs({
    rtl: theme!.rtl,
    vertical: isVertical,
    selectedItem,
    defaultSelectedIndex: 0,
    onSelect: item => {
      if (onChange) {
        onChange(item); // this gets called during a render....
      } else {
        setSelectedItem(item);
      }
    }
  });

  const tabsContextValue = { ...tabPropGetters, tabIndexRef, tabPanelIndexRef };

  return <TabsContext.Provider value={tabsContextValue}>{children}</TabsContext.Provider>;
};
