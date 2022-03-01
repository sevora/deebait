import SendIcon from '@mui/icons-material/Send';

import Button from '@mui/material/Button';


function SendButton({ onClick = function() {return null;} }) {
    return (
        <Button onClick={onClick} endIcon={<SendIcon/>}>Send</Button>
    );
}

export default SendButton;