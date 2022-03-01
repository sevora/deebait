import SendIcon from '@mui/icons-material/Send';

import Button from '@mui/material/Button';


function SendButton({ onClick = function() {return null;}, disabled=false }) {
    return (
        <Button disabled={disabled} onClick={onClick} endIcon={<SendIcon/>}></Button>
    );
}

export default SendButton;