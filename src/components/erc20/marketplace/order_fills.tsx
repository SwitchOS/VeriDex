import React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import styled from 'styled-components';

import { changeMarket, goToHome } from '../../../store/actions';
import { getBaseToken, getFills, getQuoteToken, getWeb3State } from '../../../store/selectors';
import { getCurrencyPairByTokensSymbol } from '../../../util/known_currency_pairs';
import { isWeth } from '../../../util/known_tokens';
import { tokenAmountInUnits } from '../../../util/tokens';
import { CurrencyPair, Fill, OrderSide, StoreState, Token, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';

const DexTradesList = styled(Card)`
    max-height: 220px;
    overflow: auto;
`;

interface StateProps {
    baseToken: Token | null;
    quoteToken: Token | null;
    web3State?: Web3State;
    fills: Fill[];
}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
}

type Props = StateProps & DispatchProps;

const SideTD = styled(CustomTD)<{ side: OrderSide }>`
    color: ${props =>
        props.side === OrderSide.Buy ? props.theme.componentsTheme.green : props.theme.componentsTheme.red};
`;
export const ClicableTD = styled(CustomTD)`
    cursor: pointer;
`;

const fillToRow = (fill: Fill, index: number, _setMarket: any) => {
    const sideLabel = fill.side === OrderSide.Sell ? 'Sell' : 'Buy';
    const amountBase = tokenAmountInUnits(fill.amountBase, fill.tokenBase.decimals, fill.tokenBase.displayDecimals);
    const displayAmountBase = `${amountBase} ${fill.tokenBase.symbol.toUpperCase()}`;
    const amountQuote = tokenAmountInUnits(fill.amountQuote, fill.tokenQuote.decimals, fill.tokenQuote.displayDecimals);
    const tokenQuoteSymbol = isWeth(fill.tokenQuote.symbol) ? 'ETH' : fill.tokenQuote.symbol.toUpperCase();
    const displayAmountQuote = `${amountQuote} ${tokenQuoteSymbol}`;
    const market = `${fill.tokenBase.symbol.toUpperCase()}/${tokenQuoteSymbol}`;

    const currencyPair: CurrencyPair = getCurrencyPairByTokensSymbol(fill.tokenBase.symbol, fill.tokenQuote.symbol);

    const price = parseFloat(fill.price.toString()).toFixed(currencyPair.config.pricePrecision);

    const setMarket = () => _setMarket(currencyPair);
    return (
        <TR key={index}>
            <SideTD side={fill.side}>{sideLabel}</SideTD>
            <ClicableTD styles={{ textAlign: 'right', tabular: true }} onClick={setMarket}>
                {market}
            </ClicableTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{price}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{displayAmountBase}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>{displayAmountQuote}</CustomTD>
            <CustomTD styles={{ textAlign: 'right', tabular: true }}>
                <TimeAgo date={fill.timestamp} />;
            </CustomTD>
        </TR>
    );
};

class OrderFills extends React.Component<Props> {
    public render = () => {
        const { fills, baseToken, quoteToken, web3State } = this.props;
        let content: React.ReactNode;
        switch (web3State) {
            case Web3State.Locked:
            case Web3State.NotInstalled: {
                content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
                break;
            }
            case Web3State.Loading: {
                content = <LoadingWrapper minHeight="120px" />;
                break;
            }
            default: {
                if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
                    content = <LoadingWrapper minHeight="120px" />;
                } else if (!fills.length || !baseToken || !quoteToken) {
                    content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
                } else {
                    const _setMarket: any = (currencyPair: CurrencyPair) => {
                        this.props.changeMarket(currencyPair);
                        this.props.goToHome();
                    };

                    content = (
                        <Table isResponsive={true}>
                            <THead>
                                <TR>
                                    <TH>Side</TH>
                                    <TH styles={{ textAlign: 'right' }}>Market</TH>
                                    <TH styles={{ textAlign: 'right' }}>Price</TH>
                                    <TH styles={{ textAlign: 'right' }}>Base</TH>
                                    <TH styles={{ textAlign: 'right' }}>Quote</TH>
                                    <TH styles={{ textAlign: 'right' }}>Age</TH>
                                </TR>
                            </THead>
                            <tbody>{fills.map((fill, index) => fillToRow(fill, index, _setMarket))}</tbody>
                        </Table>
                    );
                }
                break;
            }
        }

        return <DexTradesList title="Last DEX Trades">{content}</DexTradesList>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        fills: getFills(state),
    };
};
const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
        goToHome: () => dispatch(goToHome()),
    };
};

const OrderFillsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(OrderFills);

export { OrderFills, OrderFillsContainer };
