import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import Table from '../Table';

function Spaxel({ spaxelTableData }) {
  return spaxelTableData.rows && spaxelTableData.rows.length > 0 ? (
    <Card>
      <CardHeader title="Spaxel" />
      <CardContent>
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
      </CardContent>
    </Card>
  ) : null;
}

Spaxel.propTypes = {
  spaxelTableData: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    ),
    columns: PropTypes.arrayOf(PropTypes.string),
    count: PropTypes.number,
  }).isRequired,
};

export default Spaxel;
