import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TicketData {
  ticketNumber: string;
  customerName: string;
  queuePosition: number;
  estimatedWaitTime: string;
  serviceType: string;
  timestamp: string;
}

function TicketPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  useEffect(() => {
    // Get customer name from navigation state or localStorage
    const customerName = location.state?.customerName || localStorage.getItem('customerName') || 'Customer';

    // Generate ticket data
    const ticket: TicketData = {
      ticketNumber: generateTicketNumber(),
      customerName: customerName,
      queuePosition: Math.floor(Math.random() * 15) + 1,
      estimatedWaitTime: calculateWaitTime(),
      serviceType: 'General Service',
      timestamp: new Date().toLocaleString()
    };

    setTicketData(ticket);
  }, [location.state]);

  const generateTicketNumber = (): string => {
    const prefix = 'A';
    const number = Math.floor(Math.random() * 999) + 1;
    return `${prefix}${number.toString().padStart(3, '0')}`;
  };

  const calculateWaitTime = (): string => {
    const minutes = Math.floor(Math.random() * 45) + 5;
    return `${minutes} minutes`;
  };

  const handleConfirmTicket = () => {
    navigate('/kiosk');
  };

  const handleGoHome = () => {
    navigate('/kiosk');
  };

  if (!ticketData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">

        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 border-l-8 border-blue-500">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-700 mb-2">Welcome,</h2>
            <h3 className="text-4xl font-bold text-blue-600">{ticketData.customerName}</h3>
          </div>

          <div className="text-center mb-12 p-8 bg-blue-50 rounded-2xl">
            <p className="text-2xl text-gray-600 mb-2">Your Ticket Number</p>
            <div className="text-8xl font-bold text-blue-600 mb-4">{ticketData.ticketNumber}</div>
            <p className="text-xl text-gray-500">Please remember this number</p>
          </div>



          <div className="text-center text-gray-500 text-lg">
            Issued on: {ticketData.timestamp}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={handleConfirmTicket}
            className="px-12 py-6 text-2xl font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
          >
            Confirm Ticket
          </button>

          <button
            onClick={handleGoHome}
            className="px-12 py-6 text-2xl font-semibold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors shadow-lg"
          >
            Go to Home
          </button>
        </div>


      </div>
    </div>
  );
}

export default TicketPage;