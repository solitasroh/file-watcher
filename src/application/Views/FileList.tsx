import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { FileInfo } from '../../electron/services/FileWatcherService';
import FileItem from './FileItem';

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  height: 500px;
  overflow: auto;
  padding-right: 5px;
  flex: 1;
  scrollbar-width: thin;
  ::-webkit-scrollbar {
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
  ::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 3px;
  }
`;
interface FileListProps {
  files: Array<FileInfo>;
}

const FileList: FunctionComponent<FileListProps> = ({ files }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const selectionChange = (index: number) => {
    setSelectedIndex(index);
  };

  const item = files.map((fi: FileInfo) => {
    let isSelected = false;
    if (fi.key === selectedIndex) {
      isSelected = true;
    }
    return <FileItem file={fi} key={fi.key} selectionChange={selectionChange} isSelected={isSelected} />;
  });
  return <ItemList>{item}</ItemList>;
};

export default FileList;
