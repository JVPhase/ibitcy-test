import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Chart from './components/Chart/Chart';
import Button from './components/Button/Button';
import Input from './components/Input/Input';
import Table from './components/Table/Table';
import TableHead from './components/TableHead/TableHead';
import TableHeadRow from './components/TableHeadRow/TableHeadRow';
import TableHeadCell from './components/TableHeadCell/TableHeadCell';
import TableBody from './components/TableBody/TableBody';
import TableBodyRow from './components/TableBodyRow/TableBodyRow';
import TableBodyCell from './components/TableBodyCell/TableBodyCell';
import Dialog from './components/Dialog/Dialog';
import Alert from './components/Alert/Alert';
import './App.css';
import trash from './assets/trash.svg';

function App() {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [newDealValue, setNewDealValue] = useState(0);
  const [newDealDate, setNewDealDate] = useState(Date.now());
  const [data, setData] = useState(
    [
      { id: 0, date: 1652621670000, value: 200 },
      { id: 1, date: 1652621671000, value: 68 },
      { id: 2, date: 1652621673000, value: 69 },
      { id: 3, date: 1652621674000, value: 70 },
      { id: 4, date: 1652621675000, value: 90 },
      { id: 5, date: 1652621676000, value: 34 },
      { id: 6, date: 1652621678000, value: 26 },
      { id: 7, date: 1652621685000, value: 178 },
      { id: 8, date: 1652621694000, value: 223 },
      { id: 9, date: 1652621745000, value: 700 },
      { id: 10, date: 1652621746000, value: 68 },
      { id: 11, date: 1652621747000, value: 49 },
      { id: 12, date: 1652621750000, value: 170 },
      { id: 13, date: 1652621753000, value: 45 },
      { id: 14, date: 1652622167000, value: 200 },
      { id: 15, date: 1652622175000, value: 68 },
      { id: 16, date: 1652622179000, value: 69 },
      { id: 17, date: 1652622184000, value: 70 },
      { id: 18, date: 1652622185000, value: 90 },
      { id: 19, date: 1652622198000, value: 34 },
      { id: 20, date: 1652622200000, value: 26 },
      { id: 21, date: 1652622223000, value: 178 },
      { id: 22, date: 1652622234000, value: 223 },
      { id: 23, date: 1652622245000, value: 200 },
      { id: 24, date: 1652622265000, value: 68 },
      { id: 25, date: 1652622273000, value: 49 },
      { id: 26, date: 1652622276000, value: 170 },
      { id: 27, date: 1652622287000, value: 45 },
    ].reverse()
  );
  useEffect(() => {
    const updateTime = () => {
      setNewDealDate(Date.now());
    };
    const timerId = setInterval(updateTime, 1000);
    return () => {
      clearInterval(timerId);
    };
  });
  const removeItem = (i: number) => {
    console.log(i);
    let arr = [...data];
    arr.splice(i, 1);
    setData(arr);
  };
  const formatTime = (digits: number) => {
    return (digits < 10 ? '0' : '') + digits;
  };
  const getDate = (date: Date | number, noSeconds = false) => {
    const dateString = new Date(date);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${formatTime(dateString.getDate())} ${
      months[dateString.getMonth()]
    } ${dateString.getFullYear()} ${formatTime(
      dateString.getHours()
    )}:${formatTime(dateString.getMinutes())}${
      !noSeconds ? ':' + formatTime(dateString.getSeconds()) : ''
    }`;
  };
  return (
    <div className="App">
      <Header
        onOpenDialog={() => {
          setDialogOpened(true);
        }}
      />
      <Chart unitsPerTickX={20} unitsPerTickY={30} data={data} />
      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell>Value</TableHeadCell>
            <TableHeadCell>Date and time</TableHeadCell>
            <TableHeadCell></TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {data.map((deal, i) => {
            return (
              <TableBodyRow key={deal.id}>
                <TableBodyCell className="bold">{deal.value}</TableBodyCell>
                <TableBodyCell>{getDate(deal.date)}</TableBodyCell>
                <TableBodyCell className="right">
                  <Button className="icon" onClick={() => removeItem(i)}>
                    <img src={trash} className="delete" alt="delete" />
                  </Button>
                </TableBodyCell>
              </TableBodyRow>
            );
          })}
          <TableBodyRow className="nohover">
            <TableBodyCell className="center" colspan={3}>
              <Button className="secondary load">Load next page</Button>
            </TableBodyCell>
          </TableBodyRow>
        </TableBody>
      </Table>
      {dialogOpened ? (
        <Dialog
          title="Make a New Deal"
          onClose={() => setDialogOpened(false)}
          onProceed={() => setDialogOpened(false)}
        >
          <Input
            value={getDate(newDealDate, true)}
            label="Current Date"
            disabled={true}
          />
          <br />
          <Input
            value={newDealValue}
            onChange={(e) =>
              setNewDealValue(+(e.target as HTMLInputElement).value)
            }
            label="Enter value"
            type="number"
          />
        </Dialog>
      ) : (
        ''
      )}
      <Alert />
    </div>
  );
}

export default App;
