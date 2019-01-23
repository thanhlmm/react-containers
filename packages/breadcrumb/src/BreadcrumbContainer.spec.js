/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React from 'react';
import { mount } from 'enzyme';

import BreadcrumbContainer from './BreadcrumbContainer';

describe('BreadcrumbContainer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <BreadcrumbContainer>
        {({ getContainerProps, getCurrentPageProps }) => (
          <div {...getContainerProps({ 'data-test-id': 'container' })}>
            <a {...getCurrentPageProps({ 'data-test-id': 'anchor' })}>Test</a>
          </div>
        )}
      </BreadcrumbContainer>
    );
  });

  const findContainer = enzymeWrapper => enzymeWrapper.find('[data-test-id="container"]');
  const findAnchor = enzymeWrapper => enzymeWrapper.find('[data-test-id="anchor"]');

  describe('getContainerProps()', () => {
    it('applies correct accessibility attributes', () => {
      const container = findContainer(wrapper);

      expect(container).toHaveProp('role', 'navigation');
      expect(container).toHaveProp('aria-label', 'Breadcrumb navigation');
    });
  });

  describe('getCurrentPageProps()', () => {
    it('applies correct accessibility attributes', () => {
      const anchor = findAnchor(wrapper);

      expect(anchor).toHaveProp('aria-current', 'page');
    });
  });
});
