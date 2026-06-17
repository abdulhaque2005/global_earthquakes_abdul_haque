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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Shield className="text-brand-500" /> User Management
        </h1>
        <Button 
          variant="contained" 
          startIcon={<UserPlus size={18} />}
          onClick={() => setOpenCreate(true)}
          sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, textTransform: 'none', borderRadius: '12px', fontWeight: 600 }}
        >
          Add User
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: 'rgba(148,163,184,0.2)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { color: '#94a3b8', borderBottom: '1px solid rgba(148,163,184,0.2)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, borderBottom: 'none' }}><CircularProgress sx={{ color: '#14b8a6' }} /></TableCell></TableRow>
            ) : usersList.map((user) => (
              <TableRow key={user._id} sx={{ '& td': { borderBottom: '1px solid rgba(148,163,184,0.1)' } }}>
                <TableCell sx={{ color: 'inherit', fontWeight: 500 }}>{user.name}</TableCell>
                <TableCell sx={{ color: '#94a3b8' }}>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-brand-500/10 text-brand-500 border border-brand-500/20'}`}>
                    {user.role.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell sx={{ color: '#94a3b8' }}>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton sx={{ color: '#14b8a6' }} onClick={() => { setSelectedUser(user); setOpenRole(true); }}>
                    <Edit size={18} />
                  </IconButton>
                  <IconButton sx={{ color: '#ef4444' }} onClick={() => handleDelete(user._id)}>
                    <Delete size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openRole} onClose={() => setOpenRole(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Change User Role</DialogTitle>
        <DialogContent>
          <p className="mb-4 text-slate-400">Update role for <span className="text-white font-semibold">{selectedUser?.name}</span></p>
          <Select
            fullWidth
            value={selectedUser?.role || 'user'}
            onChange={handleRoleChange}
            sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#14b8a6' }, borderRadius: '12px' }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRole(false)} sx={{ color: '#94a3b8', textTransform: 'none' }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', width: '400px', borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New User</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              fullWidth label="Name" name="name" 
              value={formik.values.name} onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#14b8a6' }, borderRadius: '12px' } }}
            />
            <TextField 
              fullWidth label="Email" name="email" type="email"
              value={formik.values.email} onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#14b8a6' }, borderRadius: '12px' } }}
            />
            <TextField 
              fullWidth label="Password" name="password" type="password"
              value={formik.values.password} onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#14b8a6' }, borderRadius: '12px' } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenCreate(false)} sx={{ color: '#94a3b8', textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, textTransform: 'none', borderRadius: '12px', fontWeight: 600 }}>Create User</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UserManagement;
