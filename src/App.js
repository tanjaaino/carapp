
import { Toolbar, Typography } from '@mui/material';
import './App.css';
import Carlist from './components/Carlist';
import AppBar from '@mui/material/AppBar';

function App() {
  return (
    <div>
    <AppBar position="static">
     <Toolbar>
     <Typography variant='h6'>My Carshop </Typography>
     </Toolbar>
    </AppBar>
    <Carlist />
    </div>
  );
}

export default App;
