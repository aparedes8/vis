//////////////////////////////////////////
// Shows how to use InfluxDB query API. //
//////////////////////////////////////////
// |> filter(fn: (r) => r._measurement == ${measurement} or r._measurement == "MeasurementTypes.co2" or r._measurement == "MeasurementTypes.rh")`
import moment from 'moment'
import _ from 'lodash'
import {
    InfluxDB,
    FluxTableMetaData,
    flux,
    fluxDuration,
  } from '@influxdata/influxdb-client'
  
  const url = process.env.INFLUX_URL;
  const token = process.env.TOKEN;
  const org = process.env.ORG;  
  const bucket = process.env.BUCKET;
  const queryApi = new InfluxDB({url, token}).getQueryApi(org)

  
  // const fluxQuery = flux`from(bucket:${bucket}) 
  //   |> range(start: ${start}, stop: ${stop}) 
  //   |> filter(fn: (r) => r._measurement == ${measurement} and r._field == "value")
  //   |> aggregateWindow(every: 2h, fn: mean)
  //   |> drop(columns:["device", "host","table", "_field"])`
  //console.log('query:', fluxQuery)

  function generateQuery(types, dateRange) {
    let dateArray = dateRange.split(',')
    let start = dateArray[0]
    let stop = dateArray[1]
    start = fluxDuration(`-${moment().diff(moment(start), 'days')}d`);
    stop = fluxDuration(`-${moment().diff(moment(stop), 'days')}d`);

    let measurement = ``;
    let typesArray = types.split(",");
    !_.isEmpty(types) ? measurement = typesArray : ''

    

    return flux`from(bucket:${bucket}) 
    |> range(start: ${start}, stop: ${stop}) 
    |> filter(fn: (r) => contains(value: r["_measurement"], set: ${measurement}) and r._field == "value")
    |> aggregateWindow(every: 24h, fn: mean)
    |> drop(columns:["device", "host","table", "_field"])`
    
    
    
    // |> filter(fn: (r) => ${typesArray.map(function(item, r) {
    //   return `r._measurement == ${item} OR`;
    // })}`
    

  }


  export default function handler(req, res) {
    // console.log(req.query)
    // let start = fluxDuration('-30d')
    // let stop = fluxDuration('-29d')
    // let dateArray = req.query.dateRange.split(',')
    // start = dateArray[0]
    // console.log(start)
    // stop = dateArray[1]
    // start = fluxDuration(`-${moment().diff(moment(start), 'days')}d`);
    // stop = fluxDuration(`-${moment().diff(moment(stop), 'days')}d`);
    // console.log(start);
    // console.log(stop);
    
    // start = fluxDuration('-30d')
    // stop = fluxDuration('-29d')
    // let measurement = 'MeasurementTypes.co'
    // let measurement = ``;
    // !_.isEmpty(req.query.types) ? measurement = measurement + req.query.types : ''
    // let fluxQuery = flux`from(bucket:${bucket}) 
    // |> range(start: ${start}, stop: ${stop}) 
    // |> filter(fn: (r) => r._measurement == ${measurement} and r._field == "value")
    // |> aggregateWindow(every: 2h, fn: mean)
    // |> drop(columns:["device", "host","table", "_field"])`
    const fluxQuery = generateQuery(req.query.types, req.query.dateRange);
    console.log('query:', fluxQuery)
    // const result = queryApi.queryRows(fluxQuery, { 
    //     next(row, tableMeta) {
    //       const o = tableMeta.toObject(row)
    //       dayseven.push({time: o._time, measurement: o._measurement, value: o._value});
    //         // custom output for example query
    //         console.log(
    //           `${o._time} ${o._measurement}=${o._value}`
    //         )
            
    //     },
    //     error(error) {
    //       console.log('QUERY FAILED', error)
    //     },
    //     complete() {
    //       console.log('QUERY FINISHED')
    //     },
    //   })
    const result = queryApi.collectRows(fluxQuery);
    result.then(function(data) {
        console.log(data);
        // res.status(200).json(data);
        res.send(data)
        // you can access the result from the promise here
    });
    // res.status(200).json({data:[]});  
  }
  
  
  
  