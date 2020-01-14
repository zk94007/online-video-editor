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

const ProjectTitle = styled.div`
  display: inline-block;
  align-items: center;
  padding: 0.5rem 0.75rem;
  color: rgb(255, 255, 255);
  margin-right: auto;
  background-color: rgba(255, 255, 255, 0.05);
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
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  outline: none;
  margin: 0;
  border-radius: 0.1875rem;
  padding: 0.5rem 0.75rem;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export { Container, EditSection, ProjectTitle, ProjectInput, TimelineHeader };
