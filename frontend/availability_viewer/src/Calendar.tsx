// package import
import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { IconButton, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Unstable_Grid2";
import './Calendar.css'
import './Map.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';


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

interface CartItem {
  item_id: string;
  time: string;
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
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const api = "https://mountserver.onrender.com"

  // fetch current time
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

    return date.getFullYear() + "-" + month + "-" + today;
  });
  
  // calculate the time availiability/unavailiability
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
  
    // If date is selected to be reserved
    if (isSelected){
      // Mark date as unavailable
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

    // Mark date as available if it is within or after current year
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
      // Mark with nothing if date is before current date
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


  // calculate the unavailable days
  const fetchUnvailableDays = async() => {
    const url = `${api}/availability?item_id=` + props.item_id;
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
    // console.log("data in unavailable days", data)

    const today = current()
    let ls = data.map(info => info.date)
    ls.push(today)

    setPresentMonth(today.slice(5, 7))
    setPresentYear(today.slice(0, 4))

    setUnavailableDays(ls)
    // console.log("unavailable days", unavailableDays)
  }

  // calculate the available days
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
    // get the unavailable days
    fetchUnvailableDays();
    const dateObj: { [x: string]: number } | undefined = currentDate
  ? {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate(),
    }
  : undefined;

    // get the availiable days
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
  // time to date convertor
  const timeToDate = (obj: TimeObj) => {
    
    let tMonth = obj['$M'] + 1
    let tYear = obj['$d'].toString().slice(11, 15)
    let tDay = obj['$D']
    let tdate = new Date(tYear+"-"+tMonth+"-"+tDay)
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
          <Button variant="contained" onClick={() => {
            if (chosenTime) {
              const newItem = { time: chosenTime, item_id: props.item_id };
              setCartItems([...cartItems, newItem]);
              setReserveMessage(<Typography variant="h5">Item added to cart</Typography>);
            } else {
              setReserveMessage(<Typography variant="h5" color="error">No date selected</Typography>);
            }
          }}>12:00AM</Button>
        </div>
      )
    }
}
  // generate random id with 7 characters/numbers
  function generateRandomID(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars.charAt(randomIndex);
    }
    return result;
  }

  const initialValue = dayjs(current());
  // console.log(availableDays);
  
  // handleCartOpen and handleCartClose handle the buttons that
  // opens and closes the cart respectfully.
  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  // handleCartRemove handles the button that clears a single
  // item from the cart
  const handleCartRemove = (index: number) => {
    setCartItems((prevCart) => {
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  // handleCartClear handles the button that clears the cart of
  // all items
  const handleCartClear = () => {
    // Clear the cart
    console.log("Clearing cart");
    setCartItems([]);
  };

  // handleReserveAll handles the case for reserving all of the
  // current items that are in the cart and then makes a
  // corresponding object in the json file simulating a database
  // called db.json
  const handleReserveAll = async () => {
    // Reserve all items in the cart
    console.log("Reserving all items:", cartItems);
    for (const item of cartItems) {
      const booking = {
        id: generateRandomID(),
        item_id: item.item_id,
        date: JSON.stringify(item.time).slice(1,11),
        time: "12:00AM",
        booked: true
      };
      await fetch(`${api}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
      })
      .then(response => response.json())
      .then(data => setData(data))
      .then(refresh => fetchUnvailableDays())
    }
    // Clear cart items and show reservation message
    setCartItems([]);
    setReserveMessage((<Typography variant="h6">Your reservations have been booked!</Typography>));
  };
  

  return (
    <div className='form-div'>
      <div className='titlec'style={{ fontSize: '50px' }}>
      Time Selection
      </div>


      <div className='description' style={{ fontSize: '40px' }}>
        Select a time you want to book
      </div>
      <hr></hr>
  
      <Grid container spacing={8}>
        <Grid xs={4} style = {{textAlign: 'center' }} component="div">
          <Typography variant="h5" style={{color: "#4682B4", fontSize: "40px"}}><strong>Calendar</strong></Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            
            <DateCalendar
              sx={{ color: 'text.primary', fontSize: 50, fontWeight: 'medium' }}
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
                  const selectedTime = timeToDate(e as TimeObj).toISOString();
                  setChosenTime(selectedTime);
                }
              }}
            />
          </LocalizationProvider>

        </Grid>


        <Grid xs={4} style = {{textAlign: 'center',}} component="div">
      
          
          <Typography variant="h5"  style={{color: "#4682B4", fontSize: "40px"}}><strong>Date</strong></Typography>
          <div className='datainfo'>
            <Typography variant="h6" style={{color: "#4682B4", fontSize: "35px"}}>{getDate(chosenTime)}</Typography>
          </div>
          <div>
            {getAvailability(chosenTime)}
          </div>

        </Grid>

        <Grid xs={4} component="div">
          <Typography variant="h5"  style={{color: "#4682B4", fontSize: "40px"}}><strong>Server Details</strong></Typography>
          <div >{reserveMessage}</div>
        </Grid>

      </Grid> 

      <div className="cart-container">
        <IconButton aria-label="cart" onClick={handleCartOpen}>
          <Badge badgeContent={cartItems.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        {cartOpen && (
          <div className="cart">
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <IconButton aria-label="close" onClick={handleCartClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <span>{item.time}</span>
                  <IconButton aria-label="delete" onClick={() => handleCartRemove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <Button variant="contained" color="primary" onClick={handleReserveAll}>
                Reserve All
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCartClear}>
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
    
  );
}


export default Calendar;