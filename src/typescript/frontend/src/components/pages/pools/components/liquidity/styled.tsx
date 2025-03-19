import styled from "styled-components";

export const StyledAddLiquidityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: ${({ theme }) => `1px solid ${theme.colors.darkGray}`};
  border-radius: ${({ theme }) => theme.radii.xSmall};
  margin-bottom: 17px;
  .liquidity-input:nth-child(1) {
    border-bottom: #F0F0DF solid 1px;
    border-bottom-radius: 0;
  }
  .liquidity-input:nth-child(2) {
    border-bottom: #F0F0DF solid 1px;
    border-bottom-radius: 0;
  }
`;


export const StyledAddLiquidityWrapperNew = styled.div`
  border-radius: 1rem !important;
  padding: 1rem !important;
  border: 2px solid white !important;
  width: 100% !important;
  max-width: 320px !important;
  display: flex;
  flex-direction: column;
  border: ${({ theme }) => `1px solid ${theme.colors.darkGray}`};
  border-radius: ${({ theme }) => theme.radii.xSmall};
  margin-bottom: 17px;
  .liquidity-input:nth-child(1) {
    border-bottom: #F0F0DF solid 1px;
    border-bottom-radius: 0;
  }
  .liquidity-input:nth-child(2) {
    border-bottom: #F0F0DF solid 1px;
    border-bottom-radius: 0;
  }
`;
