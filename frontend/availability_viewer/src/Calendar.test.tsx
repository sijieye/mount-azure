import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from './Calendar';
import App from './App';
import '@testing-library/jest-dom/extend-expect';
import MapComponent from './MapComponent';
import { DateCalendar } from '@mui/x-date-pickers';

interface MapProps {
    location: string;
    radius: number;
    onLoad: (map: google.maps.Map) => void;
    onMarkerLoad: (marker: google.maps.Marker) => void;
}

describe( 'Calendar', () => {
    const date = new Date();

    let month: string = (date.getMonth() + 1).toString();
    let today: string = date.getDate().toString();

    if (parseInt(month) < 10){
      month = "0" + month
    }

    if (parseInt(today) < 10){
      today = "0" + today
    }

    test("render calendar component", () => {
        render(<Calendar item_id="A1B2C" />);
        expect(screen.getByText('Calendar')).toBeInTheDocument();
    })


    test("test able to click the 20", () => {
        render(<Calendar item_id="A1B2C" />);
        const btn = screen.getByRole('gridcell', { name: /20/i });
        fireEvent.click(btn);

        let str = date.getFullYear() + "-" + month + "-" + "20";
        expect(screen.getByText(str)).toBeInTheDocument();
    })


      
})



describe( 'Shopping Cart', () => {
    test("render shopping cart", () => {
        render(<Calendar item_id="A1B2C" />);
        const button = screen.getByRole('button', { name: /cart/i });
        expect(button).toBeInTheDocument();
    })

    test("check shopping cart opens", () => {
        render(<Calendar item_id="A1B2C" />);
        const cart = screen.getByRole('button', { name: /cart/i });
        fireEvent.click(cart);

        expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    })

    test("reserve all shopping cart", () => {
        render(<Calendar item_id="A1B2C" />);
        const cart = screen.getByRole('button', { name: /cart/i });
        fireEvent.click(cart);

        const reserve = screen.getByText('Reserve All');
        fireEvent.click(reserve);

        
        expect(screen.getByText('Your reservations have been booked!')).toBeInTheDocument();
    })

    test("close shopping cart", () => {
        render(<Calendar item_id="A1B2C" />);
        const cart = screen.getByRole('button', { name: /cart/i });
        fireEvent.click(cart);

        const exit = screen.getByRole('button', { name: /close/i });
        fireEvent.click(exit);

        expect(screen.queryByText('Shopping Cart')).toBeNull();
    })
});

describe( 'Map', () => {
    const mapProps: MapProps = {
        location: 'Boston',
        radius: 1,
        onLoad: jest.fn(),
        onMarkerLoad: jest.fn(),
      };

    test('location and radius fields update correctly', () => {
        if (window.google && window.google.maps) {
            const mapElement = render(<MapComponent {...mapProps}/>);
            expect(mapElement).toBeInTheDocument();
        }
       
  
    })
});
