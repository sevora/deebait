import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function DebateMessage({ isSender = false, children }) {
    return (
        <Box sx={{ width: '100%' }} mb={1}>
            <Box p={1} mt={1} backgroundColor={isSender ? '#ff1744' : '#ddd'} color={isSender ? 'white' : 'black'} borderRadius={2} sx={{ float: isSender ? 'right' : 'left',  clear: 'both', display: 'inline-block'}}>
                <Typography variant="body1">
                    { children }
                </Typography>
            </Box>
        </Box>
    );
}

export default DebateMessage;