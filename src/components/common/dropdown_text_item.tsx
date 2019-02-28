import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeColors, themeDimensions } from '../../util/theme';

interface Props extends HTMLAttributes<HTMLDivElement> {
    active?: boolean;
    onClick?: any;
    text: string;
}

const DropdownTextItemWrapper = styled.div<{ active?: boolean }>`
    background-color: ${props => (props.active ? themeColors.rowActive : '#fff')};
    border-bottom: 1px solid ${themeColors.borderColor};
    color: #000;
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.3;

    padding: 12px ${themeDimensions.horizontalPadding};

    &:hover {
        background-color: ${themeColors.rowActive};
    }

    &:last-child {
        border-bottom: none;
    }
`;

export const DropdownTextItem: React.FC<Props> = props => {
    const { text, onClick, ...restProps } = props;

    return (
        <DropdownTextItemWrapper onClick={onClick} {...restProps}>
            {text}
        </DropdownTextItemWrapper>
    );
};
