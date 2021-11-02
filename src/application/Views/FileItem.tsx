import React, { useState, useEffect, FunctionComponent } from 'react';

import styled from 'styled-components';


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

export default FileItem;