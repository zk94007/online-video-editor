import styled from "styled-components";

export const VideoDetailModalContainer = styled.div`
  display: flex;
  position: relative;
  align-items: flex-start;
  max-height: 688px;
  max-width: 100%;
  z-index: 2;
  background: #1c1c26;
  padding: 28px 36px;
  outline: 0;
`;

export const VideoDetailModalButton = styled.button`
  position: absolute;
  box-sizing: content-box;
  top: 16px;
  right: 10px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 0.875rem;
  line-height: 40px;
  font-weight: 400;
  color: #e5e6f1;
  opacity: 0.49;
  background: 0 0;
  transition: opacity 0.2s ease-in-out;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 0;
  margin: 0;
  &:hover {
    opacity: 1;
    background: transparent;
  }
`;

export const VideoDetailModalLeft = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const VideoDetailModalRight = styled.div`
  flex-shrink: 0;
  margin-left: 15px;
  padding-top: 56px;
  flex:1;
`;

export const VideoDetailModalTitle = styled.h1`
  padding: 12px 0 20px;
  font-size: 1.3rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

export const VideoDetailModalContent = styled.div`
  z-index: 1;
  height: 100%;
  padding-right: 20px;
`;

export const VideoDetailModalCategory = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  h4 {
    font-size: 1rem;
    width: 100%;
    color: rgba(229, 230, 241, 0.8);
    margin: 0;
  }
`;

export const VideoDetailModalKeyword = styled.div`
  padding-bottom: 20px;
  max-width: 250px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  h4 {
    font-size: 1rem;
    width: 100%;
    color: rgba(229, 230, 241, 0.8);
    margin: 0;
  }
`;

export const VideoDetailModalDetails = styled.div`
  padding: 0 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
  height: 100%;
  h4 {
    font-size: 1rem;
    color: rgba(229, 230, 241, 0.8);
    margin: 0;
  }
`;

export const VideoDetailModalTags = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  width: auto;
  margin-top: 10px;
  text-transform: lowercase;
  padding: 8px 10px;
  border-radius: 19px;
  opacity: 1;
  color: #fff;
  background: rgba(74, 74, 82, 0.4);
  letter-spacing: 0.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  cursor: pointer;
  text-decoration: none;
`;

export const VideoDetailModalTable = styled.table`
  border: 0;
  color: #e5e6f1;
  font-size: 0.875rem;
  font-weight: 300;
  text-align: left;
  table-layout: unset;
  background: none;
  tr:nth-child(even) {
    background: none;
  }
  th {
    color: rgba(229, 230, 241, 0.5);
    padding-right: 47px;
    text-transform: capitalize;
    width: auto;
  }
`;
