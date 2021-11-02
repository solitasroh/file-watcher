import React, { useState, useEffect, FunctionComponent } from 'react';

import styled from 'styled-components';
import IpcService from '../../electron/services/ipc-service';
import { FileInfo } from '../../electron/services/FileWatcherService';
import { GET_FILE_LISTS } from '../ipc-channel.app';
import usePolling from '../hooks/usePolling';

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
  height: 500px;
  overflow: auto;
  padding-right: 5px;
  flex: 1;
  scrollbar-width: thin;
  ::-webkit-scrollbar{
    width: 15px;
    height: 20px;
    scrollbar-color: #d4aa70 #e4e4e4;
    background-color: transparent;
    
  }
  ::-webkit-scrollbar-thumb {
    background-color: #c2bdbd;
    border-radius: 10px;
    background-clip: padding-box;
    border: 3px solid transparent;
  }
  ::-webkit-scrollbar-track{
    background-color: #e4e4e4;
    border-radius: 3px;
  }
`;

// const ButtonConatiner = styled.div`
//   display: flex;
//   justify-content: space-between;
//   padding: 10px;
// `;

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
  margin-bottom: 10px;
  min-width: 350px;
  height: 55px;
  :hover {
    background-color: #77a0c2c0;
  }
  :active {
    background-color: #f1f1f1;
  }
`;


// const StartButton = styled.button`
//   background: #06e05d;
//   border-radius: 4px;
//   border: 0px;
//   width: 173px;
//   height: 36px;
//   font-family: "Roboto";
//   font-style: normal;
//   font-weight: bold;
//   font-size: 16px;
//   text-align: center;
//   color: white;
//   :hover {
//     background-color: #06e05dcb;
//   }
//   :active {
//     background-color: #06e05d62;
//   }
// `;

// const StopButton = styled.button`
//   background: #f93434;
//   border-radius: 4px;
//   border: 0px;
//   width: 173px;
//   height: 36px;
//   font-family: Roboto;
//   font-style: normal;
//   font-weight: bold;
//   font-size: 16px;
//   text-align: center;
//   color: white;
//   :hover {
//     background-color: #f93434cb;
//   }
//   :active {
//     background-color: #f9343462;
//   }
// `;

const FileWatcher: FunctionComponent = () => {
  const [files, setfiles] = useState<Array<FileInfo>>([]);
  const ipc = IpcService.getInstance();

  useEffect(() => {
    ipc.send<{ filePaths: [] }>(GET_FILE_LISTS).then((result) => {
      setfiles(result.filePaths);
    });
  }, []);

  usePolling(GET_FILE_LISTS, (event, rest) => {
    const { files: fileLists } = rest;
    // new Notification("file is updated", {
    //    title : 'File Updated',
    //    body: `${updateFile} is updated`,
    //    icon: './src/assets/icons/win/icon.ico'
    // }).onclick = () => {
    //   document.getElementById("output").innerText = "CLICK_MESSAGE";
    // }
    setfiles(fileLists);
  });

  const openDialog = async () => {
    const result = await ipc.send<{ filePaths: [] }>('file-open');
    setfiles(result.filePaths);
  };
  const fileSelect = () => {
    console.log('item clicked');
  }
  return (
    <Container>
      <Header>
        <HeaderTextArea>
          <Label>File</Label>
          <SmallLabel>Insert the file for which you detect changes</SmallLabel>
        </HeaderTextArea>
        <AddFileButton onClick={openDialog}>+</AddFileButton>
      </Header>

      <ItemList>
        {files.map((f: FileInfo) => (
          <FileItemContainer>
            {!f.fileIconUrl ? '' : <img alt="test" src={f.fileIconUrl} width={32} height={32} />}

            <FileText>{f.fileName}</FileText>
            <FileDate>{f.mDate}</FileDate>
          </FileItemContainer>
        ))}
      </ItemList>
    </Container>
  );
};

export default FileWatcher;
