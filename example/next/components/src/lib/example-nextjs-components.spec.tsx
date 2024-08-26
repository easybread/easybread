import { render } from '@testing-library/react';

import ExampleNextjsComponents from './example-nextjs-components';

describe('ExampleNextjsComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ExampleNextjsComponents />);
    expect(baseElement).toBeTruthy();
  });
});
