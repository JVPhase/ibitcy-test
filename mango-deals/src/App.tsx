import React from 'react';
import Header from './components/Header/Header';
import Chart from './components/Chart/Chart';
import Table from './components/Table/Table';
import Modal from './components/Modal/Modal';
import Alert from './components/Alert/Alert';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Chart
        minX={0}
        minY={0}
        maxX={1000}
        maxY={100}
        unitsPerTickX={20}
        unitsPerTickY={10}
      />
      <Table />
      <Modal />
      <Alert />
    </div>
  );
}

export default App;
