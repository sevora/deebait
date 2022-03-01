import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function Loader({ visible=false }) {
    return (
        <Box display={visible ? 'flex' : 'none'} width="100%" height="100%" justifyContent='center'>
            <Box display='flex' alignItems='center'>
                <CircularProgress />
            </Box>
        </Box>
    );
}

export default Loader;