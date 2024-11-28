import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function DatePickerTest() {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Date de test"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
            />
        </LocalizationProvider>
    );
}

export default DatePickerTest;
