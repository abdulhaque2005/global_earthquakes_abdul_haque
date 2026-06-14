import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserRole, deleteUser } from '../../store/slices/userSlice';
import { registerUser } from '../../store/slices/authSlice';
import { Helmet } from 'react-helmet-async';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
  Select, MenuItem, TextField, CircularProgress
} from '@mui/material';
import { Delete, Edit, UserPlus, Shield } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { usersList, loading } = useSelector((state) => state.users);
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleRoleChange = (e) => {
    dispatch(updateUserRole({ id: selectedUser._id, role: e.target.value }));
    setOpenRole(false);
  };

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Min 6 chars').required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      await dispatch(registerUser(values));
      dispatch(fetchUsers());
      setOpenCreate(false);
      resetForm();
    }
  });

  return (
    <div className="py-8">
      <Helmet>
        <title>User Management | QuakeVision Admin</title>
        <meta name="description" content="Manage user accounts, roles, and access permissions within the QuakeVision administration platform." />
        <meta name="keywords" content="quakevision user management, admin user control, access management, role management" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield color="var(--primary)" /> User Management
        </h1>
        <Button 
          variant="contained" 
          startIcon={<UserPlus size={18} />}
          onClick={() => setOpenCreate(true)}
          sx={{ bgcolor: 'var(--primary)', '&:hover': { bgcolor: 'var(--primary-hover)' } }}
        >
          Add User
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ bgcolor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' } }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
            ) : usersList.map((user) => (
              <TableRow key={user._id} sx={{ '& td': { color: 'white', borderBottom: '1px solid var(--glass-border)' } }}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    {user.role.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => { setSelectedUser(user); setOpenRole(true); }}>
                    <Edit size={18} />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user._id)}>
                    <Delete size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Change Role Dialog */}
      <Dialog open={openRole} onClose={() => setOpenRole(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white' } }}>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <p className="mb-4">Update role for {selectedUser?.name}</p>
          <Select
            fullWidth
            value={selectedUser?.role || 'user'}
            onChange={handleRoleChange}
            sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRole(false)} sx={{ color: 'var(--text-muted)' }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', width: '400px' } }}>
        <DialogTitle>Create New User</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              fullWidth label="Name" name="name" 
              value={formik.values.name} onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
            />
            <TextField 
              fullWidth label="Email" name="email" type="email"
              value={formik.values.email} onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
            />
            <TextField 
              fullWidth label="Password" name="password" type="password"
              value={formik.values.password} onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenCreate(false)} sx={{ color: 'var(--text-muted)' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--primary)' }}>Create User</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UserManagement;
