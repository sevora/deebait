import { sprintf } from 'sprintf-js';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

function DebateQuip({ partnerChoice='Cats', yourChoice='Dogs'}) {
    let quips = [
        "This person prefers '%s' over '%s'", 
        "This person likes '%s' over '%s'",
        "They chose '%s' over '%s' 🤨",
        "They trippin, cause why '%s' over '%s' 😭",
    ];
    let index = Math.floor(Math.random() * quips.length);
    let text = sprintf(quips[index], partnerChoice, yourChoice);

    return (
        <Box sx={{ width: '100%'}} mb={1}>
            <Alert severity='error'>{text}</Alert>
        </Box>
    );
}

export default DebateQuip;