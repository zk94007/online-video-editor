import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 47px);
`;

const EditSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SourcesContainer = styled.div`
  flex: 1;
  padding: 24px;
`;

const UploadContainer = styled.div`
  flex-direction: column;
  padding: 48px;
  cursor: auto;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 150%;
  text-align: center;
  user-select: none;
`;

const Button = styled.button`
  margin-top: 4.4vh;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  border-radius: 100px;
  transition: background-color 0.2s ease-in-out;
  border: 2px solid #665dc3;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0 28px;
  min-width: 140px;
  color: #fff;
  &:hover {
    background-color: rgba(102, 93, 195, 0.25);
  }
`;

const UploadIcon = styled.div`
  height: 50%;
  max-height: 100px;
  margin-bottom: 2vh;
`;

const MediaContainer = styled.div`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  display: flex;
  border: 1px dashed rgba(229, 230, 241, 0.25);
  border-radius: 5px;
  z-index: 1;
  cursor: pointer;
`;

export {
  Container,
  EditSection,
  SourcesContainer,
  UploadContainer,
  Title,
  Button,
  UploadIcon,
  MediaContainer
};
