import React from 'react';
import styles from './styles';
import Table from '../Table';

function Spaxel({ spaxelTableData }) {
  const classes = styles();

  return (
    <>
      {spaxelTableData.rows && spaxelTableData.rows.length > 0 ? (
        <div className={classes.animateEnter}>
          <Table
            columns={spaxelTableData.columns.map((column) => ({ name: column, title: column, width: 320 }))}
            data={
                  spaxelTableData.rows.map((row) => ({
                    [spaxelTableData.columns[0]]: row[0],
                    [spaxelTableData.columns[1]]: row[1],
                    [spaxelTableData.columns[2]]: row[2],
                    [spaxelTableData.columns[3]]: row[3],
                  }))
                }
            hasPagination={false}
            totalCount={spaxelTableData.count}
            remote={false}
            hasColumnVisibility={false}
            isVirtualTable
          />
        </div>
      )
        : null}
    </>
  );
}

export default Spaxel;
