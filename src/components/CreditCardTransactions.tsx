import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface Transaction {
  ID: string; 
  Amount: number;
  Created_At: string;
  Description: string;
}

const API_URL = 'https://sheetdb.io/api/v1/4yjx2jiifblx4';

const CreditCardTransactions = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data);
      calculateTotal(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateID = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addTransaction = async (newTransaction: Transaction) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [{
            ID: newTransaction.ID,
            Amount: newTransaction.Amount,
            Created_At: newTransaction.Created_At,
            Description: newTransaction.Description
          }]
        }),
      });

      if (!response.ok) throw new Error('Failed to add transaction');
      
      await fetchTransactions();
      setError(null);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Please try again.');
    }
  };

  function generateDate() {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-GB', options);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    const newTransaction = {
      ID: generateID(),
      Amount: Number(amount),
      Created_At: generateDate(),
      Description: description.trim()
    };

    await addTransaction(newTransaction);
    setAmount('');
    setDescription('');
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/ID/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to delete transaction');
      
      fetchTransactions();
      setError(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction. Please try again.');
    }
  };

  const calculateTotal = (transactions: Transaction[]) => {
    const sum = transactions.reduce((acc, curr) => acc + Number(curr.Amount), 0);
    setTotal(sum);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Credit Card Repayments</h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Transaction
        </button>
      </form>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.ID}
            className="flex flex-col md:flex-row md:justify-between items-start md:items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-lg font-semibold">₹{transaction.Amount.toLocaleString()}</span>
              <span className="text-gray-600">{transaction.Description}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <span className="text-gray-500">{transaction.Created_At}</span>
              <button
                onClick={() => handleDelete(transaction.ID)}
                className="text-red-500 hover:text-red-700 p-1 transition-colors"
                title="Delete transaction"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-xl font-bold">Total Received: ₹{total.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CreditCardTransactions;