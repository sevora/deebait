import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function DebateMessage({ isSender = false, children }) {
    return (
        <Box sx={{ width: '100%' }} mb={1}>
            <Box p={'10px'} mt={1} borderRadius={'15px'} maxWidth='70%' backgroundColor={isSender ? '#ff1744' : '#ddd'} color={isSender ? 'white' : 'black'} sx={{ float: isSender ? 'right' : 'left',  clear: 'both', display: 'inline-block', whiteSpace: 'normal'}}>
                <Typography variant="body1" sx={{ overflowWrap: 'break-word' }}>
                    { children }
                </Typography>
            </Box>
        </Box>
    );
}

export default DebateMessage;