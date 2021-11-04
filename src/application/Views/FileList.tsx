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
  selectedItemChanged: (uuid: string) => void;
}

const FileList: FunctionComponent<FileListProps> = ({ files, selectedItemChanged: selectedKeyChanged }) => {
  const [selectedId, setSelectedId] = useState('');
  const selectionChange = (uuid: string) => {
    setSelectedId(uuid);
    selectedKeyChanged(uuid);
  };

  const item = files.map((fi: FileInfo) => {
    let isSelected = false;
    if (fi.uuid === selectedId) {
      isSelected = true;
    }
    return <FileItem file={fi} key={fi.uuid} selectionChange={selectionChange} isSelected={isSelected} />;
  });
  return <ItemList>{item}</ItemList>;
};

export default FileList;
