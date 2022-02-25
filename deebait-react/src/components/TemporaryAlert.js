import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function TemporaryAlert({ open=false, onClose=function(){return null;}, severity='success', title='Example', children }) {
    return (
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} onClose={onClose} autoHideDuration={3000}>
            <Alert severity={severity}>
                <AlertTitle>{title}</AlertTitle>
                {children}
            </Alert>
        </Snackbar>
    );
}

export default TemporaryAlert;