import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Unstable_Grid2";
import { DayCalendarProps } from '@mui/x-date-pickers/internals';



interface ICalendarProps {
  item_id: string;
}

interface Appointment {
  id: string;
  item_id: string;
  date: string;
  time: string;
  booked: boolean;
}

function Calendar(props :ICalendarProps) {

  const requestAbortController = React.useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [availableDays, setAvailableDays] = React.useState<number[]>([]);
  const [unavailableDays, setUnavailableDays] = React.useState<string[]>([]);
  const [chosenTime, setChosenTime] = React.useState<string>("");
  const [reserveMessage, setReserveMessage] = React.useState<JSX.Element | undefined>();  const [presentMonth, setPresentMonth] = React.useState<string>();
  const [presentYear, setPresentYear] = React.useState<string>();
  const [currentDate, setCurrentDate] = React.useState<Date>();
  const [data, setData] = React.useState<Appointment[]>([]);


  const current = (() => {
    const date = new Date();

    let month: string = (date.getMonth() + 1).toString();
    let today: string = date.getDate().toString();

    if (parseInt(month) < 10){
      month = "0" + month
    }

    if (parseInt(today) < 10){
      today = "0" + today
    }

    let currentDate = date.toJSON();

    return date.getFullYear() + "-" + month + "-" + today;
  });

  function ServerDay(props: { [x: string]: any; outsideCurrentMonth: any; day: any; availableDays?: any; }) {
    const { availableDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth && availableDays.indexOf(props.day.date()) > 0;
    
    const dayNum = props.day['$d'].toString().slice(8, 10)
    let monthNum = (props.day['$M'] + 1).toString()
    if (monthNum.length === 1){
      monthNum = "0" + monthNum
    }

    const dateNow = props.day['$y'] + '-' + monthNum + '-' + dayNum
  
    if (isSelected){
      if (unavailableDays.includes(dateNow)){
        return (
          <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? '⚫' : undefined}
          >
            <PickersDay onDaySelect={function (day: any): void {
              throw new Error('Function not implemented.');
            } } isFirstVisibleCell={false} isLastVisibleCell={false} {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
          </Badge>
        );
      }
    }

    if(presentYear !== undefined && parseInt(props.day['$y']) >= parseInt(presentYear)){
      return (
        <Badge
          key={props.day.toString()}
          overlap="circular"
          badgeContent={isSelected ? '🔵' : undefined}
        >
          <PickersDay onDaySelect={function (day: any): void {
            throw new Error('Function not implemented.');
          } } isFirstVisibleCell={false} isLastVisibleCell={false} {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
      );
    }
    else{
      return (
        <Badge
          key={props.day.toString()}
          overlap="circular"
        >
          <PickersDay onDaySelect={function (day: any): void {
            throw new Error('Function not implemented.');
          } } isFirstVisibleCell={false} isLastVisibleCell={false} {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
      );
    }
  
  }

ServerDay.propTypes = {
  /**
   * The date to show.
   */
  day: PropTypes.object.isRequired,
  availableDays: PropTypes.arrayOf(PropTypes.number),
  /**
   * If `true`, day is outside of month and will be hidden.
   */
  outsideCurrentMonth: PropTypes.bool.isRequired,
};



  const fetchUnvailableDays = async() => {
    const url = "http://localhost:3001/availability?item_id=" + props.item_id;
    const response = await fetch(url);
    const data = await response.json() as Appointment[];
    setData(data);
    const date = new Date();
    let newMonth: string = (date.getMonth() + 1).toString();
    let newDate: string = date.getDate().toString();

    if (parseInt(newMonth)< 10) {
      newMonth = "0" + newMonth
    }

    if (parseInt(newDate) < 10) {
      newDate = "0" + newDate
    }

    // setCurrentDate(date.getFullYear() + "-" + newMonth + "-" + newDate)
    console.log("data in unavailable days", data)

    const today = current()
    let ls = data.map(info => info.date)
    ls.push(today)

    setPresentMonth(today.slice(5, 7))
    setPresentYear(today.slice(0, 4))

    setUnavailableDays(ls)
    console.log("unavailable days", unavailableDays)
  }

  const fetchAvailableDays = (date: { [x: string]: number; } | undefined) => {
    let ls = [];
    let today = current().slice(8, 10);

    if (typeof date !== 'undefined'){
      const dateMonth = (date['$M'] + 1).toString()
      const dateYear = date['$d'].toString().slice(11, 15)

      const currentD = new Date(presentYear+"-"+presentMonth)
      const dateD = new Date(dateYear+"-"+dateMonth)

      if (presentMonth !== undefined && date['$M'] + 1 === parseInt(presentMonth)){
        for (let i = parseInt(today) - 1; i <= 31; i++) {
          ls.push(i)
        }
      }
      else{
        // Months before
  
        if (dateD > currentD ){
          for (let i = 0; i <= 31; i++) {
            ls.push(i)
          }
        }
        
      }
    }
    else{
      //undefined
      for (let i = parseInt(today) - 1; i <= 31; i++) {
        ls.push(i)
      }
      
    }
    setAvailableDays(ls);
    setIsLoading(false);
  };


  React.useEffect(() => {
    // getData();
    fetchUnvailableDays();
    const dateObj: { [x: string]: number } | undefined = currentDate
  ? {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate(),
    }
  : undefined;

  
    fetchAvailableDays(dateObj);
    // abort request on unmount
    return () => {
      if (requestAbortController.current) {
        requestAbortController.current.abort();
      }
    };
  }, []);

  const handleMonthChange = (date: object) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setAvailableDays([]);
    const strdate= date as { [x: string]: number; };
    fetchAvailableDays(strdate);
  };

  type TimeObj = {
    $M: number;
    $d: string;
    $D: number;
  }

  const timeToDate = (obj: TimeObj) => {
    
    let tMonth = obj['$M'] + 1
    let tYear = obj['$d'].toString().slice(11, 15)
    let tDay = obj['$D']
    let tdate = new Date(tYear+"-"+tMonth+"-"+tDay)
    // console.log(tYear,tMonth,tDay)
    // console.log(tdate)
    return tdate
  }
  const getDate = (date: string) =>{
    if (date){
      let datestring = JSON.stringify(date).slice(1,11)
      return datestring
    }

    return current()
  }

  const getAvailability = (date: string) =>{
    let datestring = ""

    if (!chosenTime){
      datestring = current()
    }else{
      datestring = JSON.stringify(date).slice(1,11)
    }
    if (unavailableDays.includes(datestring)){
      return (
        <div>
          No availability
        </div>
      )
    }else{
      return(
        <div>
          <Button variant="contained" onClick={submitReserve}>12:00AM</Button>
        </div>
      )
    }
  }
  function generateRandomID(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars.charAt(randomIndex);
    }
    return result;
  }
  
  const submitReserve = async() =>{
    let booking = 
    {
      id: generateRandomID(),
      item_id: props.item_id,
      date: JSON.stringify(chosenTime).slice(1,11),
      time: "12:00AM",
      booked: true
    }
    // data.push(booking)
    console.log("booking", booking)
    fetch('http://localhost:3001/availability', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(booking)
  })
    .then(response => response.json())
    .then(data => setData(data))
    .then(refresh => fetchUnvailableDays())



    fetchUnvailableDays();
    setReserveMessage((<Typography variant="h5">We have your reservation!</Typography>))
  }


  const initialValue = dayjs(current());
  // console.log(availableDays);
  
  return (
    <div>
      
  
      <Grid container spacing={8}>
      <Grid xs={4} component="div">

      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            defaultValue={initialValue}
            loading={isLoading}
            onMonthChange={handleMonthChange}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: ServerDay
            }}
            slotProps={{
              day: {
                availableDays,
              } as unknown as object
            }}
            onChange={(e) => {
              if (e) {
                setChosenTime(timeToDate(e as TimeObj).toISOString());
                setReserveMessage(<Typography variant="h5"></Typography>);
              }
            }}
          />
        </LocalizationProvider>

      </Grid>


      <Grid xs={4} style = {{textAlign: 'center',}} component="div">
      
      <Typography variant="h6">{getDate(chosenTime)}</Typography>
        <div>
        {getAvailability(chosenTime)}
        </div>

      </Grid>


      <Grid xs={4} component="div">
      <Typography variant="h6">Servers Detail</Typography>
      <div>{reserveMessage}</div>
      </Grid>


    </Grid> 
    </div>
    
  );
}


export default Calendar;