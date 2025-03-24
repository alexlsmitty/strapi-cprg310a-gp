import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const BudgetFeature = () => {
    const household_id = useAuth()
    const { user } = useAuth();
  const navigate = useNavigate();

  // Household membership details
  const [householdId, setHouseholdId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Active budget data (fetched from budgets table)
  const [activeBudget, setActiveBudget] = useState(null);
  // Transactions for this household
  const [transactions, setTransactions] = useState([]);

  // Dialog controls for budget creation and transaction submission
  const [openBudgetDialog, setOpenBudgetDialog] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [budgetStartDate, setBudgetStartDate] = useState('');
  const [budgetEndDate, setBudgetEndDate] = useState('');
  const [budgetTotalAmount, setBudgetTotalAmount] = useState('');

  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [transactionType, setTransactionType] = useState('bill');
  const [transactionAmount, setTransactionAmount] = useState('');

  // --------------------------------------------------
  // 1. Fetch Household Membership and Role
  // --------------------------------------------------
  useEffect(() => {
    const fetchHousehold = async () => {
      if (!user) return;
      const { data: membership, error } = await supabase
        .from('household_members')
        .select('household_id, role')
        .eq('user_id', user.id)
        .single();
      if (error) {
        console.error('Error fetching membership:', error);
      } else if (membership) {
        setHouseholdId(membership.household_id);
        setIsOwner(membership.role === 'owner');
      }
    };

    fetchHousehold();
  }, [user]);

  // --------------------------------------------------
  // 2. Fetch Active Budget and Transactions
  // --------------------------------------------------
  useEffect(() => {
    if (!householdId) return;

    const fetchBudget = async () => {
      // Use today's date (formatted as YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      // Fetch the active budget (start_date ≤ today ≤ end_date)
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('household_id', householdId)
        .lte('start_date', today)
        .gte('end_date', today)
        .single();
      if (error) {
        console.error('Error fetching active budget:', error);
        setActiveBudget(null);
      } else {
        setActiveBudget(data);
      }
    };

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('household_id', householdId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data || []);
      }
    };

    fetchBudget();
    fetchTransactions();
  }, [householdId]);

  // --------------------------------------------------
  // 3. Handle Budget Creation (Owner Only)
  // --------------------------------------------------
  const handleCreateBudget = async () => {
    if (!budgetName || !budgetStartDate || !budgetEndDate || !budgetTotalAmount) {
      alert("Please fill in all fields.");
      return;
    }
    const total = parseFloat(budgetTotalAmount);
    if (isNaN(total) || total < 0) {
      alert("Please enter a valid total amount.");
      return;
    }
    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        household_id: householdId,
        name: budgetName,
        start_date: budgetStartDate,
        end_date: budgetEndDate,
        total_amount: total
      }])
      .select();
    if (error) {
      console.error("Error creating budget:", error);
    } else if (data && data.length > 0) {
      setActiveBudget(data[0]);
      setOpenBudgetDialog(false);
      setBudgetName('');
      setBudgetStartDate('');
      setBudgetEndDate('');
      setBudgetTotalAmount('');
    }
  };

  // --------------------------------------------------
  // 4. Handle Adding a Transaction
  // --------------------------------------------------
  const handleAddTransaction = async () => {
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid transaction amount.");
      return;
    }
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        household_id,
        transaction_type: transactionType, // 'bill' or 'contribution'
        amount,
        created_by: user.id
      }])
      .select();
    if (error) {
      console.error("Error adding transaction:", error);
    } else if (data && data.length > 0) {
      setTransactions(prev => [data[0], ...prev]);
      setOpenTransactionDialog(false);
      setTransactionType('bill');
      setTransactionAmount('');
    }
  };

  // --------------------------------------------------
  // 5. Calculate Remaining Budget
  // --------------------------------------------------
  const totalBills = transactions
    .filter(tx => tx.type === 'bill')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const totalContributions = transactions
    .filter(tx => tx.type === 'contribution')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const remainingBudget = activeBudget
    ? activeBudget.total_amount - totalBills + totalContributions
    : 0;

  // --------------------------------------------------
  // Render BudgetFeature Component
  // --------------------------------------------------
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Budget</Typography>
      {activeBudget ? (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Budget:</strong> ${activeBudget.total_amount.toFixed(2)} <br/>
            <strong>Period:</strong> {activeBudget.start_date} to {activeBudget.end_date}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            <strong>Remaining:</strong> ${remainingBudget.toFixed(2)}
          </Typography>
        </>
      ) : (
        <Typography variant="body1" sx={{ mb: 2 }}>
          No active budget. Please set one.
        </Typography>
      )}

      {/* Owner can create a new budget */}
      {isOwner && (
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => setOpenBudgetDialog(true)}
        >
          {activeBudget ? 'Update Budget' : 'Set Budget'}
        </Button>
      )}

      {/* All users can add a transaction */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpenTransactionDialog(true)}
      >
        Add Transaction
      </Button>

      {/* Budget Creation Dialog */}
      <Dialog open={openBudgetDialog} onClose={() => setOpenBudgetDialog(false)}>
        <DialogTitle>{activeBudget ? 'Update Budget' : 'Set Household Budget'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Budget Name"
            fullWidth
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={budgetStartDate}
            onChange={(e) => setBudgetStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={budgetEndDate}
            onChange={(e) => setBudgetEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Total Amount"
            type="number"
            fullWidth
            value={budgetTotalAmount}
            onChange={(e) => setBudgetTotalAmount(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBudgetDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateBudget}>Save Budget</Button>
        </DialogActions>
      </Dialog>

      {/* Transaction Dialog */}
      <Dialog
        open={openTransactionDialog}
        onClose={() => setOpenTransactionDialog(false)}
      >
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="transaction-type-label">Type</InputLabel>
            <Select
              labelId="transaction-type-label"
              value={transactionType}
              label="Type"
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <MenuItem value="bill">Bill</MenuItem>
              <MenuItem value="contribution">Contribution</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransactionDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTransaction}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Transactions Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Transactions</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>${tx.amount.toFixed(2)}</TableCell>
                  <TableCell>{tx.created_by}</TableCell>
                  <TableCell>
                    {new Date(tx.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Back to Dashboard Button */}
      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default BudgetFeature;
