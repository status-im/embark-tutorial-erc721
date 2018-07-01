import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import Ship from './ship';

const ShipList = (props) => {
  const { list, title, id, wallet, onBuy } = props;
  return <div id={id}>
    <h3>{title}</h3>
    { list.map((ship, i) => <Ship onBuy={onBuy} wallet={wallet} key={i} {...ship} />) }
    </div>;
}


export default ShipList;