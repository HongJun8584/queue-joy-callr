import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCounterDialogProps {
  onAdd: (name: string, prefix: string) => void;
}

export const AddCounterDialog = ({ onAdd }: AddCounterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && prefix.trim()) {
      onAdd(name.trim(), prefix.trim().toUpperCase());
      setName("");
      setPrefix("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
          <span className="text-xl mr-2">➕</span> Add Counter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Counter</DialogTitle>
          <DialogDescription>
            Create a new service counter with a unique name and prefix.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Counter Name</Label>
            <Input
              id="name"
              placeholder="e.g., Counter 1, Service Desk A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prefix">Queue Prefix</Label>
            <Input
              id="prefix"
              placeholder="e.g., A, B, C1"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              maxLength={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Tickets will be formatted as: {prefix || "A"}001, {prefix || "A"}002, etc.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-primary to-accent text-white"
            >
              Create Counter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
