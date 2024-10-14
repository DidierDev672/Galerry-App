import React from 'react';
import styled from 'styled-components';

interface HexagonProps {
    image: string;
    title: string;
}


const HoneycombGrid: React.FC<{ items: HexagonProps[] }> = ({ items }) => {
    return (
        <HoneycombWrapper>
            {items.map((item, index) => (
                <HexagonItem key={index}>
                    <HexagonContent>
                        <img src={item.image} alt={item.title} />
                        <HexagonOverlay>
                            <h3>{ item.title}</h3>
                        </HexagonOverlay>
                    </HexagonContent>
                </HexagonItem>
            )) }
        </HoneycombWrapper>
    );
}

const HoneycombWrapper = styled.ul`
display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  margin: 0;
  padding: 0;
  transform: translateY(25px);
  &::after {
    content: "";
    display: block;
    clear: both;
  }
`;

const HexagonItem = styled.li`
    width: 200px;
  height: 230px;
  margin: 0 10px 30px;
  position: relative;
  &:nth-child(5n+4) {
    margin-left: 110px;
  }
  &:nth-child(5n+3) {
    margin-right: 110px;
  }
`;

const HexagonContent = styled.div`
     position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform: skew(-30deg) rotate(60deg) scale(0.866);
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 115%;
    height: auto;
    transform: translate(-50%, -50%) rotate(-60deg) skew(30deg) scale(1.15);
    transition: all 0.3s ease;
  }
`;

const HexagonOverlay = styled.div`
    position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  h3 {
    color: white;
    text-align: center;
    transform: rotate(-60deg) skew(30deg) scale(1.15);
  }
  &:hover {
    opacity: 1;
  }
`;

export default HoneycombGrid;
