import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Head from 'next/head';
import _ from 'lodash'
import VirtualizationTable from '../components/table'
import LineChart from "@rsuite/charts/lib/charts/LineChart";
import 'rsuite/lib/styles/index.less';
import { DateRangePicker, MultiCascader, Button} from 'rsuite';
import moment from 'moment'

const measurementData = [{
  "value": ["MeasurementTypes.co", "MeasurementTypes.co2"],
  "label": "Carbon Dioxide",
  "children": [{
    "value": "MeasurementTypes.co",
    "label": "co",
  },
  {
    "value": "MeasurementTypes.co2",
    "label": "co2",
  }]
}, {
  "value": "MeasurementTypes.rh",
  "label": "Relative Humidity",
}, {
  "value": "MeasurementTypes.pm1,MeasurementTypes.pm10,MeasurementTypes.pm25",
  "label": "Particles",
  "children": [{
    "value": "MeasurementTypes.pm1",
    "label": "pm1",
  },
  {
    "value": "MeasurementTypes.pm10",
    "label": "pm10",
  }, 
  {
    "value": "MeasurementTypes.pm25",
    "label": "pm25",
  }]
}]

const fetcher = (url) => fetch(url).then((res) => res.json())
// const fetcher = async (url) => {
//   const res = await fetch(url)
//   const data = await res.json()

//   if (res.status !== 200) {
//     throw new Error(data.message)
//   }
//   return data
// }

export default function Influx() {
  const refresh = async(e) => {
    const response = await fetch(`/api/influx?dateRange=${dateRange}&types=${types}`)
    const obj = await response.json()
    console.log(obj)
  }
  const handleMeasurementChange = (value) => {
    setTypes(value)
  }
  const handleDateChange = value => {
    setDateRange(value)
  }

  const { query } = useRouter()
  const [dateRange, setDateRange] = useState([moment().subtract(1, "days").toDate(), moment().toDate()]);
  const [types, setTypes] = useState(["MeasurementTypes.rh"])
  //const [data, setData] = useState(undefined)
  // useEffect(() => {
  //   refresh()
  // }, [types, dateRange])
  const { data, error } = useSWR( `/api/influx?dateRange=${dateRange}&types=${types}`,
    fetcher
  )
  // const datachart = [
  //   ['00:00', 5],
  // ['01:00', 10],
  // ];
 
  

  const charts = types.map(function(item) {
    const typeData = _.filter(data, {_measurement: item})
    const dataChart = _.map(typeData, function chart(item) {
      return [item._time, item._value]
    })
    return <LineChart name={item} data={dataChart}/>
  })

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>
  console.log(data)
  return (
    <div>
    <Head>
      <title>Home</title>
    </Head>

    <div className="hero">
      <h1 className="title">Air Sensor Data</h1>
      <DateRangePicker
        size="sm"
        showOneCalendar={true}
        value={dateRange}
        style={{width: 260, display: 'block', marginTop: 20, marginBottom: 20 }}
        onChange={handleDateChange}
        //onOk = {refresh}
        >
      </DateRangePicker>
      <MultiCascader
      toggleComponentClass={Button}
      size="sm"
      placeholder="Measurement Type"
      data={measurementData}
      value = {types}

      defaultValue = {["MeasurementTypes.rh"]}
      style= {{ width: 224, display: 'block', marginBottom: 10 }}
      onChange={handleMeasurementChange}
      />
      <VirtualizationTable className="table" data = {data}>

      </VirtualizationTable>
      
      {charts}

    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
        padding: 10px;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 10px;
        line-height: 1.15;
        font-size: 48px;
      }
      .table {
        width: 100%;
        height: 100%;
      }
    `}</style>
  </div>
  )
}
