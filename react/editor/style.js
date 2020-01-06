import styled from "styled-components";
import ReactPlayer from "react-player";

const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 47px);
`;
const EditSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProjectTitleContainer = styled.div`
  height: 85px;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  padding: 0px 24px;
`;

const ProjectTitle = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0.5rem 0.75rem;
  color: rgb(255, 255, 255);
  margin-right: auto;
  background-color: rgba(255, 255, 255, 0.05);
  margin-top: 24px;
`;

const ProjectInput = styled.input`
  width: auto;
  font-weight: 400;
  font-family: inherit;
  font-size: 16px;
  word-spacing: normal;
  text-align: start;
  color: rgb(255, 255, 255);
  background-color: rgba(255, 255, 255, 0.05);
  letter-spacing: 0.014375rem;
  display: inline-block;
  max-width: 200px;
  height: 40px;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  outline: none;
  margin-top: 24px;
  margin-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
  border-radius: 0.1875rem;
  padding: 0.5rem 0.75rem;
`;

export {
  Container,
  EditSection,
  ProjectTitleContainer,
  ProjectTitle,
  ProjectInput
};
