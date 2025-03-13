"use client";

import styled, { css } from "styled-components";
import { layout, space, BorderProps, LayoutProps, SpaceProps, color } from "styled-system";
import { breakpoints } from "theme/base";

// Create media query helpers
const mobileStyle = (styles: any) => css`
  @media (max-width: ${breakpoints.tablet}px) {
    ${styles}
  }
`;

const tabletStyle = (styles: any) => css`
  @media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.laptop}px) {
    ${styles}
  }
`;

const desktopStyle = (styles: any) => css`
  @media (min-width: ${breakpoints.laptop}px) {
    ${styles}
  }
`;

export const StyledWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: black;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: fixed;
    top: 55%;
    left: 50%;
    width: 85%;
    height: 77%;
    background-image: url('/images/pool/bgPool.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
    opacity: 0.8;
    transform: translate(-50%, -50%) rotate(190deg);
    filter: blur(15px);
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
`;

export const StyledTopNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  position: relative;
  
  ${mobileStyle(`
    padding: 1rem;
  `)}
`;

export const StyledFundMeButton = styled.button`
  display: none;
`;

export const StyledLogoArea = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledMovementLogo = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StyledCoinsText = styled.div`
  display: none;
`;

export const StyledRightNav = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  ${mobileStyle(`
    gap: 1rem;
  `)}
`;

export const StyledStartButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 0.9rem;
  text-transform: uppercase;
  cursor: pointer;
`;

export const StyledConnectWalletNav = styled.button`
  background: transparent;
  border: none;
  color: #47DDBA;
  font-size: 0.9rem;
  text-transform: uppercase;
  cursor: pointer;
`;

export const StyledCounterCircle = styled.div`
  display: none;
`;

export const StyledContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  ${mobileStyle(`
    padding: 0 1rem;
  `)}
`;

export const StyledHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  margin-top: 2rem;

  h1 {
    font-size: 2.5rem;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    font-weight: bold;
    
    ${mobileStyle(`
      font-size: 2rem;
    `)}
  }
`;

export const StyledTabsContainer = styled.div`
  display: flex;
  gap: 2.5rem;
  margin-top: 10px;
  overflow-x: auto;
  justify-content: flex-start;
 
  ${mobileStyle(`
    gap: 1.5rem;
  `)}
  
  /* Hide scrollbar but allow scrolling */
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const StyledPoolTab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  font-weight: 700;
  font-size: 25px;
  padding: 0 0 0.5rem 0;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: 'Sifonn';
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 2px;
  }
  
  &:hover {
    color: white;
  }
  
  ${mobileStyle(`
    font-size: 20px;
  `)}
`;

export const StyledPoolsContainer = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  
  ${mobileStyle(`
    grid-template-columns: 1fr;
    gap: 1rem;
  `)}
  
  ${tabletStyle(`
    grid-template-columns: 280px 1fr;
    gap: 1.2rem;
  `)}
`;

export const StyledAddLiquidityTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  
  h2 {
    font-size: 1rem;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-weight: bold;
    color: white;
    padding: 0.5rem 0;
    margin: 0;
  }
`;

export const StyledAddLiquidityCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 10px;
  position: relative;
  height: fit-content;
  border: 2px solid white;  
  width: 100%;
  max-width: 320px;
  
  ${mobileStyle(`
    max-width: 100%;
    padding: 1.2rem;
  `)}
  
  h2 {
    display: none; /* Hide the heading inside the card since we moved it outside */
  }
  
  .token-icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1rem;
  }
`;

export const StyledPoolsListCard = styled.div`
  background: transparent;
  border-radius: 1rem;
  padding: 0;
  overflow: hidden;
  margin-left: 15px;
  
  ${mobileStyle(`
    margin-left: 0;
    margin-top: 2rem;
  `)}
`;

export const StyledPoolsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 95%;
  margin: 0 auto;
  
  ${mobileStyle(`
    width: 100%;
    overflow-x: visible;
    padding: 0 10px;
  `)}
`;

export const StyledPoolsHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  text-transform: uppercase;
  background-color: rgba(0, 0, 0, 0.2);
  
  ${mobileStyle(`
    grid-template-columns: 2fr 1fr 1fr;
  `)}
`;

export const StyledPoolRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0 1rem 0;
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  
  ${mobileStyle(`
    padding: 1rem 0 0.5rem 0;
  `)}
`;

export const StyledPoolItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  padding: 0;
  
  &:first-child {
    justify-content: flex-start;
    padding-left: 10px;
  }
  
  &:not(:first-child) {
    justify-content: center;
  }
  
  span {
    display: inline-flex;
    align-items: center;
  }
`;

export const StyledPoolMainContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 1rem;
  padding-left: 10px;
  padding-right: 10px;
  min-height: 72px;
  width: 100%;
  
  ${mobileStyle(`
    min-height: 60px;
    flex-wrap: nowrap;
  `)}
  
  .pool-icon {
    width: 65px;
    height: 66px;
    min-width: 65px;
    border-radius: 168px;
    background: transparent;
    margin-right: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    position: relative;
    border: 2px solid white;
    transform: rotate(90deg); /* Rotate the container */
    
    ${mobileStyle(`
      width: 50px;
      height: 50px;
      min-width: 50px;
      margin-right: 15px;
    `)}
    
    img {
      width: 53px;
      height: 53px;
      position: absolute;
      top: 7px;
      left: 6px;
      border-radius: 168px;
      object-fit: cover;
      transform: rotate(-90deg); /* Counter-rotate the image to keep it upright */
      
      ${mobileStyle(`
        width: 40px;
        height: 40px;
        top: 5px;
        left: 5px;
      `)}
    }
  }
  
  .pool-details {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr;
    width: 100%;
    gap: 0.8rem;
    align-items: center;
    height: 100%;
    background: transparent;
    
    ${mobileStyle(`
      grid-template-columns: 2fr 1.5fr 1.5fr;
      gap: 0.5rem;
      width: 100%;
    `)}
    
    .detail-item {
      white-space: nowrap;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    
    .detail-item:first-child {
      text-align: left;
      justify-content: flex-start;
      font-family: 'Sifonn';
      font-size: 15px;
      color: white;
      font-weight: 700;
      text-transform: uppercase;
      
      ${mobileStyle(`
        font-size: 13px;
      `)}
    }
    
    .detail-item:nth-child(2),
    .detail-item:nth-child(3),
    .detail-item:nth-child(4),
    .detail-item:nth-child(5),
    .detail-item:nth-child(6) {
      justify-content: center;
      text-align: center;
      color: white;
      font-family: 'Lora';
      font-size: 12px;
      font-weight: 500;
      
      ${mobileStyle(`
        font-size: 10px;
      `)}
    }
  }
`;

export const StyledPoolSubtext = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 500;
  color: white;
  margin-top: 5px;
  
  ${mobileStyle(`
    flex-wrap: wrap;
    gap: 8px;
  `)}
  
  .fire-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-right: 8px;
  }
  
  .hot-buy {
    padding: 5px 12px;
    width: fit-content;
    border: 1px solid #0FFF7299;
    border-radius: 20px;
    font-size: 9.2px;
    color: #0FFF7299;
    font-weight: 700;
    font-family: 'Lora';
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 10px;
  }
  
  .badge-container {
    display: flex;
    padding: 5px 12px;
    align-items: center;
    border: 1px solid #47DDBA;
    border-radius: 20px;
    gap: 5px;
    background-color: rgba(71, 221, 186, 0.1);
  }
  
  .badge {
    font-size: 8.52px;
    font-family: 'Lora';
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #FFFFFF;
  }
  
  .info-circle {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 2px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 13px;
      height: 13px;
      background-image: url('/images/pool/I.png');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
`;

export const StyledFilterRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr;
  margin-top:10px;
  margin-bottom: 1.5rem;
  align-items: center;
  overflow-x: auto;
  padding: 0.8rem 0rem;
  padding-left: 10%; /* Space for the icon column */
  gap: 0.4rem; /* Match the gap in pool-details grid */
  width: 93%;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  background: transparent;
  height: 44px;
  position: relative;
  
  /* Add blue accent line on the right side */
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 5px;
    height: 100%;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
  }
  
  /* Hide scrollbar but allow scrolling */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  ${mobileStyle(`
    grid-template-columns: 2fr 1.5fr 1.5fr;
    padding: 0.8rem 1rem;
    padding-left: 60px;
    width: 95%;
    gap: 0.5rem;
    font-size: 0.7rem;
    white-space: nowrap;
    height: 40px;
    margin-left: 0;
    margin-right: 0;
  `)}
  
  ${tabletStyle(`
    grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr;
    padding: 0.8rem 1.5rem;
    padding-left: 85px;
    width: 95%;
    gap: 0.7rem;
  `)}
  
  ${desktopStyle(`
    grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1.5fr 1.5fr;
    padding: 0.8rem 2rem;
    padding-left: 100px;
    width: 93%;
    gap: 0.9rem;
  `)}
`;

export const StyledReservesCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  border: 2px solid #FFFFFF;
  width: 100%;
  max-width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  min-height: 100px;
  
  ${mobileStyle(`
    max-width: 100%;
    height: 80px;
    min-height: 80px;
  `)}
  
  &:after {
    content: '';
    position: absolute;
    width: 80%;
    height: 1px;
    background-color: #FFFFFF;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const StyledInputField = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid white;
  border-radius: 0;
  padding: 0.8rem 0;
  color: white;
  font-size: 0.85rem;
  margin: 0.6rem 0;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: white;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .horizontal-line {
      width: 100%;
      height: 1px;
      background-color: white;
    }
  }
`;

export const StyledAddLiquidityButton = styled.button`
  background: white;
  opacity: 0.5;
  border: none;
  color: black;
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  padding: 0.75rem;
  margin-top: 1.5rem;
  border-radius: 7px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  
  ${mobileStyle(`
    font-size: 15px;
    padding: 0.6rem;
  `)}
  
  &:hover {
    background: #f0f0f0;
  }
`;

export const StyledConnectWalletButton = styled.button`
  background: transparent;
  border: none;
  color: #00d4ff;
  font-size: 0.85rem;
  text-align: center;
  cursor: pointer;
  padding: 0.75rem 0;
  margin-top: 1rem;
  position: relative;
  
  &:before {
    content: '[ ';
    margin-right: 0.5rem;
  }
  
  &:after {
    content: ' ]';
    margin-left: 0.5rem;
  }
  
  &:hover {
    color: white;
  }
`;

export const StyledFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  
  ${mobileStyle(`
    padding: 1.5rem 0;
    font-size: 0.7rem;
  `)}
`;

export const StyledMobileMenuToggle = styled.div`
  display: none;
  
  ${mobileStyle(`
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
  `)}
`;