import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function OpinionTable({ width=800, entries=[{ question: 'Which do you prefer as a pet?', answer: 'Cat' }] }) {
    return (
        <TableContainer component={Paper} elevation={5}>
            <Table sx={{ maxWidth: width, minWidth: { 'md': width } }}>
            <TableHead>
                <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Answer</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {
                        entries.map((entry, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>{entry.question}</TableCell>
                                    <TableCell>{entry.answer}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default OpinionTable;