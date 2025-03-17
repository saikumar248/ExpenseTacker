import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Wallet, CreditCard } from 'lucide-react';
import PhonePeTransactions from './components/PhonePeTransactions';
import CreditCardTransactions from './components/CreditCardTransactions';

function App() {
  return (
    <Router>
      <center>  <strong>  <h1 className="bg-gray-100">
        Ajay's Expense Tracker
      </h1></strong> </center>


      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  PhonePe Business
                </Link>
                <Link
                  to="/credit-card"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Credit Card
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<PhonePeTransactions />} />
            <Route path="/credit-card" element={<CreditCardTransactions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;