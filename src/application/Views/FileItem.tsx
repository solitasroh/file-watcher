import React, { FunctionComponent, Key, useState } from 'react';
import styled from 'styled-components';
import { FileInfo } from '../../electron/services/FileWatcherService';

const FileItemContainer = styled.div<{ selected: boolean }>`
  display: flex;
  background-color: ${(props) => (props.selected ? '#f4f4f4' : '#77a0c2c0')};
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
  fi: FileInfo;
};

const FileItem: FunctionComponent<FileItemProps> = ({ fi }) => {
  const [selected, setSelected] = useState(false);

  const itemClicked = () => {
    setSelected(!selected);
  };

  return (
    <FileItemContainer onClick={itemClicked} selected={selected}>
      {!fi.fileIconUrl ? '' : <FileIcon src={fi.fileIconUrl} />}
      <FileText>{fi.fileName}</FileText>
      <FileDate>{fi.mDate}</FileDate>
    </FileItemContainer>
  );
};

export default FileItem;
