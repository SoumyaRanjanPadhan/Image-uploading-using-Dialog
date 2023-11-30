import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl, FormLabel, IconButton, InputLabel, OutlinedInput, Radio, RadioGroup, Select } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DialogPop from './DialogPop';

const defaultTheme = createTheme();

export default function EditUser() {

  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [uploadedFileName, setUploadedFileName] = React.useState(null);
  const [image, setimg] = React.useState('');

  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [data, setdata] = React.useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    role: ""
  })
  const { name, email, gender, password, role } = data

  const onInputChange = (event) => {

    setdata({ ...data, [event.target.name]: event.target.value })
  }
 
  React.useEffect(() => {
    const fetchData=async()=>{
      await loaddata();
      const response = await axios.get(`http://localhost:9090/file/${id}/image`,{
        responseType:'arraybuffer',
        });
        const imgdata=response.data;
        const blob=new Blob([imgdata],{type:'image/jpeg'});
        const imageurl=URL.createObjectURL(blob);
        return imageurl;
    }
    fetchData().then((imageurl)=>{
      setimg(imageurl);
    })
  },[]);
  

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await axios.put(`http://localhost:9090/user/${id}`, data)
    navigate(`/user/profile/${id}`)
    setLoading(false);
  }

  const loaddata = async () => {
    const result = await axios.get(`http://localhost:9090/user/${id}`)
    setdata(result.data)
  }





  return (
    <ThemeProvider theme={defaultTheme}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container component="main" sx={{ height: '50vh' }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={3.5} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 2,
              mx: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
              <Avatar sx={{ width: 100, height: 100 }}>
                <img src={image} alt='user' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton
                  color="primary"
                  aria-label="edit"
                  sx={{ position: 'absolute', bottom: 0, right: 0 }}
                  onClick={handleOpenUploadDialog}
                >
                  <EditIcon />
                </IconButton>
              </Avatar>
              <Typography component="h1" variant="h5">
                Update Details
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={(event) => onInputChange(event)}
                value={name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(event) => onInputChange(event)}
                value={email}
              />
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="gender"
                  onChange={(event) => onInputChange(event)}
                  value={gender}
                >
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />

                </RadioGroup>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) => onInputChange(event)}
                value={password}
              />
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Role</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"

                  value={role}
                  onChange={(event) => onInputChange(event)}
                  input={<OutlinedInput label="Role" />}
                  name="role"

                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Save
              </Button>

            </Box>
          </Box>
          <DialogPop
            open={uploadDialogOpen}
            onClose={handleCloseUploadDialog}
            onFileUpload={(fileName) => {
              setUploadedFileName(fileName);
              handleCloseUploadDialog();
            }}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}