export const codeSpreadSheet = `import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet";

const SpreadSheetComp = () => {
  const [data, setData] = React.useState(createEmptyMatrix(5, 3));
  return (
    <Spreadsheet 
      data={data}
      onChange={setData}
      darkMode={false}
    />
  );
};

function App() {
  ...
  <SpreadSheetComp />
  ...
}
`;

export const codeChart = `import { 
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';
const data = [
  {name: '1', uv: 400},
  {name: '2', uv: 300},
  {name: '3', uv: 300},
  {name: '4', uv: 200},
  {name: '5', uv: 278},
  {name: '6', uv: 200},
];

function RenderLineChart() {
  return (
    <LineChart width={600} height={300} data={data} 
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
}

function App() {
  ...
  <RenderLineChart />
  ...
}
`;