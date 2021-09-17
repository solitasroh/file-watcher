import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  display: flex;
  padding: 20px 10px;
  flex-direction: column;
  align-content: stretch;
  justify-content: stretch;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  flex: 1;
`;

const ButtonConatiner = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const HeaderTextArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
`;
const SmallLabel = styled.label`
  font-size: 12px;
  color: #bbb1b1;
`;
const AddFileButton = styled.button`
  width: 15px;
  height: 15px;
  padding: 0px;
  border: 0px;
  color: white;
  font-size: 13px;
  margin-right: 10px;
  :hover {
    background-color: gray;
  }
  :active {
    background-color: #373737;
  }
`;

const FileItemContainer = styled.div`
  display: flex;
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  height: 55px;
`;
const FileText = styled.label`
  flex: 1;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  align-self: center;
`;

const FileDate = styled.label`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  color: #0bb007;
  align-self: flex-end;
`;

const StartButton = styled.button`
  background: #06e05d;
  border-radius: 4px;
  border: 0px;
  width: 173px;
  height: 36px;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  color: white;
  :hover {
    background-color: #06e05dcb;
  }
  :active {
    background-color: #06e05d62;
  }
`;

const StopButton = styled.button`
  background: #f93434;
  border-radius: 4px;
  border: 0px;
  width: 173px;
  height: 36px;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  color: white;
  :hover {
    background-color: #f93434cb;
  }
  :active {
    background-color: #f9343462;
  }
`;

const FileWatcher: React.FC = () => {
  return (
    <Container>
      <Header>
        <HeaderTextArea>
          <Label>File</Label>
          <SmallLabel>Insert the file for which you detect changes</SmallLabel>
        </HeaderTextArea>
        <AddFileButton>+</AddFileButton>
      </Header>

      <ItemList>
        <FileItemContainer>
          <FileText>A2750LM.hex</FileText>
          <FileDate>2021.10.15 10:25:12 AM</FileDate>
        </FileItemContainer>
      </ItemList>

      <ButtonConatiner>
        <StartButton>START SERVER</StartButton>
        <StopButton>STOP SERVER</StopButton>
      </ButtonConatiner>
    </Container>
  );
};

export default FileWatcher;
