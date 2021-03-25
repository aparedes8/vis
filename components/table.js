import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import 'rsuite-table/lib/less/index.less'; 
import moment from 'moment';

const TimeCell = ({ rowData, dataKey, ...props}) => {
  return (<Cell {...props}>{moment(rowData[dataKey]).format('MMMM Do YYYY, h:mm:ss a')}</Cell>)
}
  
const VirtualizationTable = (props) => {
    return (
        <Table data={props.data} height = {400}>
        <Column width={300} sort fixed resizable>
          <HeaderCell>Time Stamp</HeaderCell>
          <TimeCell dataKey="_time" />
        </Column>
    
        <Column width={200} sort resizable>
          <HeaderCell>Value</HeaderCell>
          <Cell dataKey="_value" />
        </Column>
    
        <Column width={200} sort resizable>
          <HeaderCell>Measurement</HeaderCell>
          <Cell dataKey="_measurement" />
        </Column>

        <Column width={300} sort resizable>
          <HeaderCell>Start Range</HeaderCell>
          <TimeCell dataKey= "_start" />
        </Column>

        <Column width={300} sort resizable>
          <HeaderCell>Stop Range</HeaderCell>
          <TimeCell dataKey="_stop" />
        </Column>
      </Table>
    );
  };
  export default VirtualizationTable;