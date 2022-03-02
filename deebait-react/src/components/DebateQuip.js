import { sprintf } from 'sprintf-js';

import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

function DebateQuip({ question='Which is better to have as a pet?', partnerChoice='Cats', yourChoice='Dogs'}) {
    let quips = [
        `This person chose '%s' over '%s'`, 
        `They chose '%s' over '%s' 🤨`,
        `They better be tripping, cause they chose '%s' over '%s' 😭`,
    ];
    let index = Math.floor(Math.random() * quips.length);
    let [text, setText] = useState(sprintf(quips[index], partnerChoice, yourChoice));

    return (
        <Box sx={{ width: '100%'}} mb={1}>
            <Alert severity='error'>When asked, "{question}"<br />{text}</Alert>
        </Box>
    );
}

export default DebateQuip;