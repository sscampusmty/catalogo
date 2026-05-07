import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Icon from "@/components/icon/Icon";
import Icons from "@/components/icon/Icons";

import { cleanup } from '@testing-library/react';

describe('Icon Component Test', () => {
    it('Should render all icons', () => {
        // Render all icons from icons.json
        const allIconsRendered = Object.keys(Icons).every((icon) => {
            const { container } = render(
                <Icon
                    name={icon}
                    size="12px"
                    color='red'
                />
            );
            return container.firstChild !== null;
        });

        expect(allIconsRendered).toBe(true);

        cleanup();
    });

    it('Should render icons with css, numeric and destructured size', () => {
        // Render an icon with "5vw" size and it should have a width and height of 5vw
        const { container: container1 } = render(
            <Icon
                name={Object.keys(Icons)[0]}
                size="5vw"
                color='red'
            />
        );

        const icon = container1.firstChild;
        
        expect(icon.getAttribute('width')).toBe('5vw');
        expect(icon.getAttribute('width')).toBe('5vw');

        // Render an icon with 10 size and it should have a width and height of 10px
        const { container: container2 } = render(
            <Icon
                name={Object.keys(Icons)[0]}
                size={10}
                color='red'
            />
        );

        const icon2 = container2.firstChild;

        expect(icon2.getAttribute('width')).toBe('10');
        expect(icon2.getAttribute('width')).toBe('10');

        // Render an icon with width of 5vw and height of 10vw
        const { container: container3 } = render(
            <Icon
                name={Object.keys(Icons)[0]}
                size={{ width: "5vw", height: "10vw" }}
                color='red'
            />
        );

        const icon3 = container3.firstChild;

        expect(icon3.getAttribute('width')).toBe('5vw');
        expect(icon3.getAttribute('height')).toBe('10vw');

        // Render an icon with width of 10 and height of 20
        const { container: container4 } = render(
            <Icon
                name={Object.keys(Icons)[0]}
                size={{ width: 10, height: 20 }}
                color='red'
            />
        );

        const icon4 = container4.firstChild;

        expect(icon4.getAttribute('width')).toBe('10');
        expect(icon4.getAttribute('height')).toBe('20');
    })
});