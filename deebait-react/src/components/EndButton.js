import Button from '@mui/material/Button';


function EndButton({ value = 'End',onClick = function() {return null;}, disabled=false }) {
    return (
        <Button disabled={disabled} sx={{padding: '0'}} onClick={onClick}>{value}</Button>        
    );
}

export default EndButton;