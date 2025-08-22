import React from 'react';

interface FeedbackToastProps {
  message: string | null;
}

const FeedbackToast: React.FC<FeedbackToastProps> = ({ message }) => (
  message ? (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded shadow-lg">
      {message}
    </div>
  ) : null
);

export default FeedbackToast;
