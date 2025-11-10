import { Counter } from "@/types/counter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CounterCardProps {
  counterId: string;
  counter: Counter;
  onAction: (counterId: string, action: 'call' | 'skip' | 'reset' | 'delete') => void;
}

export const CounterCard = ({ counterId, counter, onAction }: CounterCardProps) => {
  const formatQueueId = (prefix: string, num: number) => {
    return `${prefix}${String(num).padStart(3, '0')}`;
  };

  return (
    <Card className="relative overflow-hidden rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] before:absolute before:top-0 before:left-0 before:right-0 before:h-1.5 before:bg-gradient-to-r before:from-success before:to-secondary animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">{counter.name}</h2>
          <p className="text-muted-foreground text-sm">Counter ID: {counterId}</p>
        </div>
        <Badge className="bg-gradient-to-r from-accent to-secondary text-white px-4 py-2 text-xl font-bold shadow-lg">
          {counter.prefix}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-center transition-all hover:scale-105 hover:border-blue-300">
          <div className="text-sm font-semibold text-secondary mb-2 uppercase tracking-wide">
            Now Serving
          </div>
          <div className="text-5xl font-extrabold text-foreground tracking-wider drop-shadow-sm font-mono">
            {formatQueueId(counter.prefix, counter.nowServing)}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Current Number</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-center transition-all hover:scale-105 hover:border-blue-300">
          <div className="text-sm font-semibold text-secondary mb-2 uppercase tracking-wide">
            Last Issued
          </div>
          <div className="text-5xl font-extrabold text-foreground tracking-wider drop-shadow-sm font-mono">
            {formatQueueId(counter.prefix, counter.lastIssued || 0)}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Latest Ticket</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button
          onClick={() => onAction(counterId, 'call')}
          className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
        >
          <span className="text-2xl mr-2">📢</span> Call Next
        </Button>

        <Button
          onClick={() => onAction(counterId, 'skip')}
          className="bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
        >
          <span className="text-2xl mr-2">⏭️</span> Skip
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => onAction(counterId, 'reset')}
          variant="destructive"
          className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
        >
          <span className="text-2xl mr-2">🔄</span> Reset
        </Button>

        <Button
          onClick={() => onAction(counterId, 'delete')}
          variant="secondary"
          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
        >
          <span className="text-2xl mr-2">🗑️</span> Delete
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className={counter.active ? 'text-success font-semibold' : 'text-destructive font-semibold'}>
            {counter.active ? '🟢 Active' : '🔴 Inactive'}
          </span>
          <span className={counter.busy ? 'animate-pulse' : ''}>
            {counter.busy ? '⏱️ Busy' : '✅ Ready'}
          </span>
        </div>
      </div>
    </Card>
  );
};
