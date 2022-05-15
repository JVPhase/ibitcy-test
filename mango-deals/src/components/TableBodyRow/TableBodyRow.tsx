import React from 'react';
import './TableBodyRow.css';

type TableBodyRowProps = {
  children?: React.ReactNode;
  className?: string;
};

function TableBodyRow(props: TableBodyRowProps) {
  const { children, className = '' } = props;
  return <tr className={'TableBodyRow ' + className}>{children}</tr>;
}

export default TableBodyRow;
