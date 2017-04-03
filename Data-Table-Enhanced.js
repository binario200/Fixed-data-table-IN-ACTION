import React from 'react';
const FixedDataTable = require('fixed-data-table-2');
const {Table, Column, Cell} = FixedDataTable;
import FilterPopover from 'components/FilterPopover';
import Measure from 'react-measure';

class OneTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: this.props.columnWidths,
      rowSelected: 0,
    };
  }

  onColumnResizeEndCallback = (newColumnWidth, columnKey) => {
    this.setState(({ columnWidths }) => ({
      columnWidths: {
          ...columnWidths,
          [columnKey]: newColumnWidth
        }
      })
    )
  };

  // OneTable responsability ends with returning the row data after click
  onRowClick = (event,index) => {
    this.setState({
        rowSelected: index
    });

    this.props.onRowClick(event, this.props.data[index]);
  }

  rowClassNameGetter = (rowIndex) => {
    if (rowIndex === this.state.rowSelected) {
      return 'active-row';
    }

  }

  render() {
    const { columnWidths } = this.state;
    const { rowHeight, headerHeight, width,
      height, columnTitles, data, callback, } = this.props;
    const columnOrder = Object.keys(columnTitles);

    let columns = null;

      columns = columnOrder.map((columnKey, i) => {
        return <Column
          width={columnWidths[columnKey]}
          isResizable={true}
          flexGrow={1}
          key={i}
          columnKey={columnKey}
          header={<Cell>
            <FilterPopover
              columnName={columnKey}
              columnDisplayName={columnTitles[columnKey]}
              dataType='alphabetic'
              {...this.props}>
              {columnTitles[columnKey]}
            </FilterPopover>
          </Cell>}
            cell={props => (
              <Cell {...props}>
                {data && data.length ? data[props.rowIndex][columnKey] : null}
              </Cell>
            ) }
          />
      });

      return (
        <Measure onMeasure={(rect) => { this.setState({ parentWidth: rect.width })}}>
          <div style={{width: '100%'}}>
            <Table
              rowHeight={rowHeight}
              headerHeight={headerHeight}
              rowsCount={data.length > 0 ? data.length : 0}
              width={this.state.parentWidth || 600}
              height={height}
              isColumnResizing={false}
              onColumnResizeEndCallback={this.onColumnResizeEndCallback}
              onRowClick={this.onRowClick}
              rowClassNameGetter={this.rowClassNameGetter}
              >
              { columns }
            </Table>

          </div>
        </Measure>
      );

  }
}

module.exports = OneTable

