import React from 'react';
import Header from './components/Header/Header';
import Chart from './components/Chart/Chart';
import Table from './components/Table/Table';
import Modal from './components/Modal/Modal';
import Alert from './components/Alert/Alert';
import './App.css';

function App() {
  const data = [
    { x: 0, y: 200 },
    { x: 34, y: 68 },
    { x: 56, y: 69 },
    { x: 67, y: 70 },
    { x: 90, y: 90 },
    { x: 123, y: 34 },
    { x: 134, y: 26 },
    { x: 156, y: 178 },
    { x: 276, y: 223 },
    { x: 389, y: 200 },
    { x: 445, y: 68 },
    { x: 476, y: 49 },
    { x: 589, y: 170 },
    { x: 645, y: 45 },
    { x: 700, y: 200 },
    { x: 734, y: 68 },
    { x: 756, y: 69 },
    { x: 867, y: 70 },
    { x: 890, y: 90 },
    { x: 1123, y: 34 },
    { x: 1134, y: 26 },
    { x: 1156, y: 178 },
    { x: 1276, y: 223 },
    { x: 1389, y: 200 },
    { x: 1445, y: 68 },
    { x: 1476, y: 49 },
    { x: 1589, y: 170 },
    { x: 1645, y: 45 },
  ];
  return (
    <div className="App">
      <Header />
      <Chart unitsPerTickX={20} unitsPerTickY={30} data={data} />
      <Table />
      <Modal />
      <Alert />
    </div>
  );
}

export default App;
