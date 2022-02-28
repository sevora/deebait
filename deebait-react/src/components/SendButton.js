import SendIcon from '@mui/icons-material/Send';

import Button from '@mui/material/Button';


function SendButton() {
    return (
        <Button endIcon={<SendIcon/>}>Send</Button>
    );
}

export default SendButton;