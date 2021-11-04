import React, { FunctionComponent, Key, useState } from 'react';
import styled from 'styled-components';
import { FileInfo } from '../../electron/services/FileWatcherService';

const FileItemContainer = styled.div<{ selected: boolean }>`
  display: flex;
  background-color: ${(props) => (props.selected ? '#b8d4ebc0' : '#f4f4f4')};
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  min-width: 350px;
  height: 55px;
  :hover {
    background-color: #bababac0;
  }
  :active {
    background-color: #686868;
  }
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

const FileIcon = styled.img`
  width: 15px;
  height: 15px;
  align-self: center;
  margin-right: 5px;
`;

type FileItemProps = {
  file: FileInfo;
  selectionChange: (index: number) => void;
  isSelected: boolean;
};

const FileItem: FunctionComponent<FileItemProps> = ({ file, selectionChange, isSelected }) => {
  const itemClicked = () => {
    selectionChange(file.key);
  };

  return (
    <FileItemContainer onClick={itemClicked} selected={isSelected}>
      {!file.fileIconUrl ? '' : <FileIcon src={file.fileIconUrl} />}
      <FileText>{file.fileName}</FileText>
      <FileDate>{file.mDate}</FileDate>
    </FileItemContainer>
  );
};

export default FileItem;
