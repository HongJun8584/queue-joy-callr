import { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, update, remove, serverTimestamp, get, push } from "firebase/database";
import { CountersData, Counter, QueueItem } from "@/types/counter";
import { CounterCard } from "@/components/CounterCard";
import { AddCounterDialog } from "@/components/AddCounterDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CounterDashboard = () => {
  const [counters, setCounters] = useState<CountersData>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const countersRef = ref(database, 'counters');
    
    const unsubscribe = onValue(countersRef, (snapshot) => {
      if (snapshot.exists()) {
        setCounters(snapshot.val());
      } else {
        setCounters({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatQueueId = (prefix: string, num: number) => {
    return `${prefix}${String(num).padStart(3, '0')}`;
  };

  const triggerNotification = async (counterId: string, queueId: string) => {
    try {
      const queueRef = ref(database, 'queue');
      const snapshot = await get(queueRef);

      if (!snapshot.exists()) return;

      const updates: Record<string, any> = {};
      snapshot.forEach((snap) => {
        const q = snap.val() as QueueItem;
        const key = snap.key;
        const ticketId = String(q.queueId || '').trim();

        if (ticketId === queueId && q.chatId) {
          updates[`queue/${key}/status`] = 'serving';
          updates[`queue/${key}/counterId`] = counterId;
          updates[`queue/${key}/serverNotifyRequested`] = true;
          updates[`queue/${key}/serverNotifyRequestedAt`] = serverTimestamp();
          updates[`queue/${key}/notifiedAt`] = serverTimestamp();
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ref(database), updates);
        toast.success('📱 Notification sent to customer');
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const handleAction = async (counterId: string, action: 'call' | 'skip' | 'reset' | 'delete') => {
    try {
      const counter = counters[counterId];
      if (!counter) return;

      const updates: Record<string, any> = {};

      if (action === 'call') {
        const newNumber = (counter.lastIssued || 0) + 1;
        updates[`counters/${counterId}/lastIssued`] = newNumber;
        updates[`counters/${counterId}/nowServing`] = newNumber;
        updates[`counters/${counterId}/lastAdvanceAt`] = serverTimestamp();
        updates[`counters/${counterId}/busy`] = false;

        await update(ref(database), updates);
        await triggerNotification(counterId, formatQueueId(counter.prefix, newNumber));
        toast.success(`📢 Called ${formatQueueId(counter.prefix, newNumber)}`);

      } else if (action === 'skip') {
        const newServing = counter.nowServing + 1;
        updates[`counters/${counterId}/nowServing`] = newServing;
        updates[`counters/${counterId}/lastAdvanceAt`] = serverTimestamp();
        updates[`counters/${counterId}/busy`] = false;

        await update(ref(database), updates);
        await triggerNotification(counterId, formatQueueId(counter.prefix, newServing));
        toast.info(`⏭️ Skipped to ${formatQueueId(counter.prefix, newServing)}`);

      } else if (action === 'reset') {
        const confirmed = window.confirm(
          `🔄 Reset ${counter.name} to starting position?\n\nThis will set:\n• Now Serving: ${counter.prefix}001\n• Last Issued: 0`
        );
        
        if (confirmed) {
          updates[`counters/${counterId}/nowServing`] = 1;
          updates[`counters/${counterId}/lastIssued`] = 0;
          updates[`counters/${counterId}/lastAdvanceAt`] = serverTimestamp();
          updates[`counters/${counterId}/busy`] = false;

          await update(ref(database), updates);
          toast.success(`🔄 ${counter.name} reset successfully`);
        }

      } else if (action === 'delete') {
        const confirmed = window.confirm(
          `🗑️ Delete ${counter.name}?\n\nThis action cannot be undone!`
        );
        
        if (confirmed) {
          await remove(ref(database, `counters/${counterId}`));
          toast.success(`🗑️ ${counter.name} deleted`);
        }
      }

    } catch (error) {
      console.error('Action error:', error);
      toast.error('❌ Operation failed. Please try again.');
    }
  };

  const handleAddCounter = async (name: string, prefix: string) => {
    try {
      const countersRef = ref(database, 'counters');
      const newCounterRef = push(countersRef);
      
      const newCounter: Counter = {
        name,
        prefix,
        nowServing: 1,
        lastIssued: 0,
        active: true,
        busy: false,
      };

      await update(ref(database, `counters/${newCounterRef.key}`), newCounter);
      toast.success(`✅ Counter "${name}" created successfully`);
    } catch (error) {
      console.error('Error adding counter:', error);
      toast.error('❌ Failed to create counter');
    }
  };

  const handleRefresh = () => {
    toast.info('🔄 Refreshing data...');
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const counterEntries = Object.entries(counters).sort(([, a], [, b]) => 
    (a.name || '').localeCompare(b.name || '')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary/80 bg-[length:200%_200%] animate-[gradient_15s_ease_infinite]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-card rounded-3xl shadow-2xl p-8 mb-8 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                🎯 Counter Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">Real-time queue management system</p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                👥 Customer View
              </Button>
              <AddCounterDialog onAdd={handleAddCounter} />
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="font-semibold"
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white text-xl font-semibold">Loading counters...</p>
          </div>
        )}

        {/* Counters Grid */}
        {!loading && counterEntries.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {counterEntries.map(([counterId, counter]) => (
              <CounterCard
                key={counterId}
                counterId={counterId}
                counter={counter}
                onAction={handleAction}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && counterEntries.length === 0 && (
          <div className="bg-card rounded-3xl shadow-2xl p-16 text-center animate-in slide-in-from-bottom-4">
            <div className="text-8xl mb-6">🏪</div>
            <h2 className="text-3xl font-bold text-foreground mb-3">No Counters Available</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Get started by adding your first service counter
            </p>
            <AddCounterDialog onAdd={handleAddCounter} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterDashboard;
