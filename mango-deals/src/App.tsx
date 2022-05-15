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
  const [page, setPage] = useState(0);
  const [all, setAll] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [dialogOpened, setDialogOpened] = useState(false);
  const [newDealValue, setNewDealValue] = useState(0);
  const [newDealDate, setNewDealDate] = useState(Date.now());
  const [data, setData] = useState<{ date: Date; value: number; id: number }[]>(
    []
  );
  useEffect(() => {
    fetchDeals();
    const updateTime = () => {
      setNewDealDate(Date.now());
    };
    const timerId = setInterval(updateTime, 1000);
    return () => {
      clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchDeals = () => {
    fetch(`/deals/${page}`)
      .then((res) => {
        return res.json();
      })
      .then((fetchedData) => {
        setData([...data, ...fetchedData]);
        checkAll(page + 1);
        setPage(page + 1);
      });
  };
  const checkAll = (nextPage: number) => {
    fetch(`/deals/${nextPage}`)
      .then((res) => {
        return res.json();
      })
      .then((fetchedData) => {
        setAll(!fetchedData.length);
      });
  };
  const removeItem = (i: number) => {
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
      {data.length ? (
        <Chart
          unitsPerTickX={20}
          unitsPerTickY={30}
          data={data}
          highlight={highlight}
        />
      ) : (
        ''
      )}
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
              <TableBodyRow
                index={i}
                key={deal.id}
                onHover={(e) => {
                  setHighlight(e);
                }}
              >
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
          {!all ? (
            <TableBodyRow className="nohover transparent">
              <TableBodyCell className="center" colspan={3}>
                <Button className="secondary load" onClick={() => fetchDeals()}>
                  Load next page
                </Button>
              </TableBodyCell>
            </TableBodyRow>
          ) : (
            ''
          )}
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
