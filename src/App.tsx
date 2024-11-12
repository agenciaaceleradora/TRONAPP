import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Notes } from './components/Notes';
import { SubscriptionCheck } from './components/SubscriptionCheck';
import { useSubscription } from './hooks/useSubscription';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User>({ username: '', isAuthenticated: false });
  const { isSubscriptionActive, isLoading } = useSubscription();

  if (!user.isAuthenticated) {
    return <LoginForm onLogin={setUser} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010205] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <SubscriptionCheck isActive={isSubscriptionActive}>
      <div className="min-h-screen bg-[#010205]">
        <Navbar 
          user={user}
          onLogout={() => setUser({ username: '', isAuthenticated: false })}
        />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Dashboard />
          </div>
        </main>
        
        <Notes />
      </div>
    </SubscriptionCheck>
  );
}

export default App;