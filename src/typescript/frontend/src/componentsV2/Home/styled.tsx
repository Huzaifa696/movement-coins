import styled from "styled-components";

export const TabSection = styled.div`
  margin-top: 100px;
  width: 100%;
  padding: 0 2.5rem;

  @media (min-width: 768px) {
    width: 61%; // md:w-8/12
  }

  @media (min-width: 1024px) {
    width: 60%; // lg:w-8/12
  }

  @media (max-width: 640px) {
    display: none; // sm-none
  }
`;

export const TabMetricsSection = styled(TabSection)`
  @media (min-width: 768px) {
    width: 40%; // md:w-4/12
  }

  @media (min-width: 1024px) {
    width: 40%; // lg:w-4/12
  }
`;

export const TabGroup = styled.div`
  padding: 0 1.7rem;
  animation: fadeInUp;
  animation-delay: 0.1s;
`;

export const TabFlex = styled.div`
  display: flex;
`;

export const TabText = styled.p<{ isActive?: boolean }>`
font-family: Lora;
font-weight: 700;
font-size: 15px;
line-height: 19.2px;
letter-spacing: 0%;
  margin-right: 4rem;
  color: white;
  opacity: ${(props) => (props.isActive ? 1 : 0.5)};

  @media (max-width: 640px) {
    text-align: center;
  }
`;

// Hero Section
export const StatsText = styled.p`
  color: white;
  font-family: Lora !important;
  font-weight: 400 !important;
  font-size: 20px !important;
  line-height: 36px !important;
  letter-spacing: 0% !important;
  text-transform: uppercase;
  span {
    font-weight: 700 !important;
  }

  @media (max-width: 640px) {
    text-align: center;
  }
`;
