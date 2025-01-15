import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface Transaction {
  ID: string; // Changed to string to match SheetDB's format
  Amount: number;
  Created_At: string;
}

const API_URL = 'https://sheetdb.io/api/v1/unjjjqvynz3ip';

const PhonePeTransactions = () => {
  const [amount, setAmount] = useState('');
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
      console.log(data)
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
    // Generate a unique string ID using timestamp and random number
  
    const id= `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log("id",id)
    return id;

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
            ID: newTransaction.ID,  // Make sure to use lowercase 'id' for SheetDB
            Amount: newTransaction.Amount,
            Created_At: newTransaction.Created_At
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

    const newTransaction = {
      ID: generateID(),  // Changed from ID to id
      Amount: Number(amount),
      Created_At:  generateDate()
    };

    await addTransaction(newTransaction);
    setAmount('');
  };

  const handleDelete = async (id: string) => {
    try {
      // Using the correct SheetDB delete endpoint format
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
      <h2 className="text-2xl font-bold mb-6">PhonePe Business Received</h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex-1 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.ID}
            className="flex justify-between items-center border-b pb-2"
          >
            <span className="text-lg">₹{transaction.Amount.toLocaleString()}</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                {transaction.Created_At}
              </span>
              <button
                onClick={() => handleDelete(transaction.ID)}
                className="text-red-500 hover:text-red-700 p-1"
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

export default PhonePeTransactions;